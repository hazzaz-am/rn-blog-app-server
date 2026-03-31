import { auth } from "./lib/auth";
import { configureOpenAPI } from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";
import { indexRouter } from "./routes/index.route";

const app = createApp();
const routes = [indexRouter];

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

configureOpenAPI(app);

routes.forEach((route) => {
	app.route("/", route);
});

export default app;
