// src/routes/hintRoutes.js
import express from "express";
import { getHint } from "../controllers/HintController.js";

const router = express.Router();
router.get("/:challengeId/:hintIndex", getHint);
export default router;
