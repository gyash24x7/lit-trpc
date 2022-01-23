import * as trpc from "@trpc/server";
import { createUserInput, createUserResolver } from "./create-user";
import { loginInput, loginResolver } from "./login";
import { verifyUserInput, verifyUserResolver } from "./verify-user";

export const usersRouter = trpc.router()
	.mutation( "create-user", { input: createUserInput, resolve: createUserResolver } )
	.mutation( "login", { input: loginInput, resolve: loginResolver } )
	.mutation( "verify-user", { input: verifyUserInput, resolve: verifyUserResolver } );