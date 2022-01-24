import Flex from "components/flex/flex";
import { Children, Fragment, isValidElement, ReactElement, ReactNode } from "react";
import Box from "components/box/box";
import classNames from "classnames";

export interface StackProps {
	direction?: "horizontal" | "vertical";
	spacing?: "tiny" | "small" | "medium" | "large";
	children: ReactNode;
	centered?: boolean;
	className?: string;
}

function getValidChildren( children: ReactNode ) {
	return Children.toArray( children ).filter( ( child ) => isValidElement( child ) ) as ReactElement[];
}

export function Stack( props: StackProps ) {
	const spacingClassnames = classNames(
		{ "w-2 h-2": props.spacing === "tiny" },
		{ "w-5 h-5": props.spacing === "small" || !props.spacing },
		{ "w-10 h-10": props.spacing === "medium" },
		{ "w-20 h-20": props.spacing === "large" }
	);
	return (
		<Flex
			direction={ props.direction === "vertical" ? "col" : "row" }
			justify={ props.centered ? "center" : "start" }
			className={ props.className }
		>
			{ getValidChildren( props.children )
				.map( child => (
					<Fragment key={ child.key }>
						{ child }
						<Box className={ spacingClassnames }/>
					</Fragment>
				) ) }
		</Flex>
	);
}


export default Stack;
