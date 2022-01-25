import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";
import { createGameInput, createGameResolver } from "routers/literature/create-game";
import { joinGameInput, joinGameResolver } from "routers/literature/join-game";

export const literatureRouter = trpc.router<TrpcContext>()
	.mutation( "join-lit-game", { input: joinGameInput, resolve: joinGameResolver } )
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );