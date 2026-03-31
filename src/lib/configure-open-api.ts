import { AppOpenAPI } from "@/types";
import { Scalar } from "@scalar/hono-api-reference";
import packageJSON from "../../package.json";

export const configureOpenAPI = (app: AppOpenAPI) => {
	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			version: packageJSON.version,
			title: "Blogs API",
		},
	});

	// SCALAR UI
	app.get(
		"/scalar",
		Scalar({
			url: "/doc",
			pageTitle: "API Documentation",
			theme: "kepler",
			layout: "classic",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
		}),
	);
};
