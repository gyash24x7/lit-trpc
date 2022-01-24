import classNames from "classnames";
import Flex from "../flex/flex";
import { Appearance } from "../utils/utils";

export interface SpinnerProps {
	size?: "small" | "medium" | "large";
	appearance?: Appearance;
}

export function Spinner( { size, appearance }: SpinnerProps ) {
	const spinnerClassnames = classNames(
		"inline-block",
		"border-solid",
		"rounded-full",
		"border-default",
		{ "border-danger": appearance === "danger" },
		{ "border-primary": appearance === "primary" },
		{ "border-warning": appearance === "warning" },
		{ "border-dark": appearance === "dark" },
		{ "border-success": appearance === "success" },
		{ "border-subtle": appearance === "subtle" },
		"border-b-transparent",
		"border-l-transparent",
		"animate-spin",
		"w-4 h-4 border-2",
		{ "w-16 h-16 border-8": size === "large" },
		{ "w-8 h-8 border-4": size === "medium" }
	);

	return (
		<Flex justify={ "center" } align={ "center" }>
			<div className={ spinnerClassnames }/>
		</Flex>
	);
}

export default Spinner;