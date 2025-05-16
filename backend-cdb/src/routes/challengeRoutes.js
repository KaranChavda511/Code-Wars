// src/routes/challengeRoutes.js
import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challengeController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

const challengeRoute = express.Router();

challengeRoute.use((req, res, next) => {
  logger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

challengeRoute.post("/", isLoggedIn, createChallenge);
challengeRoute.get("/", getAllChallenges);
challengeRoute.get("/:id", getChallengeById);
challengeRoute.put("/:id", isLoggedIn, updateChallenge);
challengeRoute.delete("/:id", isLoggedIn, deleteChallenge);

export default challengeRoute;
