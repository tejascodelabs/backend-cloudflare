import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API v1 is running",
        endpoints: {
            live: "/health/live",
            ready: "/health/ready",
        },
    });
});

// Register feature routers here, for example:
// router.use("/auth", authRouter);
// router.use("/users", usersRouter);

export default router;
