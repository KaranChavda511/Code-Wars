// src/sockets/multiplayerHandlers.js
import logger from "../utils/logger.js";

const activeGameTimers = new Map();

export default {
  joinRoom: (socket) => (data) => {
    const { roomId, username } = data;
    socket.join(roomId);
    logger.info(`${username} joined room ${roomId} via socket`);
    socket.to(roomId).emit("playerJoined", { username });
  },
  startGame: (socket, io) => (data) => {
    const { roomId, timerDuration } = data;
    io.to(roomId).emit("gameStarted", { roomId, message: "Game has started" });
    const duration = (timerDuration || 120) * 1000;
    const timer = setTimeout(() => {
      io.to(roomId).emit("challengeEnded", { roomId, message: "Challenge time ended" });
      activeGameTimers.delete(roomId);
    }, duration);
    activeGameTimers.set(roomId, timer);
  },
  submitSolution: (socket, io) => (data) => {
    const { roomId, username, code } = data;
    io.to(roomId).emit("solutionSubmitted", { username, message: "Solution submitted" });
    // In a complete implementation, code could be processed here.
  },
  cleanupGameTimer: (roomId) => {
    if (activeGameTimers.has(roomId)) {
      clearTimeout(activeGameTimers.get(roomId));
      activeGameTimers.delete(roomId);
    }
  },
};
