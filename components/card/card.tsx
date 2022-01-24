import Box from "components/box/box";
import Image from "next/image";
import classNames from "classnames";
import { Button, ButtonProps } from "components/button/button";

export interface CardProps {
	title?: string;
	context?: string;
	centered?: boolean;
	image?: string;
	actions?: ButtonProps[];
}

export function Card( props: CardProps ) {
	const wrapperClassNames = classNames(
		"border-solid border-2 p-10 rounded-lg shadow-sm bg-default",
		{ "text-center": props.centered }
	);
	return (
		<Box className={ wrapperClassNames }>
			{ props.image && <Image src={ props.image } width={ 200 } height={ 200 }/> }
			<h2 className={ "text-lg font-bold" }>{ props.title }</h2>
			{ props.actions?.map( ( btnProps ) => <Button { ...btnProps }/> ) }
		</Box>
	);
}

export default Card;