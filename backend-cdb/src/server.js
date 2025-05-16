// src/server.js
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose"; // Used in health check
import logger from "./utils/logger.js";
import mainRouter from "./routes/CentrilizeRoute.js";
import morganMiddleware from "./middlewares/loggerMiddleware.js";
import limiter from "./middlewares/rateLimiter.js";
import { initializeSocket } from "./sockets/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// CORS configuration
app.use(cors(corsOptions));

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
        styleSrc: ["'self'", "fonts.googleapis.com", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Request parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));



// Logging middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(morganMiddleware);

// Rate limiting
app.use(limiter);

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});
initializeSocket(io);

// Main API routes
app.use(mainRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

server.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode`);
  console.log(`http://localhost:${PORT}`);
});
