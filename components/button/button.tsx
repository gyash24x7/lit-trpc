import classNames from "classnames";
import { Appearance } from "components/utils/utils";
import { IconType } from "react-icons";
import Spinner from "components/spinner/spinner";

export interface ButtonProps {
	type?: "submit" | "reset";
	fullWidth?: boolean;
	iconBefore?: IconType;
	iconAfter?: IconType;
	buttonText?: string;
	appearance?: Appearance;
	onClick?: () => any | Promise<any>;
	isLoading?: boolean;
	variant?: "default" | "subtle";
}

export function Button( { buttonText, appearance = "default", ...props }: ButtonProps ) {
	const buttonClassnames = classNames(
		"inline-flex",
		"justify-center",
		"py-2",
		"items-center",
		"px-4",
		"border",
		"border-transparent",
		"text-sm",
		"font-semibold",
		"rounded-md",
		"text-white",
		{ "bg-primary-500 hover:bg-primary-400 focus:ring-primary-400": appearance === "primary" },
		{ "bg-success-500 hover:bg-success-400 focus:ring-success-400": appearance === "success" },
		{ "bg-default-500 hover:bg-default-600 focus:ring-default-600 text-black": appearance === "default" },
		{ "hover:bg-default-400 text-black": appearance === "subtle" },
		{ "bg-warning-500 hover:bg-warning-400 focus:ring-warning-400 text-black": appearance === "warning" },
		{ "bg-danger-500 hover:bg-danger-400 focus:ring-danger-400": appearance === "danger" },
		{ "bg-dark-500 hover:bg-dark-400 focus:ring-dark-400": appearance === "dark" },
		{ "w-full": props.fullWidth!! },
		"focus:outline-none",
		"focus:ring-2",
		"focus:ring-offset-2",
		{ "pointer-events-none": props.isLoading }
	);

	const IconBefore = props.iconBefore;
	const iconBeforeClassnames = classNames( "w-4", "h-4", { "mr-4": props.isLoading || !!buttonText } );
	const IconAfter = props.iconAfter;
	const iconAfterClassnames = classNames( "w-4", "h-4", { "ml-4": props.isLoading || !!buttonText } );

	return (
		<button
			className={ buttonClassnames }
			type={ props.type }
			onClick={ props.onClick }
		>

			{ IconBefore!! && <IconBefore className={ iconBeforeClassnames }/> }
			{ (
				props.isLoading || !!buttonText
			) && (
				<span
					className={ classNames(
						{ "mr-1": IconBefore!! },
						{ "ml-1": IconAfter!! }
					) }
				>
				{ props.isLoading ? <Spinner/> : buttonText }
			</span>
			) }
			{ IconAfter!! && <IconAfter className={ iconAfterClassnames }/> }
		</button>
	);
}


export default Button;
