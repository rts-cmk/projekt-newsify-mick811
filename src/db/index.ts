import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";

import * as schema from "./schema";

const driver = postgres(env.server.DATABASE_URL);

const getDatabase = createServerOnlyFn(() =>
	drizzle({ client: driver, schema, casing: "snake_case" }),
);

export const db = getDatabase();
