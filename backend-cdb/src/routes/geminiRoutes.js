// src/routes/geminiRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import { generate, chat } from "../controllers/geminiController.js";

const router = express.Router();

const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: "Too many AI requests, slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate", geminiLimiter, generate);
router.post("/chat", geminiLimiter, chat);

export default router;
