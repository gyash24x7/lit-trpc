import * as trpc from "@trpc/server";
import { createUserInput, createUserResolver } from "./create-user";
import { loginInput, loginResolver } from "./login";

export const usersRouter = trpc.router()
	.mutation( "create-user", { input: createUserInput, resolve: createUserResolver } )
	.mutation( "login", { input: loginInput, resolve: loginResolver } );