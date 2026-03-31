import { treeifyError, z } from "zod";

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.coerce.number().default(9999),
	LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
	DATABASE_URL: z.url(),
	BETTER_AUTH_URL: z.string(),
	BETTER_AUTH_SECRET: z.string(),
	RESEND_API_KEY: z.string(),
	ADMIN_EMAIL: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
	console.error("❌ Invalid ENV:");
	console.error(JSON.stringify(treeifyError(error).properties, null, 2));
	process.exit(1);
}

export default env;
