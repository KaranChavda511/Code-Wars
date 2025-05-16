// src/routes/adminRoutes.js
import express from "express";
import { getAllUsers, deleteUser, getSystemStats } from "../controllers/adminController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(isLoggedIn, isAdmin);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/stats", getSystemStats);

export default router;
