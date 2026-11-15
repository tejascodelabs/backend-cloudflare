import winston from "winston";
import { config } from "./index.js";

const logFormat = winston.format.printf(
    ({ level, message, timestamp, service }) =>
        `[${timestamp}] [${level}] [${service}] ${message}`,
);

export const logger = winston.createLogger({
    level: config.logLevel,
    defaultMeta: { service: config.service },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        logFormat,
    ),
    transports: [new winston.transports.Console()],
});
