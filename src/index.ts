import { serve } from "bun";
import app from "./app";

const port = Number(process.env.PORT) || 3000;

const server = serve({
	fetch: app.fetch,
	port,
});

console.log(`Listening on http://localhost:${server.port}`);
