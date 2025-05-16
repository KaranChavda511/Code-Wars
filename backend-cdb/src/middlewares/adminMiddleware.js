// src/middlewares/adminMiddleware.js
import logger from "../utils/logger.js";

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user.id}`);
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

export default isAdmin;
