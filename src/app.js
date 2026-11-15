import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { config } from "./config/index.js";
import corsMiddleware from "./middleware/cors.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import reqLogger from "./middleware/req.middleware.js";
import { apiLimiter } from "./middleware/rate-limit.middleware.js";
import Router from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(corsMiddleware);
app.use(reqLogger);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct dist path
const distPath = path.resolve(__dirname, "../dist");

console.log("Dist Path:", distPath);
console.log("Dist Exists:", fs.existsSync(distPath));

app.use(express.json());

// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         service: config.service,
//         message: "API is running",
//     });
// });

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: config.service,
        environment: config.nodeEnv,
        message: "Service is healthy",
    });
});

// Serve Vite assets and static files
app.use(express.static(distPath));

// React fallback (Express 5)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use("/api/v1", apiLimiter, Router);

// Register application routes above this 404 handler.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Error middleware must always be last.
app.use(errorHandler);

export default app;
