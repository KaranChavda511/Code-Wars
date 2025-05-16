// src/routes/submissionRoutes.js
import express from "express";
import { submitSolution } from "../controllers/submissionController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

const submissionRouteLogger = logger.child({ label: "routes/SubmissionRoutes.js" });
const router = express.Router();

router.use((req, res, next) => {
  submissionRouteLogger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

router.post(
  "/submit",
  isLoggedIn,
  (req, res, next) => {
    submissionRouteLogger.info(`Submit solution route hit by user: ${req.user.id}`);
    next();
  },
  submitSolution
);

export default router;
