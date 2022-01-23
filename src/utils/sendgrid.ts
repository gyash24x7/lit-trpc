import sendgrid from "@sendgrid/mail";

export type MailData = {
	to: string
	subject: string
	text: string
}

sendgrid.setApiKey( process.env.SENDGRID_API_KEY! );

export async function sendMail( { to, subject, text }: MailData ) {
	// TODO: enable mail send
	// await sendgrid.send( { to, subject, text, from: "contact@yashgupta.dev", html: "" } )
	// 	.catch( e => {console.log( e );} );
}