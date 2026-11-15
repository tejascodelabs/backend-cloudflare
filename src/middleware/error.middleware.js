import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
import AppError from "../utils/error.js";

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const code = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";

    if (statusCode >= 500) {
        logger.error(
            `${req.method} ${req.originalUrl}: ${err.stack || err.message}`,
        );
    }

    res.status(statusCode).json({
        success: false,
        error: code,
        message:
            statusCode === 500 && configIsProduction()
                ? "Something went wrong"
                : err.message || "Something went wrong",
    });
};

function configIsProduction() {
    return config.nodeEnv === "production";
}
