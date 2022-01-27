import { NextPage } from "next";
import Box from "components/box/box";
import Button from "components/button/button";
import { signOut } from "next-auth/react";
import { IoPower } from "react-icons/io5";

const literatureHomePage: NextPage = function () {
	return (
		<Box className={ "w-screen min-h-screen p-10 king-yna-bg" }>
			<h1 className={ "font-black text-6xl pb-10" }>Welcome to Literature</h1>
			<Button
				buttonText={ "Logout" }
				iconBefore={ IoPower }
				onClick={ () => signOut() }
			/>
		</Box>
	);
};

export default literatureHomePage;