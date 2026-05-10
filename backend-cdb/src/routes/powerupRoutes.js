// src/routes/powerupRoutes.js
import express from "express";
import { usePowerUp } from "../controllers/PowerupController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", isLoggedIn, usePowerUp);
export default router;
