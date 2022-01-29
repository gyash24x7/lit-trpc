import * as z from "zod";
import { getCardString, zodGameCard } from "utils/deck";
import { TrpcResolver } from "utils/trpc";
import { LitMoveType } from "@prisma/client";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature";

export const askCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	askedFor: zodGameCard,
	askedFrom: z.string().nonempty().cuid()
} );

export type AskCardInput = z.infer<typeof askCardInput>

export const askCardResolver: TrpcResolver<AskCardInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game Not Found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const updatedGame = await prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				create: [
					{
						askedFrom: { connect: { id: input.askedFrom } },
						type: LitMoveType.ASK,
						askedFor: getCardString( input.askedFor ),
						askedBy: { connect: { id: loggedInPlayer.id } }
					}
				]
			}
		}
	} );

	return { data: updatedGame };
};