import { GetServerSideProps, NextPage } from "next";
import Flex, { Spacer } from "components/flex/flex";
import Box from "components/box/box";
import Button from "components/button/button";
import Stack from "components/stack/stack";
import { TextInput } from "components/input/input";
import { IoLockClosed, IoMail } from "react-icons/io5";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ClientSafeProvider, getProviders, getSession, signIn } from "next-auth/react";

interface LoginProps {
	credentialsProvider?: ClientSafeProvider;
}

const loginPage: NextPage<LoginProps> = function ( { credentialsProvider } ) {
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const [ isLoading, setIsLoading ] = useState( false );

	async function handleLogin( e: FormEvent ) {
		e.preventDefault();
		setIsLoading( true );
		await signIn( credentialsProvider?.id, { email, password } ).finally( () => setIsLoading( false ) );
	}

	return (
		<Flex>
			<Flex
				className={ "flex-1 p-20 max-w-lg" }
				align={ "center" }
			>
				<Box className={ "w-full" }>
					<h1 className={ "font-bold text-2xl uppercase my-5" }>Login</h1>
					<form onSubmit={ handleLogin } noValidate>
						<Stack direction={ "vertical" }>
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
								<p>Don't have an account?</p>
								<Spacer/>
								<Link href="/sign-up">
									<a className="text-primary">Sign Up</a>
								</Link>
							</Flex>
						</Stack>
					</form>
				</Box>
			</Flex>
			<Box className="flex-1 h-screen bg-gradient-to-l from-dark to-primary"/>
		</Flex>
	);
};

export default loginPage;

export const getServerSideProps: GetServerSideProps<LoginProps> = async function ( { req } ) {
	const providers = await getProviders();
	const credentialsProvider = providers?.credentials;

	const session = await getSession( { req } );
	if ( session ) {
		return { redirect: { destination: "/", permanent: false } };
	}

	return { props: { credentialsProvider } };
};