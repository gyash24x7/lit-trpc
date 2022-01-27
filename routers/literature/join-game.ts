import { z } from "zod";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature/index";

export const joinGameInput = z.object( {
	code: z.string().cuid(),
	name: z.string().nonempty()
} );

export type JoinGameInput = z.infer<typeof joinGameInput>

export const joinGameResolver: TrpcResolver<JoinGameInput, GameResponse> = async ( { ctx, input } ) => {
	const userId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findUnique( {
		where: { code: input.code },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	if ( game.players.length >= 6 ) {
		return { error: "Game already has 6 players. Cannot join!" };
	}

	const userAlreadyInGame = !!game.players.find( player => player.userId === userId );
	if ( userAlreadyInGame ) {
		return { error: "You have already joined the game!" };
	}

	const player = await prisma.litPlayer.create( { data: { name: input.name, userId } } );

	return prisma.litGame.update( {
		where: { id: game.id },
		data: { players: { connect: [ { id: player.id } ] } }
	} );
};