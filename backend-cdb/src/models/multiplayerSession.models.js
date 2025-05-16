// src/models/multiplayerSession.models.js
import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  socketId: String,
  submissions: [
    {
      challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      code: String,
      correct: { type: Boolean, default: false },
      submissionTime: Date,
    },
  ],
  ranking: Number,
});

const multiplayerSessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true }],
  currentChallengeIndex: { type: Number, default: 0 },
  players: [playerSchema],
  status: { type: String, enum: ["waiting", "active", "completed"], default: "waiting" },
  challengeStartTime: Date, // When current challenge started
  timerDuration: { type: Number, default: 120 }, // Seconds per challenge
  results: [
    {
      challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      rankings: [
        { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, submissionTime: Date },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

multiplayerSessionSchema.index({ status: 1 });
multiplayerSessionSchema.index({ "players.user": 1 });

export default mongoose.model("MultiplayerSession", multiplayerSessionSchema);
