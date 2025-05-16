// src/controllers/codeController.js
import { executeSolution } from "../services/codeExecutor.js";
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

const codeLogger = logger.child({ label: "controllers/CodeController.js" });

export const runCode = async (req, res) => {
  try {
    const { code, challengeId } = req.body;

    if (!code) {
      codeLogger.warn("Missing code in request.");
      return res.status(400).json({ message: "Code is required" });
    }
    if (!challengeId) {
      codeLogger.warn("Missing challengeId in request.");
      return res.status(400).json({ message: "Challenge ID is required" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      codeLogger.warn(`Challenge not found: ${challengeId}`);
      return res.status(404).json({ message: "Challenge not found" });
    }

    const result = await executeSolution(code, challenge);

    if (result.success) {
      codeLogger.info(`Code passed for challenge ${challengeId}`);
      return res.status(200).json({
        success: true,
        message: "Correct Output ✅",
        output: result.output,
        correct: true,
        testResults: result.testResults,
      });
    } else {
      codeLogger.warn(`Code failed for challenge ${challengeId}`);
      return res.status(200).json({
        success: false,
        message: "Incorrect Output ❌",
        output: result.output,
        correct: false,
        testResults: result.testResults,
      });
    }
  } catch (error) {
    codeLogger.error(`Unexpected error in runCode: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
