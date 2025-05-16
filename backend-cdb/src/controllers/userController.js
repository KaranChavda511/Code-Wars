// src/controllers/userController.js
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Signup Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
