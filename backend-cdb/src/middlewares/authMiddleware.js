// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const isLoggedIn = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn("Unauthorized access attempt - invalid token format");
    return res.status(401).json({ message: "Invalid authorization format" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    logger.error(`JWT verification failed: ${error.message}`);
    const status = error.name === "TokenExpiredError" ? 401 : 403;
    res.status(status).json({ message: "Authorization failed" });
  }
};

export default isLoggedIn;
