// src/services/geminiService.js
import { GoogleGenAI } from "@google/genai";
import logger from "../utils/logger.js";
import env from "../config/env.js";

const DEFAULT_SYSTEM_INSTRUCTION =
  "You are an AI assistant inside the Code-Wars platform. Reply in short sentences with emotion, suitable for speaking out loud.";

let client = null;

const getClient = () => {
  if (!env.GEMINI_API_KEY) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    logger.info(`Gemini client initialized (model: ${env.GEMINI_MODEL})`);
  }
  return client;
};

export const isConfigured = () => Boolean(env.GEMINI_API_KEY);

export const generateText = async (text, options = {}) => {
  const ai = getClient();
  if (!ai) throw new Error("Gemini not configured");

  const {
    systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
    temperature = 0.7,
    maxOutputTokens = 512,
    model = env.GEMINI_MODEL,
  } = options;

  const response = await ai.models.generateContent({
    model,
    contents: text,
    config: {
      systemInstruction,
      temperature,
      maxOutputTokens,
    },
  });

  return response.text ?? "";
};

export const generateChat = async (messages, options = {}) => {
  const ai = getClient();
  if (!ai) throw new Error("Gemini not configured");

  const {
    systemInstruction = DEFAULT_SYSTEM_INSTRUCTION,
    temperature = 0.7,
    maxOutputTokens = 1024,
    model = env.GEMINI_MODEL,
  } = options;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature,
      maxOutputTokens,
    },
  });

  return response.text ?? "";
};
