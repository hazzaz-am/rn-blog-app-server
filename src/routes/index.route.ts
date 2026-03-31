import { createRouter } from "@/lib/create-app";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const indexRouter = createRouter().openapi(
	createRoute({
		tags: ["Index"],
		method: "get",
		path: "/",
		responses: {
			[HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("Blogs API"), "Blogs API Index"),
		},
	}),
	(c) => {
		return c.json({
			message: "Blogs API Index",
		});
	},
);
