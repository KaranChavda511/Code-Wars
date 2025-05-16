// src/routes/leaderboardRoutes.js
import express from "express";
import { getLeaderboard } from "../controllers/LeaderboardController.js";
import logger from "../utils/logger.js";

const leaderboardRoute = express.Router();

leaderboardRoute.use((req, res, next) => {
  logger.info(`Leaderboard request received: ${req.method} ${req.url}`);
  next();
});

leaderboardRoute.get("/", getLeaderboard);

export default leaderboardRoute;
