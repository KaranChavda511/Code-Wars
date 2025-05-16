// src/controllers/challengeController.js
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

export const createChallenge = async (req, res) => {
  try {
    const { title, description, functionName, returnType, timeLimit, testCases, expectedOutput } = req.body;

    const challenge = new Challenge({
      title,
      description,
      functionName,
      returnType,
      timeLimit,
      testCases,
      expectedOutput,
    });

    await challenge.save();
    logger.info(`Challenge created: ${title}`);
    res.status(201).json({ success: true, challenge });
  } catch (error) {
    logger.error(`Challenge creation error: ${error.message}`);
    res.status(500).json({ success: false, message: "Challenge creation failed", error: error.message });
  }
};

export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.status(200).json({ success: true, challenges });
  } catch (error) {
    logger.error(`Fetching challenges failed: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to fetch challenges", error: error.message });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };
    const challenges = await Challenge.find(filter)
      .select("-correctSolution -testCases")
      .sort({ createdAt: -1 });
    res.status(200).json(challenges);
  } catch (error) {
    logger.error(`Get Challenges Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    const publicTestCases = challenge.testCases.filter((tc) => !tc.hidden);
    const challengeObj = challenge.toObject();
    challengeObj.testCases = publicTestCases;
    res.status(200).json(challengeObj);
  } catch (error) {
    logger.error(`Get Challenge Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") {
      filter.createdBy = req.user.id;
    }
    const updatedChallenge = await Challenge.findOneAndUpdate(filter, req.body, { new: true });
    if (!updatedChallenge) {
      return res.status(404).json({ message: "Challenge not found or unauthorized" });
    }
    logger.info(`Challenge updated: ${updatedChallenge.title}`);
    res.status(200).json(updatedChallenge);
  } catch (error) {
    logger.error(`Update Challenge Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") {
      filter.createdBy = req.user.id;
    }
    const deletedChallenge = await Challenge.findOneAndDelete(filter);
    if (!deletedChallenge) {
      return res.status(404).json({ message: "Challenge not found or unauthorized" });
    }
    logger.info(`Challenge deleted: ${deletedChallenge.title}`);
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    logger.error(`Delete Challenge Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
