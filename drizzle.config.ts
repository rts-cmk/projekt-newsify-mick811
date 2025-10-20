import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	breakpoints: true,
	verbose: true,
	strict: true,
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: env.server.DATABASE_URL,
	},
} satisfies Config;
