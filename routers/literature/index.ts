import * as trpc from "@trpc/server";
import { TrpcContext } from "utils/trpc";

export const literatureRouter = trpc.router<TrpcContext>();