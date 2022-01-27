import { z } from "zod";
import { getCardString, zodGameCard } from "utils/deck";
import { TrpcResolver } from "utils/trpc";
import { LitMoveType } from "@prisma/client";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature/index";

export const declineCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	cardDeclined: zodGameCard
} );

export type DeclineCardInput = z.infer<typeof declineCardInput>

export const declineCardResolver: TrpcResolver<DeclineCardInput, GameResponse> = async ( { ctx, input } ) => {
	const loggedInUserId = ctx.session?.userId! as string;
	const game = await prisma.litGame.findUnique( { where: { id: input.gameId }, include: { players: true } } );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const playerHasCard = loggedInPlayer.hand.includes( getCardString( input.cardDeclined ) );

	if ( playerHasCard ) {
		return { error: "You cannot decline a card that you have!" };
	}

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: { moves: { create: [ { type: LitMoveType.DECLINED, turn: loggedInPlayer } ] } }
	} );
};