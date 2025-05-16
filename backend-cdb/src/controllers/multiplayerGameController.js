// src/controllers/multiplayerGameController.js
import MultiplayerSession from "../models/multiplayerSession.models.js";
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";
import { executeSolution } from "../services/codeExecutor.js";

// Create a multiplayer room
export const createMultiplayerRoom = async (req, res) => {
  try {
    const { roomName, challenges } = req.body;
    if (!roomName || !challenges || !Array.isArray(challenges) || challenges.length === 0) {
      return res.status(400).json({ message: "Room name and at least one challenge are required" });
    }
    if (challenges.length > 3) {
      return res.status(400).json({ message: "Maximum 3 challenges allowed" });
    }
    const foundChallenges = await Challenge.find({ _id: { $in: challenges } });
    if (foundChallenges.length !== challenges.length) {
      return res.status(404).json({ message: "One or more challenges not found" });
    }
    const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newSession = await MultiplayerSession.create({
      roomId,
      roomName,
      owner: req.user.id,
      challenges,
      players: [{ user: req.user.id, socketId: null, submissions: [] }],
      status: "waiting",
      timerDuration: 120,
    });
    logger.info(`Multiplayer room created: ${roomId} by ${req.user.id}`);
    res.status(201).json(newSession);
  } catch (error) {
    logger.error(`Create Multiplayer Room Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Join a multiplayer room
export const joinMultiplayerRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (session.players.length >= 5) {
      return res.status(400).json({ message: "Room is full" });
    }
    if (session.players.some(p => p.user.toString() === req.user.id)) {
      return res.status(400).json({ message: "Already in room" });
    }
    session.players.push({ user: req.user.id, socketId: null, submissions: [] });
    await session.save();
    logger.info(`User ${req.user.id} joined room ${roomId}`);
    res.status(200).json(session);
  } catch (error) {
    logger.error(`Join Multiplayer Room Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Start the multiplayer game
export const startMultiplayerGame = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (session.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the room owner can start the game" });
    }
    if (session.players.length < 2) {
      return res.status(400).json({ message: "At least 2 players are required to start the game" });
    }
    session.status = "active";
    session.currentChallengeIndex = 0;
    session.challengeStartTime = new Date();
    await session.save();
    logger.info(`Game started in room ${roomId} by owner ${req.user.id}`);
    res.status(200).json({ message: "Game started", session });
  } catch (error) {
    logger.error(`Start Multiplayer Game Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit a solution for the current challenge
export const submitMultiplayerSolution = async (req, res) => {
  try {
    const { roomId, code } = req.body;
    const session = await MultiplayerSession.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (session.status !== "active") {
      return res.status(400).json({ message: "Game is not active" });
    }
    const currentChallengeId = session.challenges[session.currentChallengeIndex];
    const challenge = await Challenge.findById(currentChallengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    const result = await executeSolution(code, challenge);
    const submissionTime = new Date();
    const player = session.players.find(p => p.user.toString() === req.user.id);
    if (!player) {
      return res.status(400).json({ message: "Player not in room" });
    }
    if (player.submissions.some(s => s.challengeId.toString() === currentChallengeId.toString())) {
      return res.status(400).json({ message: "Already submitted for this challenge" });
    }
    player.submissions.push({
      challengeId: currentChallengeId,
      code,
      correct: result.success,
      submissionTime,
    });
    await session.save();
    logger.info(`User ${req.user.id} submitted solution for challenge ${currentChallengeId} in room ${roomId}`);
    res.status(200).json({ message: "Solution submitted", result });
  } catch (error) {
    logger.error(`Submit Multiplayer Solution Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper: End current challenge (compute rankings and advance game)
export const endCurrentChallenge = async (session) => {
  try {
    const currentChallengeId = session.challenges[session.currentChallengeIndex];
    const submissions = [];
    session.players.forEach(player => {
      const submission = player.submissions.find(s => s.challengeId.toString() === currentChallengeId.toString());
      if (submission && submission.correct) {
        submissions.push({ user: player.user, submissionTime: submission.submissionTime });
      }
    });
    submissions.sort((a, b) => new Date(a.submissionTime) - new Date(b.submissionTime));
    session.results.push({
      challengeId: currentChallengeId,
      rankings: submissions,
    });
    if (session.currentChallengeIndex < session.challenges.length - 1) {
      session.currentChallengeIndex += 1;
      session.challengeStartTime = new Date();
    } else {
      session.status = "completed";
    }
    await session.save();
    return session;
  } catch (error) {
    logger.error(`End Challenge Error: ${error.message}`);
    throw error;
  }
};
