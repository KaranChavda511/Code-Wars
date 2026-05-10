// src/config/env.js
import dotenv from "dotenv";

dotenv.config();

const REQUIRED = ["MONGO_URI", "JWT_SECRET"];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const parseList = (value, fallback) =>
  (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  ALLOWED_ORIGINS: parseList(process.env.ALLOWED_ORIGINS, "http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash",
};

env.IS_PROD = env.NODE_ENV === "production";

export default env;
