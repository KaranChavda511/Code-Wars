// src/controllers/submissionController.js
import Submission from "../models/submission.models.js";
import Challenge from "../models/challenge.models.js";
import User from "../models/user.models.js";
import { executeSolution } from "../services/codeExecutor.js";
import logger from "../utils/logger.js";

export const submitSolution = async (req, res) => {
  try {
    const { challengeId, code } = req.body;
    const userId = req.user.id;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    const executionResult = await executeSolution(code, challenge);
    const baseScore =
      challenge.difficulty === "Easy"
        ? 10
        : challenge.difficulty === "Medium"
        ? 20
        : 30;
    const score = Math.floor(baseScore * (executionResult.passedCount / executionResult.totalTests));
    const submission = await Submission.create({
      user: userId,
      challenge: challengeId,
      code,
      language: "javascript",
      testResults: executionResult.testResults,
      isCorrect: executionResult.success,
      score,
      runtime:
        executionResult.testResults.reduce((sum, t) => sum + t.runtime, 0) /
        executionResult.testResults.length,
    });
    if (executionResult.success) {
      await User.findByIdAndUpdate(userId, {
        $inc: { score },
        $push: {
          solvedChallenges: {
            challengeId,
            timestamp: new Date(),
            attempts: 1,
          },
        },
      });
    }
    res.status(200).json({
      success: executionResult.success,
      score,
      passed: executionResult.passedCount,
      total: executionResult.totalTests,
      testResults: executionResult.testResults.map((t) => ({
        passed: t.passed,
        input: t.input,
        output: t.output,
        expected: t.expected,
        runtime: t.runtime,
        error: t.error,
      })),
      submissionId: submission._id,
    });
  } catch (error) {
    logger.error(`Submission Error: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
