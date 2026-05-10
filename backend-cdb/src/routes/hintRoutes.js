// src/routes/hintRoutes.js
import express from "express";
import { getHint } from "../controllers/HintController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/:challengeId/:hintIndex", isLoggedIn, getHint);
export default router;
