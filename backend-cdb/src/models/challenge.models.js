// src/models/challenge.models.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  functionName: { type: String},
  testCases: [
    {
      input: { type: String, required: true }, // Should be a JSON stringified array
      output: { type: String, required: true }  // Expected output as JSON string
    }
  ],
  expectedOutput: { type: String, required: true }, // Expected output for the first test case
  timeLimit: { type: Number, default: 2 }, // in seconds
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
