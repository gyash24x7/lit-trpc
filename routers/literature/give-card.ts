import { z } from "zod";
import { getCardString, zodGameCard } from "utils/deck";
import { LitMoveType } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature/index";

export const giveCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	cardToGive: zodGameCard,
	giveTo: z.string().nonempty().cuid()
} );

export type GiveCardInput = z.infer<typeof giveCardInput>

export const giveCardResolver: TrpcResolver<GiveCardInput, GameResponse> = async ( { input, ctx } ) => {
	const userId = ctx.session?.userId! as string;
	const game = await prisma.litGame.findUnique( { where: { id: input.gameId }, include: { players: true } } );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const takingPlayer = game.players.find( player => player.id === input.giveTo );
	const givingPlayer = game.players.find( player => player.id === userId );

	if ( !takingPlayer || !givingPlayer ) {
		return { error: "Player not found!" };
	}

	const cardToGiveIndex = givingPlayer.hand.indexOf( getCardString( input.cardToGive ) );
	if ( cardToGiveIndex < 0 ) {
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

	const updatedGame = await prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.GIVEN, turn: takingPlayer } ] } }
	} );

	return { data: updatedGame };
};