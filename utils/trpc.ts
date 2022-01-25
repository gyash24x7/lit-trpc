import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "routers";
import { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export const trpc = createReactQueryHooks<AppRouter>();

export const createContext = async ( { req, res }: CreateNextContextOptions ) => {
	const session = await getSession( { req } );
	return { req, res, session };
};

export type TrpcContext = inferAsyncReturnType<typeof createContext>