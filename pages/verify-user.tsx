import { NextPage } from "next";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { useMount } from "react-use";
import Flex from "components/flex/flex";
import Spinner from "components/spinner/spinner";

const verifyUserPage: NextPage = function () {
	const { replace, query } = useRouter();
	const { mutateAsync } = trpc.useMutation( [ "verify-user" ], {
		async onSettled() {
			await replace( "/login" );
		}
	} );

	useMount( async () => {
		await mutateAsync( { token: query.token as string } );
	} );

	return (
		<Flex className={ "w-screen h-screen" } justify={ "center" } align={ "center" }>
			<Spinner size="large"/>
		</Flex>
	);
};

export default verifyUserPage;