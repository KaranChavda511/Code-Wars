// src/utils/logger.js
import winston from "winston";
import path from "path";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join("logs", "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join("logs", "combined.log") }),
  ],
});

logger.exceptions.handle(
  new winston.transports.File({ filename: path.join("logs", "exceptions.log") })
);

export default logger;
