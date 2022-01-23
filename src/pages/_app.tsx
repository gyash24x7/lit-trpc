import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/routers";

function App( { Component, pageProps }: AppProps ) {
	return <Component { ...pageProps } />;
}

export default withTRPC<AppRouter>( {
	config( { ctx } ) {
		return { url: "http://localhost:3000/api/trpc" };
	},
	ssr: true
} )( App );
