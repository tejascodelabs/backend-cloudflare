import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
    },
});

// Add a stricter, separate limiter to login/OTP/password-reset routes.
