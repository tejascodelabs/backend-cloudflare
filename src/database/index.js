import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

const { Pool } = pg;

const DATABASE_URL = config.databaseUrl;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Check your .env file.");
}

export const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

export const db = drizzle({
    client: pool,
});

export const checkDatabaseConnection = async () => {
    try {
        const result = await pool.query("SELECT NOW()");

        logger.info(`Database time:, ${result.rows[0].now}`);

        return true;
    } catch (error) {
        logger.error("Database connection failed:", error.message);
        return false;
    }
};
