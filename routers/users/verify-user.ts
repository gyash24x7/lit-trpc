import { z } from "zod";
import { prisma } from "prisma/prisma";
import { TrpcResolver } from "utils/trpc";

export const verifyUserInput = z.object( {
	token: z.string().nonempty()
} );

export type VerifyUserInput = z.infer<typeof verifyUserInput>

export type VerifyUserResponse = { error: string } | { message: string }

export const verifyUserResolver: TrpcResolver<VerifyUserInput, VerifyUserResponse> = async ( { input } ) => {
	const token = await prisma.verificationToken.findUnique( { where: { token: input.token } } );
	if ( !token ) {
		// TODO: throw token not found error
		return { message: "Token Not Found!" };
	}

	await prisma.user.update( { where: { id: token.userId }, data: { verified: true } } );
	await prisma.verificationToken.delete( { where: { token: input.token } } );
	return { message: "User verified!" };
};