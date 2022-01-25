import { NextPage } from "next";
import Box from "components/box/box";
import Button from "components/button/button";
import { signOut } from "next-auth/react";

const literatureHomePage: NextPage = function () {
	return (
		<Box>
			<p>Literature Home Page</p>
			<Button buttonText={ "Logout" } onClick={ () => signOut() }/>
		</Box>
	);
};

export default literatureHomePage;