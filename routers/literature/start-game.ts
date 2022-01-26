import { z } from "zod";
import { LitGame, LitGameStatus, LitMoveType } from "@prisma/client";
import { TrpcResolver } from "utils/trpc";
import { prisma } from "prisma/prisma";
import { Deck, getCardString, Rank } from "utils/deck";

export const startGameInput = z.object( {
	gameId: z.string().nonempty().cuid()
} );

export type StartGameInput = z.infer<typeof startGameInput>

export type StartGameResponse = { error: string } | LitGame

export const startGameResolver: TrpcResolver<StartGameInput, StartGameResponse> = async ( { input, ctx } ) => {
	const loggedInUserId = ctx.session?.userId! as string;

	const game = await prisma.litGame.findFirst( {
		where: { id: input.gameId, status: LitGameStatus.TEAMS_CREATED },
		include: { players: true }
	} );

	if ( !game ) {
		// TODO: handle game not found
		return { error: "Game not found!" };
	}

	const loggedInPlayer = game.players.find( player => player.userId === loggedInUserId );

	if ( !loggedInPlayer ) {
		// TODO: handle user not part of game
		return { error: "You are not part of the game. Cannot perform action!" };
	}

	const deck = new Deck();
	const hands = deck.removeCardsOfRank( Rank.SEVEN ).generateHands( 6 );

	await Promise.all(
		game.players.map(
			( player, i ) => prisma.litPlayer.update( {
				where: { id: player.id },
				data: { hand: { set: hands[ i ].map( getCardString ) } }
			} )
		)
	);

	return prisma.litGame.update( {
		where: { id: input.gameId },
		data: {
			status: LitGameStatus.IN_PROGRESS,
			moves: {
				create: [
					{ type: LitMoveType.TURN, turn: game.players[ 0 ] }
				]
			}
		}
	} );
};