import { z } from "zod";
import {
	CardSet,
	cardSetMap,
	getCardSet,
	getCardString,
	includesAll,
	includeSome,
	removeIfPresent,
	zodGameCard
} from "utils/deck";
import { LitGame, LitMoveType, LitPlayer } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";

export const callSetInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	set: z.nativeEnum( CardSet ),
	data: z.map( z.string().cuid(), z.array( zodGameCard ) )
} );

export type CallSetInput = z.infer<typeof callSetInput>

export type CallSetResponse = { error: string } | LitGame

export const callSetResolver: TrpcResolver<CallSetInput, CallSetResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findUnique( { where: { id: input.gameId }, include: { players: true } } );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		// TODO: handle user not part of game
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const cardsCalled = Array.from( input.data.values() ).flat();
	if ( cardsCalled.length !== 6 ) {
		return { error: "Select all cards of the set to call!" };
	}

	const cardSet = getCardSet( cardsCalled[ 0 ] );

	if ( !includesAll( cardSetMap[ cardSet ], cardsCalled ) ) {
		return { error: "All cards don't belong to the same set!" };
	}

	if ( input.set !== cardSet ) {
		return { error: "Cards and Set don't match!" };
	}

	const myTeamPlayers = game.players.filter( player => player.teamId === loggedInPlayer.teamId );
	const otherTeamPlayers = game.players.filter( player => player.teamId !== loggedInPlayer.teamId );
	const otherTeamId = otherTeamPlayers[ 0 ].teamId!;

	const playerIdsWithCards = Array.from( input.data.keys() );
	if ( !includesAll( myTeamPlayers.map( player => player.id ), playerIdsWithCards ) ) {
		return { error: "You can only call set from within your team!" };
	}

	let cardsCalledCorrect = 0;
	myTeamPlayers.forEach( ( { id, hand } ) => {
		const cardsCalledForPlayer = input.data.get( id );
		if ( !!cardsCalledForPlayer ) {
			if ( includesAll( hand, cardsCalledForPlayer.map( getCardString ) ) ) {
				cardsCalledCorrect += cardsCalledForPlayer.length;
			}
		}
	} );

	let moveData: { type: LitMoveType, turn: LitPlayer } | undefined;

	if ( cardsCalledCorrect === 6 ) {
		await prisma.litTeam.update( {
			where: { id: loggedInPlayer.teamId! },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_SUCCESS, turn: loggedInPlayer };
	} else {
		await prisma.litTeam.update( {
			where: { id: otherTeamId },
			data: { score: { increment: 1 } }
		} );

		moveData = { type: LitMoveType.CALL_FAIL, turn: otherTeamPlayers[ 0 ] };
	}

	const playersWithCardsCalled = game.players.filter( player => includeSome(
		player.hand,
		cardsCalled.map( getCardString )
	) );

	await Promise.all( playersWithCardsCalled.map( player => prisma.litPlayer.update( {
		where: { id: player.id },
		data: { hand: { set: removeIfPresent( player.hand, cardsCalled.map( getCardString ) ) } }
	} ) ) );

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ moveData ] } }
	} )
};