// src/routes/powerupRoutes.js
import express from "express";
import { usePowerUp } from "../controllers/PowerupController.js";

const router = express.Router();
router.post("/", usePowerUp);
export default router;
