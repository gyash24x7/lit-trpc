import { z } from "zod";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature/index";

export const getGameInput = z.object( {
	gameId: z.string().nonempty().cuid()
} );

export type GetGameInput = z.infer<typeof getGameInput>

export const getGameResolver: TrpcResolver<GetGameInput, GameResponse> = async ( { input, ctx } ) => {
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

	return { data: game };
};