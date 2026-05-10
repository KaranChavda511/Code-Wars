// src/routes/geminiRoutes.js
import express from "express";
import rateLimit from "express-rate-limit";
import { generateContent } from "../controllers/geminiController.js";

const router = express.Router();

const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI requests, slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate", geminiLimiter, generateContent);

export default router;
