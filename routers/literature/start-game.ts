import { z } from "zod";
import { LitGame, LitGameStatus, LitMoveType } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { Deck, Rank } from "utils/deck";

export const startGameInput = z.object( {
	gameId: z.string().nonempty().cuid()
} );

export type StartGameInput = z.infer<typeof startGameInput>

export type StartGameResponse = { error: string } | LitGame

export const startGameResolver: TrpcResolver<StartGameInput, StartGameResponse> = async ( { input } ) => {
	const game = await prisma.litGame.findFirst( {
		where: {
			id: input.gameId,
			status: LitGameStatus.TEAMS_CREATED
		},
		include: { players: true }
	} );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game not found!" };
	}

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( Rank.SEVEN ).generateHands( 6 );

	await Promise.all(
		game.players.map(
			( player, i ) => prisma.litPlayer.update( {
				where: { id: player.id },
				data: { hand: { set: hands[ i ].map( card => card.getCardString() ) } }
			} )
		)
	);

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: {
				create: [
					{
						type: LitMoveType.TURN,
						description: `${ game.players[ 0 ].name }' Turn`,
						turn: game.players[ 0 ]
					}
				]
			}
		}
	} );
};