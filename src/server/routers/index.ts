import * as trpc from "@trpc/server";
import { usersRouter } from "./users";

export const appRouter = trpc.router().merge( usersRouter );