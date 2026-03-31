import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.ADMIN_EMAIL!,
			to,
			subject,
			text,
		});

		if (error) {
			console.error(error);
		}
	} catch (error) {
		console.error(error);
	}
};
