import * as trpc from "@trpc/server";
import { createUserInput, createUserResolver } from "routers/users/create-user";
import { verifyUserInput, verifyUserResolver } from "routers/users/verify-user";
import { TrpcContext } from "utils/trpc";

export const usersRouter = trpc.router<TrpcContext>()
	.mutation( "create-user", { input: createUserInput, resolve: createUserResolver } )
	.mutation( "verify-user", { input: verifyUserInput, resolve: verifyUserResolver } );