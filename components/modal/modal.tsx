import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";
import { Button, ButtonProps } from "components/button/button";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	actions?: ButtonProps[];
}

export const Modal: FC<ModalProps> = function ( { isOpen, onClose, children, title, actions } ) {
	return (
		<Transition appear show={ isOpen } as={ Fragment }>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				onClose={ onClose }
			>
				<div className="min-h-screen px-4 text-center">
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-dark-500/50"/>
					</Transition.Child>
					<span
						className="inline-block h-screen align-middle"
						aria-hidden="true"
					/>
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div
							className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
							{ title && (
								<Dialog.Title as="h3" className="text-xl font-bold leading-6 mb-4">
									{ title }
								</Dialog.Title>
							) }
							{ children && (
								<div className="mt-4">
									{ children }
								</div>
							) }

							<div className="mt-6">
								{ actions?.map( ( btnProps ) => (
									<Button key={ btnProps.buttonText } { ...btnProps }/>
								) ) }
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};
