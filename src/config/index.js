const port = Number.parseInt(process.env.PORT ?? "4001", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number between 1 and 65535");
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

export const config = Object.freeze({
    service: process.env.SERVICE_NAME || "node-api",
    port,
    nodeEnv: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "info",
    databaseUrl: process.env.DATABASE_URL || "",
    allowedOrigins,
    get(key) {
        if (!(key in this)) {
            throw new Error(`Unknown configuration key: ${key}`);
        }
        return this[key];
    },
});
