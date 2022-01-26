import { z } from "zod";
import { TrpcResolver } from "utils/trpc";
import { LitGame } from "@prisma/client";
import { prisma } from "prisma/prisma";

export const createTeamsInput = z.object( {
	teams: z.array( z.string().nonempty() ).length( 2 ),
	gameId: z.string().cuid()
} );

export type CreateTeamsInput = z.infer<typeof createTeamsInput>

export type CreateTeamsResponse = { error: string } | LitGame

export const createTeamsResolver: TrpcResolver<CreateTeamsInput, CreateTeamsResponse> = async ( { input } ) => {
	const game = await prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game not found!" };
	}

	if ( game.players.length !== 6 ) {
		// TODO: handle insufficient number of players
		return { error: "A game needs to have 6 players. Not enough players!" };
	}

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			teams: {
				create: input.teams.map( ( t, index ) => (
					{
						name: t,
						players: { connect: game.players.slice( index * 3, 3 + index * 3 ) }
					}
				) )
			}
		}
	} );
};