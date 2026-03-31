import type { z } from "@hono/zod-openapi";
import z4 from "zod/v4";

export const asHonoSchema = <T extends z4.ZodTypeAny>(schema: T) => schema as unknown as z.ZodType<z4.infer<T>>;
