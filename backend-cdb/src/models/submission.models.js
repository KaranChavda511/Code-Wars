// src/models/submission.models.js
import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  passed: Boolean,
  input: mongoose.Schema.Types.Mixed,
  output: mongoose.Schema.Types.Mixed,
  expected: mongoose.Schema.Types.Mixed,
  error: String,
  runtime: Number, // ms
});

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    code: { type: String, required: true },
    language: { type: String, default: "javascript" },
    testResults: [testResultSchema],
    isCorrect: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    runtime: { type: Number }, // Average runtime in ms
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

submissionSchema.index({ user: 1, challenge: 1 });
submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ score: -1 });

export default mongoose.model("Submission", submissionSchema);
