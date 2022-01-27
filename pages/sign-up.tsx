import { GetServerSideProps, NextPage } from "next";
import Flex, { Spacer } from "components/flex/flex";
import Box from "components/box/box";
import Button from "components/button/button";
import Stack from "components/stack/stack";
import { TextInput } from "components/input/input";
import { IoLockClosed, IoMail, IoPerson } from "react-icons/io5";
import { FormEvent, useState } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import Link from "next/link";
import { ClientSafeProvider, getProviders, getSession } from "next-auth/react";

interface SignUpProps {
	credentialsProvider?: ClientSafeProvider;
}

const signUpPage: NextPage<SignUpProps> = function () {
	const [ name, setName ] = useState( "" );
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const { replace } = useRouter();

	const { mutateAsync, isLoading } = trpc.useMutation( [ "create-user" ], {
		async onSuccess() {
			await replace( "/login" );
		}
	} );

	async function handleSignUp( e: FormEvent ) {
		e.preventDefault();
		await mutateAsync( { email, password, name } );
	}

	return (
		<Flex>
			<Flex
				className={ "flex-1 p-20 max-w-lg" }
				align={ "center" }
			>
				<Box className={ "w-full" }>
					<h1 className={ "font-bold text-2xl uppercase my-5" }>Sign Up</h1>
					<form onSubmit={ handleSignUp } noValidate>
						<Stack direction={ "vertical" }>
							<TextInput
								name={ "name" }
								label={ "Name" }
								value={ name }
								onChange={ setName }
								iconBefore={ IoPerson }
							/>
							<TextInput
								name={ "email" }
								label={ "Email" }
								type={ "email" }
								iconBefore={ IoMail }
								value={ email }
								onChange={ setEmail }
							/>
							<TextInput
								name={ "password" }
								label={ "Password" }
								type={ "password" }
								iconBefore={ IoLockClosed }
								value={ password }
								onChange={ setPassword }
							/>
							<Button
								type="submit"
								fullWidth
								appearance={ "primary" }
								isLoading={ isLoading }
								buttonText={ "Submit" }
							/>
							<Flex>
								<p>Already have an account?</p>
								<Spacer/>
								<Link href="/login">
									<a className="text-primary">Login</a>
								</Link>
							</Flex>
						</Stack>
					</form>
				</Box>
			</Flex>
			<Box className="flex-1 h-screen literature-bg from-dark to-primary"/>
		</Flex>
	);
};

export default signUpPage;

export const getServerSideProps: GetServerSideProps<SignUpProps> = async function ( { req } ) {
	const providers = await getProviders();
	const credentialsProvider = providers?.credentials;

	const session = await getSession( { req } );
	if ( session ) {
		return { redirect: { destination: "/", permanent: false } };
	}

	return { props: { credentialsProvider } };
};