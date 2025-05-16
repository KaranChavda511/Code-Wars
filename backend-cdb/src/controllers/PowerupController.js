// src/controllers/PowerupController.js
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

export const usePowerUp = async (req, res) => {
  try {
    const { type, challengeId } = req.body;
    if (type === "extraTime") {
      return res.json({ success: true, extraTime: 30 });
    }
    if (type === "skipChallenge") {
      const nextChallenge = await Challenge.findOne({ _id: { $ne: challengeId } });
      if (!nextChallenge) return res.status(404).json({ message: "No more challenges" });
      return res.json({ success: true, nextChallenge });
    }
    res.status(400).json({ message: "Invalid power-up type" });
  } catch (error) {
    logger.error(`Error using power-up: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
