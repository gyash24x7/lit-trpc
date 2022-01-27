import { z } from "zod";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { GameResponse } from "routers/literature/index";

export const createTeamsInput = z.object( {
	teams: z.array( z.string().nonempty() ).length( 2 ),
	gameId: z.string().cuid()
} );

export type CreateTeamsInput = z.infer<typeof createTeamsInput>

export const createTeamsResolver: TrpcResolver<CreateTeamsInput, GameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findUnique( {
		where: { id: input.gameId },
		include: { players: true }
	} );

	if ( !game ) {
		return { error: "Game not found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	if ( game.players.length !== 6 ) {
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