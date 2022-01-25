import { z } from "zod";
import { prisma } from "prisma/prisma";
import * as bcrypt from "bcryptjs";
import {
	AVATAR_BASE_URL,
	EMAIL_VERIFICATION_SUBJECT,
	passwordRegex,
	VERIFICATION_BASE_URL
} from "utils/constants";
import { sendMail } from "utils/sendgrid";
import type { TrpcResolver } from "utils/trpc";


export const createUserInput = z.object( {
	name: z.string().nonempty(),
	email: z.string().nonempty().email(),
	password: z.string().nonempty().min( 8 ).regex( passwordRegex )
} );

export type CreateUserInput = z.infer<typeof createUserInput>

export type CreateUserResponse = {
	message?: "User Created!"
}

export const createUserResolver: TrpcResolver<CreateUserInput, CreateUserResponse> = async ( { input } ) => {
	const existingUser = await prisma.user.findUnique( { where: { email: input.email } } );
	if ( existingUser ) {
		// TODO: throw conflict exception here
		return {};
	}

	const salt = await bcrypt.genSalt( 10 );
	const hashedPassword = await bcrypt.hash( input.password, salt );
	const newUser = await prisma.user.create( {
		data: {
			...input,
			password: hashedPassword,
			salt,
			profilePic: `${ AVATAR_BASE_URL }/${ salt }.svg?radius=50`
		}
	} );

	const emailVerificationHash = await bcrypt.genSalt( 15 );
	await prisma.verificationToken.create( { data: { token: emailVerificationHash, userId: newUser.id } } );

	await sendMail( {
		to: newUser.email,
		subject: EMAIL_VERIFICATION_SUBJECT,
		text: `${ VERIFICATION_BASE_URL }?token=${ emailVerificationHash }`
	} );

	return { message: "User Created!" };
};