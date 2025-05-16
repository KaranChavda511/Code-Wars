// src/controllers/adminController.js
import User from "../models/user.models.js";
import Challenge from "../models/challenge.models.js";
import Submission from "../models/submission.models.js";
import logger from "../utils/logger.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ score: -1 });
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Admin Error - Get Users: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Challenge.deleteMany({ createdBy: user._id });
    await Submission.deleteMany({ user: user._id });
    logger.info(`Admin deleted user: ${user._id}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Admin Error - Delete User: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const [usersCount, challengesCount, submissionsCount, recentSubmissions] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Submission.countDocuments(),
      Submission.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "username")
        .populate("challenge", "title"),
    ]);
    res.status(200).json({
      usersCount,
      challengesCount,
      submissionsCount,
      recentSubmissions,
    });
  } catch (error) {
    logger.error(`Admin Error - Get Stats: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Admin Error - Update Role: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
