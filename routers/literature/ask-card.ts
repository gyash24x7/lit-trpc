import * as z from "zod";
import { getCardString, zodGameCard } from "utils/deck";
import { TrpcResolver } from "utils/trpc";
import { LitGame, LitMoveType } from "@prisma/client";
import { prisma } from "prisma/prisma";

export const askCardInput = z.object( {
	gameId: z.string().nonempty().cuid(),
	askedFor: zodGameCard,
	askedFrom: z.string().nonempty().cuid()
} );

export type AskCardInput = z.infer<typeof askCardInput>

export type AskCardResponse = { error: string } | LitGame

export const askCardResolver: TrpcResolver<AskCardInput, AskCardResponse> = async ( { input, ctx } ) => {
	const askedById = ctx.session?.userId! as string;
	const game = await prisma.litGame.findUnique( { where: { id: input.gameId } } );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game Not Found!" };
	}

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			moves: {
				create: [
					{
						askedFrom: { connect: { id: input.askedFrom } },
						type: LitMoveType.ASK,
						askedFor: getCardString( input.askedFor ),
						askedBy: { connect: { id: askedById } }
					}
				]
			}
		}
	} );
};