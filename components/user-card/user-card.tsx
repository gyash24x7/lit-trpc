import { Avatar } from "components/avatar/avatar";
import Flex from "components/flex/flex";

export interface UserCardProps {
	user?: { name?: string | null, email?: string | null, image?: string | null };
}

export const UserCard = function ( props: UserCardProps ) {
	return (
		<Flex direction={ "col" } align={ "center" } className={ "bg-white p-4 rounded-md w-full" }>
			<p className={ "text-xs" }>LOGGED IN AS</p>
			<h4 className={ "font-bold mb-1 text-xl" }>
				{ props.user?.name }
			</h4>
			<Avatar src={ props.user?.image }/>

		</Flex>
	);
};