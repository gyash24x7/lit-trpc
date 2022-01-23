import { z } from "zod";
import { ProcedureResolver } from "@trpc/server/src/internals/procedure";
import { User } from "@prisma/client";
import { prisma } from "libs/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AVATAR_BASE_URL, passwordRegex } from "constants/index";


export const createUserInput = z.object( {
	name: z.string().nonempty(),
	email: z.string().nonempty().email(),
	password: z.string().nonempty().min( 8 ).regex( passwordRegex )
} );

export type CreateUserInput = z.infer<typeof createUserInput>

export type AuthResponse = {
	user?: User
	token?: string
}

export const createUserResolver: ProcedureResolver<any, CreateUserInput, AuthResponse> = async ( { input } ) => {
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

	const token = jwt.sign(
		{ id: newUser.id },
		process.env.JWT_SECRET!,
		{ subject: newUser.id, expiresIn: "7d" }
	);
	return { user: newUser, token };
};