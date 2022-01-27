import { z } from "zod";
import { LitGameStatus, LitMoveType } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { Deck, getCardString, Rank } from "utils/deck";
import { GameResponse } from "routers/literature/index";

export const startGameInput = z.object( {
	gameId: z.string().nonempty().cuid()
} );

export type StartGameInput = z.infer<typeof startGameInput>

export const startGameResolver: TrpcResolver<StartGameInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findFirst( {
		where: { id: input.gameId, status: LitGameStatus.TEAMS_CREATED },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( Rank.SEVEN ).generateHands( 6 );

	await Promise.all(
		game.players.map(
			( player, i ) => prisma.litPlayer.update( {
				where: { id: player.id },
				data: { hand: { set: hands[ i ].map( getCardString ) } }
			} )
		)
	);

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: { create: [ { type: LitMoveType.TURN, turn: game.players[ 0 ] } ] }
		}
	} );
};