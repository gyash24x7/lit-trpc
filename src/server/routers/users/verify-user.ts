import { z } from "zod";
import { ProcedureResolver } from "@trpc/server/src/internals/procedure";
import { prisma } from "libs/prisma";

export const verifyUserInput = z.string().nonempty();

export const verifyUserResolver: ProcedureResolver<any, string, { message: string }> = async ( { input } ) => {
	const token = await prisma.verificationToken.findUnique( { where: { token: input } } );
	if ( !token ) {
		// TODO: throw token not found error
		return { message: "Token Not Found!" };
	}

	await prisma.user.update( { where: { id: token.userId }, data: { verified: true } } );
	return { message: "User verified!" };
};