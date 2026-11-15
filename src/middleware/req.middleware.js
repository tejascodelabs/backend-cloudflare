import { logger } from "../config/logger.js";

const reqLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        logger.info(
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${Date.now() - start}ms`,
        );
    });

    next();
};

export default reqLogger;
