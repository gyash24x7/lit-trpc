import { TrpcResolver } from "utils/trpc";
import { z } from "zod";
import { prisma } from "prisma/prisma";
import cuid from "cuid";
import type { LitGame } from "@prisma/client";

export const createGameInput = z.string().nonempty();

export type CreateGameInput = z.infer<typeof createGameInput>

export const createGameResolver: TrpcResolver<CreateGameInput, LitGame> = async ( { ctx, input } ) => {
	const userId = ctx.session!.userId as string;
	const firstPlayer = await prisma.litPlayer.create( { data: { name: input, userId } } );

	return await prisma.litGame.create( {
		data: {
			code: cuid.slug().toUpperCase(),
			players: {
				connect: [ { id: firstPlayer.id } ]
			}
		}
	} );
};