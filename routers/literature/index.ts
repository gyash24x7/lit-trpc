import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";
import { createGameInput, createGameResolver } from "routers/literature/create-game";
import { joinGameInput, joinGameResolver } from "routers/literature/join-game";
import { createTeamsInput, createTeamsResolver } from "routers/literature/create-teams";

export const literatureRouter = trpc.router<TrpcContext>()
	.mutation( "create-lit-teams", { input: createTeamsInput, resolve: createTeamsResolver } )
	.mutation( "join-lit-game", { input: joinGameInput, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );