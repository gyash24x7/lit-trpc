import { z } from "zod";
import { getCardString, zodGameCard } from "utils/deck";
import { LitGame, LitMoveType } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";

export const giveCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	cardToGive: zodGameCard,
	giveTo: z.string().nonempty().cuid()
} );

export type GiveCardInput = z.infer<typeof giveCardInput>

export type GiveCardResponse = { error: string } | LitGame

export const giveCardResolver: TrpcResolver<GiveCardInput, GiveCardResponse> = async ( { input, ctx } ) => {
	const userId = ctx.session?.userId! as string;
	const game = await prisma.litGame.findUnique( { where: { id: input.gameId }, include: { players: true } } );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game Not Found!" };
	}

	const takingPlayer = game.players.find( player => player.id === input.giveTo );
	const givingPlayer = game.players.find( player => player.id === userId );

	if ( !takingPlayer || !givingPlayer ) {
		// TODO: handle player not found
		return { error: "Player not found!" };
	}

	const cardToGiveIndex = givingPlayer.hand.indexOf( getCardString( input.cardToGive ) );
	if ( cardToGiveIndex < 0 ) {
		// TODO: handle card not owned
		return { error: "You cannot give a card that you don't have!" };
	}

	await Promise.all( [
		prisma.litPlayer.update( {
			where: { id: givingPlayer.id },
			data: { hand: { set: givingPlayer.hand.splice( cardToGiveIndex, 1 ) } }
		} ),
		prisma.litPlayer.update( {
			where: { id: takingPlayer.id },
			data: { hand: { push: getCardString( input.cardToGive ) } }
		} )
	] );

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.TURN, turn: takingPlayer } ] } }
	} );
};