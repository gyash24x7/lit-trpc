import * as trpc from "@trpc/server";
import { createUserInput, createUserResolver } from "server/routers/users/create-user";
import { verifyUserInput, verifyUserResolver } from "server/routers/users/verify-user";

export const usersRouter = trpc.router()
	.mutation( "create-user", { input: createUserInput, resolve: createUserResolver } )
	.mutation( "verify-user", { input: verifyUserInput, resolve: verifyUserResolver } );