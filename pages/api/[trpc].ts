import * as trpcNext from "@trpc/server/adapters/next";
import { AppRouter, appRouter as router } from "routers";
import { createContext } from "utils/trpc";

export default trpcNext.createNextApiHandler<AppRouter>( { router, createContext } );