import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "libs/prisma";
import * as bcrypt from "bcryptjs";

const authHandler: NextApiHandler = NextAuth( {
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login"
	},
	secret: process.env.SECRET,
	providers: [
		CredentialsProvider( {
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize( credentials ) {
				const user = await prisma.user.findUnique( { where: { email: credentials!.email } } );
				if ( !user ) {
					// TODO: throw not found exception
					return null;
				}

				const isPasswordValid = await bcrypt.compare( credentials!.password, user.password );
				if ( !isPasswordValid ) {
					// TODO: throw exception here
					return null;
				}

				if ( !user.verified ) {
					// TODO: throw not verified exception
					return null
				}

				return user;
			}
		} )
	]
} );

export default authHandler;