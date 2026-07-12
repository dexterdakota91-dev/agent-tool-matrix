import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing!");
}

const connectionString = process.env.DATABASE_URL
  .replace(/^\uFEFF/, "")
  .replace(/^[\\\"\']+|[\\\"\']+$/g, "")
  .trim();

export const sql = neon(connectionString);
