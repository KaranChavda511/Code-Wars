// src/controllers/authController.js
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, email, password: hashedPassword, role });
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    logger.info(`New user registered: ${email}`);
    res.status(201).json({ token, user: { id: newUser._id, username, email, role } });
  } catch (error) {
    logger.error(`Signup Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with unregistered email: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid login attempt for user: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, score: user.score },
    });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 12);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Profile Update Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
