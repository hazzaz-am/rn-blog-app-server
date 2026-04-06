import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const getVerificationHtml = (verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
      Verify your email address
    </h1>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      Welcome! Click the button below to verify your email.
    </p>
  </div>

  <div style="text-align: center; margin-bottom: 32px;">
    <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
      Verify Email
    </a>
  </div>

  <p style="color: #6b7280; font-size: 12px; text-align: center; margin-bottom: 24px;">
    This link expires in 5 minutes. If you didn't create an account, you can safely ignore this email.
  </p>

  <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
      © ${new Date().getFullYear()} RN Blog. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

export const sendEmail = async ({
	to,
	subject,
	text,
	verificationUrl,
}: {
	to: string;
	subject: string;
	text: string;
	verificationUrl?: string;
}) => {
	try {
		const html = verificationUrl ? getVerificationHtml(verificationUrl) : undefined;
		const { data, error } = await resend.emails.send({
			from: process.env.ADMIN_EMAIL!,
			to,
			subject,
			text,
			html,
		});

		if (error) {
			console.error(error);
		}
	} catch (error) {
		console.error(error);
	}
};
