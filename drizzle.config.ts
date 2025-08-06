import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// ✅ Load environment variables from .env file
dotenv.config();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/fitplan",
  },
});
