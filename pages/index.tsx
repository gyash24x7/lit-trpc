import type { NextPage } from "next";
import Flex from "components/flex/flex";
import Card from "components/card/card";
import Stack from "components/stack/stack";
import { IoArrowForward } from "react-icons/io5";
import { useRouter } from "next/router";

const homePage: NextPage = () => {
	const { push } = useRouter();
	return (
		<Flex
			className={ "w-screen min-h-screen p-10 king-yna-bg" }
			direction={ "col" }
			justify={ "center" }
		>
			<h1 className={ "font-black text-6xl pb-10" }>Welcome to Stairway</h1>
			<h3 className={ "text-2xl" }>What do you want to play today?</h3>
			<Stack className={ "py-10" }>
				<Card
					image={ "/assets/literature-icon.png" }
					actions={ [
						{
							buttonText: "Let's Go",
							iconAfter: IoArrowForward,
							appearance: "dark",
							fullWidth: true,
							onClick: async () => {
								await push( "/games/literature" );
							}
						}
					] }
				/>
				<Card
					image={ "/assets/literature-icon.png" }
					actions={ [
						{
							buttonText: "Let's Go",
							iconAfter: IoArrowForward,
							fullWidth: true,
							appearance: "dark",
							onClick: async () => {
								await push( "/games/poker" );
							}
						}
					] }
				/>
			</Stack>
		</Flex>
	);
};

export default homePage;
