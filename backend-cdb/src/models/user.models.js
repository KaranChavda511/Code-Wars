// src/models/user.models.js
import mongoose from "mongoose";

const solvedChallengeSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  timestamp: { type: Date, default: Date.now },
  attempts: { type: Number, default: 1 },
  timeTaken: Number, // in seconds
  usedHints: [Number],
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    score: { type: Number, default: 0 },
    solvedChallenges: [solvedChallengeSchema],
    badges: [{ type: String }],
    powerUps: { type: Number, default: 3 },
    accuracy: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating accuracy percentage
userSchema.virtual("accuracyPercentage").get(function () {
  const totalSubmissions = this.solvedChallenges.reduce(
    (sum, challenge) => sum + challenge.attempts,
    0
  );
  return totalSubmissions > 0
    ? Math.round((this.solvedChallenges.length / totalSubmissions) * 100)
    : 0;
});

// Update accuracy before saving
userSchema.pre("save", function (next) {
  this.accuracy = this.accuracyPercentage;
  next();
});

export default mongoose.model("User", userSchema);
