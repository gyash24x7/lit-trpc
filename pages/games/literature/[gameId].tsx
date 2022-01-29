import { NextPage } from "next";
import Box from "components/box/box";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import Flex from "components/flex/flex";
import Spinner from "components/spinner/spinner";

const gamePlayPage: NextPage = function () {
	const { query } = useRouter();
	const { data, isLoading } = trpc.useQuery( [ "get-game", { gameId: query.gameId as string } ] );

	if ( isLoading ) {
		return (
			<Flex>
				<Spinner/>
			</Flex>
		);
	}

	return (
		<Box>
			Play Page for Game: { query.gameId }
			Game Code: { }
		</Box>
	);
};

export default gamePlayPage;