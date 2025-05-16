// src/controllers/CodeExecutionController.js
import User from "../models/user.models.js";
import Challenge from "../models/challenge.models.js";
import { executeCode } from "../services/codeExecutor.js";
import logger from "../utils/logger.js";

export const submitSolution = async (req, res) => {
  try {
    const { challengeId, userCode } = req.body;
    const userId = req.user.id;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    const result = await executeCode(userCode, challenge);
    if (result.success) {
      const user = await User.findById(userId);
      if (!user.solvedChallenges.some((sc) => sc.challengeId.toString() === challengeId)) {
        user.solvedChallenges.push({ challengeId, timestamp: new Date(), attempts: 1 });
        user.score += challenge.points || 10;
      }
      if (user.score >= 50 && !user.badges.includes("Debugging Pro")) {
        user.badges.push("Debugging Pro");
      }
      await user.save();
      logger.info(`User ${user.username} solved challenge ${challengeId} | Score: ${user.score}`);
      return res.status(200).json({
        success: true,
        message: "Code is correct! ✅",
        score: user.score,
        badges: user.badges,
        testResults: result.testResults,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Submission Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
