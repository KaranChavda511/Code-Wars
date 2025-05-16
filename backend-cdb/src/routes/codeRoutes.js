// src/routes/codeRoutes.js
import express from "express";
import { runCode } from "../controllers/codeController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

const codeRouteLogger = logger.child({ label: "routes/CodeRoutes.js" });
const router = express.Router();

router.use((req, res, next) => {
  codeRouteLogger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

router.post(
  "/run",
  isLoggedIn,
  (req, res, next) => {
    codeRouteLogger.info(`Code execution requested by user: ${req.user.id}`);
    next();
  },
  runCode
);

export default router;
