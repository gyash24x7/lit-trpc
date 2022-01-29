import { NextPage } from "next";
import Button from "components/button/button";
import { signOut, useSession } from "next-auth/react";
import Stack from "components/stack/stack";
import { CreateGame } from "components/app/CreateGame";
import { useState } from "react";
import Flex, { Spacer } from "components/flex/flex";
import Box from "components/box/box";
import { UserCard } from "components/user-card/user-card";
import { IoPower } from "react-icons/io5";
import { JoinGame } from "components/app/JoinGame";

type User = {
	name?: string | null
	image?: string | null
	email?: string | null
}

const literatureHomePage: NextPage = function () {
	const { data: session } = useSession();
	const [ isCreateGameModalOpen, setIsCreateGameModalOpen ] = useState( false );
	const [ isJoinGameModalOpen, setIsJoinGameModalOpen ] = useState( false );

	return (
		<Flex className={ "w-screen min-h-screen p-10 bg-dark-900/70" } direction={ "col" } align={ "center" }>
			<Box className={ "absolute w-screen h-screen literature-bg top-0 -z-10" }/>
			<Stack direction={ "vertical" } className={ "items-center w-80" }>
				<Box>
					<img alt="" src={ "/assets/literature-icon.png" } width={ 200 } height={ 200 }/>
				</Box>
				<h1 className={ "font-black text-6xl pb-10 text-center font-fjalla text-white" }>LITERATURE</h1>
				<Button
					buttonText={ "Create Game" }
					appearance={ "primary" }
					fullWidth
					onClick={ () => setIsCreateGameModalOpen( true ) }
				/>
				<Button
					buttonText={ "Join Game" }
					appearance={ "warning" }
					fullWidth
					onClick={ () => setIsJoinGameModalOpen( true ) }
				/>
				<Button buttonText={ "Instructions" } fullWidth appearance={ "success" }/>
				<Spacer/>
				<UserCard user={ session?.user }/>
				<Button iconBefore={ IoPower } buttonText={ "Logout" } appearance={ "danger" }
						onClick={ () => signOut() }/>
			</Stack>
			<CreateGame isModalOpen={ isCreateGameModalOpen } closeModal={ () => setIsCreateGameModalOpen( false ) }/>
			<JoinGame isModalOpen={ isJoinGameModalOpen } closeModal={ () => setIsJoinGameModalOpen( false ) }/>
		</Flex>
	);
};

export default literatureHomePage;