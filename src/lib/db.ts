import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing!");
}

const connectionString = process.env.DATABASE_URL
  .replace(/^\uFEFF/, "")
  .replace(/^[\\\"\']+|[\\\"\']+$/g, "")
  .trim();

export const sql = connectionString ? neon(connectionString) : ((strings: TemplateStringsArray, ...values: any[]) => { throw new Error("No database connection string provided") }) as unknown as ReturnType<typeof neon>;
