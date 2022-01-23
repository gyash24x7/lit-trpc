import { z } from "zod";
import { passwordRegex } from "constants/index";
import { ProcedureResolver } from "@trpc/server/src/internals/procedure";
import { AuthResponse } from "./create-user";
import { prisma } from "libs/prisma";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const loginInput = z.object( {
	email: z.string().nonempty().email(),
	password: z.string().nonempty().min( 8 ).regex( passwordRegex )
} );

export type LoginInput = z.infer<typeof loginInput>

export const loginResolver: ProcedureResolver<any, LoginInput, AuthResponse> = async ( { input } ) => {
	const user = await prisma.user.findUnique( { where: { email: input.email } } );
	if ( !user ) {
		// TODO: throw not found exception
		return {};
	}

	const isPasswordValid = await bcrypt.compare( input.password, user.password );
	if ( !isPasswordValid ) {
		// TODO: throw exception here
		return {};
	}

	const token = jwt.sign( { id: user.id }, process.env.JWT_SECRET!, { subject: user.id, expiresIn: "7d" } );
	return { user, token };
};