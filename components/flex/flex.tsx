import classNames from "classnames";
import { ReactNode } from "react";
import Box from "components/box/box";

export interface FlexProps {
	justify?: "center" | "start" | "end" | "space-between" | "space-around" | "space-evenly";
	align?: "center" | "start" | "end" | "baseline" | "stretch";
	direction?: "row" | "col" | "row-reverse" | "col-reverse";
	children?: ReactNode;
	className?: string;
}

export function Spacer() {
	return <Box className="flex-1"/>;
}

export function Flex( props: FlexProps ) {
	const flexClassnames = classNames(
		"flex",
		{ "flex-row": props.direction === "row" },
		{ "flex-row-reverse": props.direction === "row-reverse" },
		{ "flex-col": props.direction === "col" },
		{ "flex-col-reverse": props.direction === "col-reverse" },
		{ "w-full": props.direction === "row" || props.direction === "row-reverse" },
		{ "h-full": props.direction === "col" || props.direction === "col-reverse" },
		{ "justify-start": props.justify === "start" },
		{ "justify-center": props.justify === "center" },
		{ "justify-end": props.justify === "end" },
		{ "justify-between": props.justify === "space-between" },
		{ "justify-around": props.justify === "space-around" },
		{ "justify-evenly": props.justify === "space-evenly" },
		{ "items-center": props.align === "center" },
		{ "items-start": props.align === "start" },
		{ "items-end": props.align === "end" },
		{ "items-baseline": props.align === "baseline" },
		{ "items-stretch": props.align === "stretch" },
		props.className
	);

	return (
		<Box className={ flexClassnames }>
			{ props.children }
		</Box>
	);
}


export default Flex;
