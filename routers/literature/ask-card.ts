import { z } from "zod";
import { Rank } from "utils/deck";
import { TrpcResolver } from "utils/trpc";
import { LitGame, LitMoveType } from "@prisma/client";
import { prisma } from "prisma/prisma";

export const askCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	askedFor: z.nativeEnum( Rank ),
	askedFrom: z.string().nonempty().cuid()
} );

export type AskCardInput = z.infer<typeof askCardInput>

export type AskCardResponse = { error: string } | LitGame

export const askCardResolver: TrpcResolver<AskCardInput, AskCardResponse> = async ( { input, ctx } ) => {
	const askedById = ctx.session?.userId! as string;

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				create: [
					{
						askedFrom: { connect: { id: input.askedFrom } },
						type: LitMoveType.ASK,
						askedFor: input.askedFor,
						askedBy: { connect: { id: askedById } }
					}
				]
			}
		}
	} );
};