import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "routers";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";
import { ProcedureResolver } from "@trpc/server/src/internals/procedure";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

export const trpc = createReactQueryHooks<AppRouter>();

export const createContext = async ( { req, res }: CreateNextContextOptions ) => {
	const session = await getSession( { req } );
	return { req, res, session };
};

export type TrpcContext = {
	req: NextApiRequest
	res: NextApiResponse
	session?: Session
}

export type TrpcResolver<I = any, R = any> = ProcedureResolver<TrpcContext, I, R>