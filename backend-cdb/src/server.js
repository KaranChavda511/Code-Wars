// src/server.js
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import morganMiddleware from "./middlewares/loggerMiddleware.js";
import limiter from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import mainRouter from "./routes/CentrilizeRoute.js";
import { initializeSocket } from "./sockets/index.js";

const app = express();
const server = createServer(app);

connectDB();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (env.ALLOWED_ORIGINS.includes("*") || env.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

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

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

if (!env.IS_PROD) {
  app.use(morgan("dev"));
}
app.use(morganMiddleware);

app.use(limiter);

// Health endpoint MUST be registered before mainRouter (which has a "*" 404 catch-all)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use(mainRouter);

app.use(errorHandler);

const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    socket.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (err) {
    logger.warn(`Socket auth failed: ${err.message}`);
    next(new Error("Authentication failed"));
  }
});

initializeSocket(io);

server.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
});
