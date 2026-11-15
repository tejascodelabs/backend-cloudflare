import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "./src/config/index.js";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/database/**/*.js",
    dialect: "postgresql",
    dbCredentials: {
        url: config.databaseUrl,
    },
});
