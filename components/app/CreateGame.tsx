import { Modal } from "components/modal/modal";
import { TextInput } from "components/input/input";
import { useState } from "react";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { LitGame } from "@prisma/client";

export interface CreateGameProps {
	isModalOpen: boolean;
	closeModal: () => any;
}

export const CreateGame = function ( props: CreateGameProps ) {
	const [ alias, setAlias ] = useState( "" );
	const { push } = useRouter();

	const { mutateAsync, isLoading } = trpc.useMutation( "create-lit-game", {
		async onSuccess( data ) {
			const { id } = data as LitGame;
			await push( `/games/literature/${ id }` );
		},
		onError( error ) {
			console.log( error );
			alert( error.message );
		}
	} );

	return (
		<Modal
			isOpen={ props.isModalOpen }
			onClose={ props.closeModal }
			title={ "Create New Game" }
			actions={ [
				{
					appearance: "primary",
					fullWidth: true,
					onClick: () => mutateAsync( { name: alias } ),
					buttonText: "Submit",
					isLoading
				}
			] }
		>
			<TextInput
				name={ "alias" }
				value={ alias }
				onChange={ setAlias }
				placeholder={ "Enter your alias" }
			/>
		</Modal>
	);
};