import * as trpc from "@trpc/server";
import { usersRouter } from "routers/users";
import { literatureRouter } from "routers/literature";
import { TrpcContext } from "utils/trpc";

export const appRouter = trpc.router<TrpcContext>().merge( usersRouter ).merge( literatureRouter );

export type AppRouter = typeof appRouter