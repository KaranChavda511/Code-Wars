// src/config/db.js
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import env from "./env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
