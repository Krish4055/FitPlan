import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// ✅ Load environment variables from .env file
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const isPostgres = !!databaseUrl && /^(postgres|postgresql):/i.test(databaseUrl);

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isPostgres ? "postgresql" : "sqlite",
  dbCredentials: {
    url: isPostgres ? (databaseUrl as string) : "sqlite:fitplan.db",
  },
});
