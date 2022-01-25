import { TrpcResolver } from "utils/trpc";
import { z } from "zod";
import { prisma } from "prisma/prisma";
import cuid from "cuid";
import type { LitGame } from "@prisma/client";

export const createGameInput = z.object( {
	name: z.string().nonempty()
} );

export type CreateGameInput = z.infer<typeof createGameInput>

export const createGameResolver: TrpcResolver<CreateGameInput, LitGame> = async ( { ctx, input } ) => {
	const userId = ctx.session!.userId as string;
	const player = await prisma.litPlayer.create( { data: { name: input.name, userId } } );

	return prisma.litGame.create( {
		data: {
			code: cuid.slug().toUpperCase(),
			players: { connect: [ { id: player.id } ] }
		}
	} );
};