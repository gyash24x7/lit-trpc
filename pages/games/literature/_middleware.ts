import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";

export default async function ( req: NextApiRequest ) {
	const session = await getToken( { req, secret: process.env.SECRET! } );
	if ( !session ) {
		return NextResponse.redirect( "/login" );
	}
	return NextResponse.next();
};