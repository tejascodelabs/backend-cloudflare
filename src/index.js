import "dotenv/config";
import app from "./app.js"
import { config } from "./config/index.js"
import { logger } from "./config/logger.js"
import { checkDatabaseConnection, pool } from "./database/index.js"

let server;

const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    if (server) {
        server.close(async (error) => {
            if (error) {
                logger.error(`Error closing server: ${error.message}`);
                process.exitCode = 1;
            }

            try {
                await pool.end();
                logger.info("Database connection closed.");
            } catch (dbError) {
                logger.error(`Database shutdown error: ${dbError.message}`);
                process.exitCode = 1;
            }
        });
    } else {
        await pool.end();
    }
};

const startServer = async () => {
    try {
        logger.info("Checking database connection...");

        const dbConnected = await checkDatabaseConnection();

        if (!dbConnected) {
            throw new Error("Database connection failed");
        }

        logger.info("Database connected successfully.");

        server = app.listen(config.port, "0.0.0.0", () => {
            logger.info(`${config.service} is running on port ${config.port}`);
        });

        server.on("error", (error) => {
            logger.error(`Server error: ${error.message}`);
            process.exit(1);
        });
    } catch (error) {
        logger.error(`Application startup failed: ${error.message}`);

        try {
            await pool.end();
        } catch (dbError) {
            logger.error(`Database cleanup failed: ${dbError.message}`);
        }

        process.exit(1);
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
