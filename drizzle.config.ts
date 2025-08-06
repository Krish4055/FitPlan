import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// ✅ Load environment variables from .env file
dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "sqlite:fitplan.db";
const isSqlite = databaseUrl.startsWith('sqlite:');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSqlite ? "sqlite" : "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
