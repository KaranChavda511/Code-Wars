// src/models/testCase.models.js
import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  explanation: { type: String },
});

export default mongoose.model("TestCase", testCaseSchema);
