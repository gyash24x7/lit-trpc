import "../styles/globals.css";

import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";

import "@fontsource/fjalla-one";

import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "routers";
import { SessionProvider } from "next-auth/react";

const app = function ( { Component, pageProps: { session, ...pageProps } }: AppProps ) {
	return (
		<SessionProvider session={ session }>
			<Component { ...pageProps } />
		</SessionProvider>
	);
};

export default withTRPC<AppRouter>( {
	config: () => (
		{ url: "http://localhost:3000/api" }
	),
	ssr: true
} )( app );
