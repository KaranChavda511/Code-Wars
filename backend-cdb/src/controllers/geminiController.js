// src/controllers/geminiController.js
import logger from "../utils/logger.js";
import env from "../config/env.js";

const SYSTEM_INSTRUCTION =
  "You are an AI assistant inside the Code-Wars platform. Reply in short sentences with emotion, suitable for speaking out loud.";

export const generateContent = async (req, res) => {
  if (!env.GEMINI_API_KEY) {
    logger.warn("Gemini call attempted but GEMINI_API_KEY is not configured");
    return res.status(503).json({ message: "Gemini is not configured on the server" });
  }

  const { text } = req.body;
  if (!text || typeof text !== "string" || text.length > 2000) {
    return res.status(400).json({ message: "text is required (string, max 2000 chars)" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      logger.error(`Gemini API error: ${response.status} ${JSON.stringify(data)}`);
      return res.status(502).json({ message: "Gemini upstream error" });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.status(200).json({ reply });
  } catch (error) {
    logger.error(`Gemini proxy error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
