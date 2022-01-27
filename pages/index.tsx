import type { NextPage } from "next";
import { useRouter } from "next/router";
import Spinner from "components/spinner/spinner";
import { useMount } from "react-use";

const homePage: NextPage = () => {
	const { push } = useRouter();

	useMount( () => push( "/games/literature" ) )

	return (
		<Spinner/>
	);
};

export default homePage;
