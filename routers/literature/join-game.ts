import { z } from "zod";
import { TrpcResolver } from "utils/trpc";
import { LitGame } from "@prisma/client";
import { prisma } from "prisma/prisma";

export const joinGameInput = z.object( {
	code: z.string().cuid(),
	name: z.string().nonempty()
} );

export type JoinGameInput = z.infer<typeof joinGameInput>

export type JoinGameResponse = { error: string } | LitGame

export const joinGameResolver: TrpcResolver<JoinGameInput, JoinGameResponse> = async ( { ctx, input } ) => {
	const userId = ctx.session?.userId! as string;
	const player = await prisma.litPlayer.create( { data: { name: input.name, userId } } );

	const game = await prisma.litGame.findUnique( {
		where: { code: input.code },
		include: { players: true }
	} );

	if ( !game ) {
		//TODO: throw error game not found
		return { error: "Game not found!" };
	}

	if ( game.players.length >= 6 ) {
		// TODO: handle error better
		return { error: "Game already has 6 players. Cannot join!" };
	}

	return prisma.litGame.update( {
		where: { id: game.id },
		data: { players: { connect: [ { id: player.id } ] } }
	} );
};