import { db } from "@/db";
import env from "@/utils/env.util";
import { sendEmail } from "@/utils/emails/sendEmail.util";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	trustedOrigins: [
		"rnblogapp://",

		...(env?.NODE_ENV === "development" ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"] : []),
	],
	plugins: [bearer(), expo()],
	emailAndPassword: {
		enabled: true,
		maxPasswordLength: 18,
		minPasswordLength: 8,
		requireEmailVerification: true,
		resetPasswordTokenExpiresIn: 60 * 5,
	},
	emailVerification: {
		sendOnSignUp: true,
		expiresIn: 60 * 5,
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email address: ${url}`,
				verificationUrl: url,
			});
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account consent",
			accessType: "offline",
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
