export interface AvatarProps {
	src?: string | null;
}

export const Avatar = function ( props: AvatarProps ) {
	return (
		<img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={ props.src || "" }/>
	);
};