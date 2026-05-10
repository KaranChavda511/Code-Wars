// src/routes/CentrilizeRoute.js
import { Router } from "express";
import logger from "../utils/logger.js";

import userRoutes from "./userRoutes.js";
import challengeRoutes from "./challengeRoutes.js";
import submissionRoutes from "./submissionRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import multiplayerGameRoutes from "./multiplayerGameRoutes.js";
import hintRoutes from "./hintRoutes.js";
import powerupRoutes from "./powerupRoutes.js";
import codeRoutes from "./codeRoutes.js";
import adminRoutes from "./adminRoutes.js";
import geminiRoutes from "./geminiRoutes.js";

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
router.use("/api/leaderboard", leaderboardRoutes);
router.use("/api/multiplayer", multiplayerGameRoutes);
router.use("/api/hints", hintRoutes);
router.use("/api/powerups", powerupRoutes);
router.use("/api/code", codeRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/gemini", geminiRoutes);

router.use("*", (req, res) => {
  logger.warn(`404 - Route Not Found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default router;
