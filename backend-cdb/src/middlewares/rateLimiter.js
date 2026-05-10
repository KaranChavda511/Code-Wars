// src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
