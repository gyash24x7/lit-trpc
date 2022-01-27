import { Fragment } from "react";
import classNames from "classnames";
import { IconType } from "react-icons";

export const textInputClassnames = classNames(
	"focus:ring-primary-500",
	"focus:border-primary-500",
	"mt-1",
	"block",
	"w-full",
	"text-sm",
	"border-default-600",
	"rounded-md"
);


export interface LabelProps {
	for: string;
	text: string;
}

function Label( props: LabelProps ) {
	return (
		<label
			htmlFor={ props.for }
			className={ classNames( "block", "text-sm", "font-semibold", "text-dark-500" ) }
		>
			{ props.text }
		</label>
	);
}

function HelperText( props = { text: "" } ) {
	return (
		<p className={ classNames( "mt-2", "text-sm", "text-dark-300" ) }>
			{ props.text }
		</p>
	);
}

export interface TextInputProps {
	label?: string;
	name: string;
	placeholder?: string;
	helperText?: string;
	type?: "text" | "number" | "email" | "password";
	iconBefore?: IconType;
	iconAfter?: IconType;
	value?: string;
	onChange?: ( value: string ) => void | Promise<void>;
}

export function TextInput( { type, ...props }: TextInputProps ) {
	const IconBefore = props.iconBefore;
	const IconAfter = props.iconAfter;

	return (
		<Fragment>
			{ props.label && (
				<Label
					for={ props.name }
					text={ props.label }
				/>
			) }
			<span className={ classNames(
				"relative",
				"text-dark-400",
				"focus-within:text-dark-600",
				"block"
			) }>
				{ IconBefore!! && (
					<IconBefore
						className={ classNames(
							"pointer-events-none",
							"mt-0.5",
							"w-4",
							"h-4",
							"absolute top-1/2",
							"transform",
							"-translate-y-1/2",
							"left-3"
						) }
					/>
				) }
				<input
					type={ type || "text" }
					name={ props.name }
					placeholder={ props.placeholder }
					className={ classNames(
						textInputClassnames,
						{ "pl-8": IconBefore!! },
						{ "pr-8": IconAfter!! }
					) }
					value={ props.value }
					onChange={ e => props.onChange && props.onChange( e.target.value ) }
				/>
				{ IconAfter!! && (
					<IconAfter
						className={ classNames(
							"pointer-events-none",
							"mt-0.5",
							"w-4",
							"h-4",
							"absolute top-1/2",
							"transform",
							"-translate-y-1/2",
							"right-3"
						) }
					/>
				) }
			</span>
			{ props.helperText!! && <HelperText text={ props.helperText }/> }
		</Fragment>
	);
}

export interface TextAreaProps {
	label?: string;
	name: string;
	placeholder?: string;
	helperText?: string;
	rows?: number;
	value?: string;
	onChange?: ( value: string ) => void | Promise<void>;
}

export function TextArea( props: TextAreaProps ) {
	return (
		<Fragment>
			{ props.label && (
				<Label
					for={ props.name }
					text={ props.label }
				/>
			) }
			<textarea
				name={ props.name }
				rows={ props.rows || 3 }
				className={ textInputClassnames }
				placeholder={ props.placeholder || "" }
				value={ props.value }
				onChange={ e => props.onChange && props.onChange( e.target.value ) }
			/>
			{ props.helperText!! && <HelperText text={ props.helperText }/> }
		</Fragment>
	);
}

export interface RadioProps {
	label?: string;
	name: string;
}

export interface CheckBoxProps extends RadioProps {}

export function Radio( props: RadioProps ) {
	return (
		<Fragment>
			<input
				name={ props.name }
				type="radio"
				className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-dark-300"
			/>
			<label
				htmlFor={ props.name }
				className="ml-3 block text-sm font-medium text-dark-500"
			>
				{ props.label }
			</label>
		</Fragment>
	);
}

export function CheckBox( props: CheckBoxProps ) {
	return (
		<Fragment>
			<input
				name={ props.name }
				type="checkbox"
				className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
			/>
			<label
				htmlFor={ props.name }
				className="ml-3 text-sm font-medium text-gray-700"
			>
				{ props.label }
			</label>
		</Fragment>
	);
}

export interface SelectOption {
	label: string,
	value: any
}

export interface SelectProps {
	label?: string;
	name: string;
	placeholder?: string;
	helperText?: string;
	options: SelectOption[];
}


export function Select( props: SelectProps ) {
	return (
		<Fragment>
			{ props.label && (
				<Label
					for={ props.name }
					text={ props.label }
				/>
			) }
			<select
				name={ props.name }
				placeholder={ props.placeholder }
				className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			>
				{ props.options.map( option => <option>{ option.label }</option> ) }
			</select>
			{ props.helperText!! && <HelperText text={ props.helperText }/> }
		</Fragment>
	);
}