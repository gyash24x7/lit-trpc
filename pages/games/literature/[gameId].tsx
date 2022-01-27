import { NextPage } from "next";
import Box from "components/box/box";
import { useRouter } from "next/router";

const gamePlayPage: NextPage = function () {
	const { query } = useRouter();
	return <Box>
		Play Page for Game: { query.gameId }
	</Box>;
};

export default gamePlayPage;