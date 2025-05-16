// src/routes/userRoutes.js
import express from "express";
import { signup, login } from "../controllers/userController.js";
import logger from "../utils/logger.js";

const userRoutes = express.Router();

userRoutes.use((req, res, next) => {
  logger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);

export default userRoutes;
