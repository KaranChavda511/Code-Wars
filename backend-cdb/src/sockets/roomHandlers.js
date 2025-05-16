// src/sockets/roomHandlers.js
import logger from "../utils/logger.js";

const roomCodeData = new Map();

export default {
  joinRoom: (socket) => ({ roomId, username }) => {
    socket.join(roomId);
    logger.info(`${username} joined ${roomId}`);
    if (roomCodeData.has(roomId)) {
      socket.emit("codeUpdate", roomCodeData.get(roomId));
    }
  },
  handleCodeChange: (socket) => ({ roomId, newCode }) => {
    roomCodeData.set(roomId, newCode);
    socket.to(roomId).emit("codeUpdate", newCode);
  },
  handleSolution: (socket) => ({ roomId, username, isCorrect }) => {
    socket.nsp.to(roomId).emit("challengeCompleted", { winner: username });
    logger.info(`${username} solved challenge in ${roomId}`);
  },
  cleanupRooms: (socket) => {
    Array.from(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        roomCodeData.delete(room);
      }
    });
  },
};
