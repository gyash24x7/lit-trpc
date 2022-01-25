import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";
import { createGameInput, createGameResolver } from "routers/literature/create-game";

export const literatureRouter = trpc.router<TrpcContext>()
	.mutation( "create-lit-game", { input: createGameInput, resolve: createGameResolver } );