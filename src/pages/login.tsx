import { NextPage } from "next";
import Flex, { Spacer } from "components/flex/flex";
import Box from "components/box/box";
import Button from "components/button/button";
import Stack from "components/stack/stack";
import { TextInput } from "components/input/input";
import { IoLockClosed, IoMail } from "react-icons/io5";
import { FormEvent, useState } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import Link from "next/link";

const loginPage: NextPage = function () {
	const [ email, setEmail ] = useState( "" );
	const [ password, setPassword ] = useState( "" );
	const { replace } = useRouter();

	const { mutateAsync, isLoading, isError } = trpc.useMutation( [ "login" ], {
		async onSuccess() {
			await replace( "/" );
		}
	} );

	async function handleLogin( e: FormEvent ) {
		e.preventDefault();
		await mutateAsync( { email, password } );
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