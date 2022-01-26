import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";
import { createGameInput, createGameResolver } from "routers/literature/create-game";
import { joinGameInput, joinGameResolver } from "routers/literature/join-game";
import { createTeamsInput, createTeamsResolver } from "routers/literature/create-teams";
import { startGameInput, startGameResolver } from "routers/literature/start-game";

export const literatureRouter = trpc.router<TrpcContext>()
	.mutation( "start-lit-game", { input: startGameInput, resolve: startGameResolver } )
	.mutation( "create-lit-teams", { input: createTeamsInput, resolve: createTeamsResolver } )
	.mutation( "join-lit-game", { input: joinGameInput, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );