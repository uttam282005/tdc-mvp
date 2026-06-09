import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres@localhost:5432/tdc";

// Disable prefetch as Next.js serverless/edge environments can cause issues,
// and it's cleaner for simple local setup.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export * from "./schema";
