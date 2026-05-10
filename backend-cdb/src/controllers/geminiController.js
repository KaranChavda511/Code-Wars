// src/controllers/geminiController.js
import logger from "../utils/logger.js";
import { generateText, generateChat, isConfigured } from "../services/geminiService.js";

const MAX_TEXT_LENGTH = 2000;
const MAX_MESSAGES = 20;

const ensureConfigured = (res) => {
  if (isConfigured()) return true;
  logger.warn("Gemini call attempted but GEMINI_API_KEY is not configured");
  res.status(503).json({ message: "Gemini is not configured on the server" });
  return false;
};

export const generate = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const { text, systemInstruction, temperature, maxOutputTokens } = req.body;
  if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({
      message: `text is required (string, max ${MAX_TEXT_LENGTH} chars)`,
    });
  }

  try {
    const reply = await generateText(text, { systemInstruction, temperature, maxOutputTokens });
    res.status(200).json({ reply });
  } catch (error) {
    logger.error(`Gemini generate error: ${error.message}`);
    res.status(502).json({ message: "Gemini upstream error" });
  }
};

export const chat = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const { messages, systemInstruction, temperature, maxOutputTokens } = req.body;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({
      message: `messages must be a non-empty array (max ${MAX_MESSAGES})`,
    });
  }
  for (const m of messages) {
    if (!m || typeof m.content !== "string" || !["user", "assistant"].includes(m.role)) {
      return res.status(400).json({
        message: "each message needs { role: 'user'|'assistant', content: string }",
      });
    }
  }

  try {
    const reply = await generateChat(messages, { systemInstruction, temperature, maxOutputTokens });
    res.status(200).json({ reply });
  } catch (error) {
    logger.error(`Gemini chat error: ${error.message}`);
    res.status(502).json({ message: "Gemini upstream error" });
  }
};
