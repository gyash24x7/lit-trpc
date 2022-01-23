import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useMount } from "react-use";

const verifyUserPage: NextPage = function () {
	const { replace, query } = useRouter();
	const { mutateAsync } = trpc.useMutation( [ "verify-user" ], {
		async onSettled( data, error ) {
			console.log( data );
			console.log( error );
			await replace( "/" );
		}
	} );

	useMount( async () => {
		await mutateAsync( query.token as string );
	} );

	return <div>Loading...</div>;
};

export default verifyUserPage;