// src/controllers/LeaderboardController.js
import User from "../models/user.models.js";
import logger from "../utils/logger.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select("username score solvedChallenges")
      .sort({ score: -1 })
      .limit(100);
    res.status(200).json(leaderboard);
  } catch (error) {
    logger.error(`Leaderboard Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    const totalAttempts = user.solvedChallenges.reduce((sum, sc) => sum + sc.attempts, 0);
    const stats = {
      username: user.username,
      score: user.score,
      totalSolved: user.solvedChallenges.length,
      accuracy: totalAttempts > 0 ? Math.round((user.solvedChallenges.length / totalAttempts) * 100) : 0,
      recentActivity: user.solvedChallenges.slice(-5),
    };
    res.status(200).json(stats);
  } catch (error) {
    logger.error(`User Stats Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
