import cors from "cors";
import { config } from "../config/index.js";

const corsMiddleware = cors({
    origin(origin, callback) {
        // Allow server-to-server and command-line requests that do not send Origin.
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/$/, "");
        if (config.allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
    optionsSuccessStatus: 204,
});

export default corsMiddleware;
