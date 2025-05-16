// src/controllers/HintController.js
import Challenge from "../models/challenge.models.js";
import User from "../models/user.models.js";
import logger from "../utils/logger.js";

export const getHint = async (req, res) => {
  try {
    const { challengeId, hintIndex } = req.params;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    if (hintIndex >= challenge.hints.length) {
      return res.status(400).json({ message: "Invalid hint index" });
    }
    await User.findByIdAndUpdate(req.user.id, { $inc: { score: -5 } });
    logger.info(`Hint provided for ${challengeId} to user ${req.user.id}`);
    res.status(200).json({
      hint: challenge.hints[hintIndex],
      remainingHints: challenge.hints.length - hintIndex - 1,
    });
  } catch (error) {
    logger.error(`Hint Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
