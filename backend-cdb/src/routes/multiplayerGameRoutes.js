// src/routes/multiplayerGameRoutes.js
import express from "express";
import {
  createMultiplayerRoom,
  joinMultiplayerRoom,
  startMultiplayerGame,
  submitMultiplayerSolution,
} from "../controllers/multiplayerGameController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`Multiplayer route: ${req.method} ${req.url}`);
  next();
});

// Create room
router.post("/room", isLoggedIn, createMultiplayerRoom);
// Join room
router.post("/room/:roomId/join", isLoggedIn, joinMultiplayerRoom);
// Start game
router.post("/room/:roomId/start", isLoggedIn, startMultiplayerGame);
// Submit solution
router.post("/submit", isLoggedIn, submitMultiplayerSolution);

export default router;
