// src/controllers/userController.js
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import env from "../config/env.js";

const issueToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  score: user.score,
  badges: user.badges,
  solvedChallenges: user.solvedChallenges,
});

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn(`Signup attempt with existing email/username: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    const newUser = await User.create({ username, email, password: hashedPassword });
    const token = issueToken(newUser);
    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully", token, user: publicUser(newUser) });
  } catch (error) {
    logger.error(`Signup Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with unregistered email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid login attempt for user: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = issueToken(user);
    logger.info(`User logged in: ${email}`);
    res.status(200).json({ message: "Login successful", token, user: publicUser(user) });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(publicUser(user));
  } catch (error) {
    logger.error(`Get Current User Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    }
    const updated = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Profile updated", user: publicUser(updated) });
  } catch (error) {
    logger.error(`Profile Update Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
