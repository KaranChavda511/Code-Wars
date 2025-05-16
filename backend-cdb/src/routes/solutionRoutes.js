// src/routes/solutionRoutes.js
import express from "express";
import Solution from "../models/Solution.js"; // Ensure this model exists

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, challengeId, code } = req.body;
    if (!userId || !challengeId || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const solution = new Solution({ userId, challengeId, code });
    await solution.save();
    res.status(201).json({ message: "Solution submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting solution", error });
  }
});

export default router;
