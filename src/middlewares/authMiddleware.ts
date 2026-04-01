import { auth } from "@/lib/auth";
import { AppBindings } from "@/types";
import type { Context } from "hono";

export const authMiddleware = async <C extends Context<AppBindings>>(c: C, next: () => Promise<void>) => {
	const authHeader = c.req.header("Authorization") ?? "";
	if (!authHeader.startsWith("Bearer ")) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	const token = authHeader.replace("Bearer ", "");
	const sessionResponse = await auth.api.getSession({
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!sessionResponse || !sessionResponse.user) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	c.set("user", sessionResponse.user);
	c.set("session", sessionResponse.session);

	await next();
};
