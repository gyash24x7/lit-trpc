import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";
import { createGameInput, createGameResolver } from "routers/literature/create-game";
import { joinGameInput, joinGameResolver } from "routers/literature/join-game";
import { createTeamsInput, createTeamsResolver } from "routers/literature/create-teams";
import { startGameInput, startGameResolver } from "routers/literature/start-game";
import { askCardInput, askCardResolver } from "routers/literature/ask-card";
import { giveCardInput, giveCardResolver } from "routers/literature/give-card";
import { declineCardInput, declineCardResolver } from "routers/literature/decline-card";
import { getGameInput, getGameResolver } from "routers/literature/get-game";
import { LitGame } from "@prisma/client";
import { callSetInput, callSetResolver } from "routers/literature/call-set";
import { transferTurnInput, transferTurnResolver } from "routers/literature/transfer-turn";

export type GameResponse = { error: string } | LitGame

export const literatureRouter = trpc.router<TrpcContext>()
	.query( "get-game", { input: getGameInput, resolve: getGameResolver } )
	.mutation( "transfer-turn", { input: transferTurnInput, resolve: transferTurnResolver } )
	.mutation( "call-set", { input: callSetInput, resolve: callSetResolver } )
	.mutation( "decline-card", { input: declineCardInput, resolve: declineCardResolver } )
	.mutation( "give-card", { input: giveCardInput, resolve: giveCardResolver } )
	.mutation( "ask-card", { input: askCardInput, resolve: askCardResolver } )
	.mutation( "start-lit-game", { input: startGameInput, resolve: startGameResolver } )
	.mutation( "create-lit-teams", { input: createTeamsInput, resolve: createTeamsResolver } )
	.mutation( "join-lit-game", { input: joinGameInput, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );