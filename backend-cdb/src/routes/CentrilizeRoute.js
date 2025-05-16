// src/routes/CentrilizeRoute.js
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

import userRoutes from "./userRoutes.js";
import challengeRoutes from "./challengeRoutes.js";
import submissionRoutes from "./submissionRoutes.js";
import codeExecutionRoutes from "./codeExecutionRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import multiplayerGameRoutes from "./multiplayerGameRoutes.js";
import hintRoutes from "./hintRoutes.js";
import powerupRoutes from "./powerupRoutes.js";
import codeRoutes from "./codeRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

router.get("/api-docs", (req, res) => {
  res.status(501).json({ message: "API documentation coming soon" });
});

router.use("/api/users", userRoutes);
router.use("/api/challenges", challengeRoutes);
router.use("/api/submissions", submissionRoutes);
router.use("/api/execute", codeExecutionRoutes);
router.use("/api/leaderboard", leaderboardRoutes);
router.use("/api/multiplayer", multiplayerGameRoutes);
router.use("/api/hints", hintRoutes);
router.use("/api/powerups", powerupRoutes);
router.use("/api/code", codeRoutes);
router.use("/api/admin", adminRoutes);

router.use("/api/admin", authMiddleware, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
});

router.use("*", (req, res) => {
  logger.warn(`404 - Route Not Found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    suggestedActions: [
      "Check the API documentation",
      "Verify the endpoint URL",
      "Ensure proper HTTP method is used",
    ],
  });
});

router.use((err, req, res, next) => {
  logger.error(`Global Error Handler: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };
  res.status(statusCode).json(response);
});

export default router;
