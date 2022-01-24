import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Box from "components/box/box";
import Button from "components/button/button";
import Flex from "components/flex/flex";
import Spinner from "components/spinner/spinner";

const Home: NextPage = () => {
	const { data: session, status } = useSession();

	if ( status === "loading" ) {
		return (
			<Flex className={ "w-screen h-screen" } justify={ "center" } align={ "center" }>
				<Spinner size={ "medium" } appearance={ "primary" }/>
			</Flex>
		);
	}

	if ( session ) {
		return (
			<Box>
				<p>User Logged In: { session.user?.name }</p>
				<Button buttonText="Logout" onClick={ () => signOut() }/>
			</Box>
		);
	} else {
		return (
			<Box>
				<p>User Not Logged In</p>
				<Button buttonText="Login" onClick={ () => signIn() }/>
			</Box>
		);
	}
};

export default Home;
