import React, { useEffect } from "react";
import API from "../../services/api.js";
import "./VoiceAssistant.css";

const VoiceAssistant = () => {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const startBtn = document.getElementById("startBtn");
    const scribDiv = document.getElementById("scrib");
    if (!startBtn || !scribDiv) return;

    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.pitch = 1.1;
      utterance.rate = 1;
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.name.includes("Google हिन्दी"));
      if (preferred) utterance.voice = preferred;
      speechSynthesis.speak(utterance);
    };

    const callGemini = async (text) => {
      try {
        const { data } = await API.post("/gemini/generate", { text });
        const reply = data?.reply || "No reply received.";
        scribDiv.textContent = `Optimus AI: ${reply}`;
        speak(reply);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        scribDiv.textContent = `Error: ${message}`;
      }
    };

    if (!SpeechRecognition) {
      scribDiv.textContent = "Speech recognition not supported.";
      startBtn.disabled = true;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      scribDiv.textContent = "🎤 Listening...";
      startBtn.textContent = "Listening...";
    };
    recognition.onend = () => {
      startBtn.textContent = "Start Listening";
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      scribDiv.textContent = `You: ${transcript}`;
      callGemini(transcript);
    };

    const handleClick = () => recognition.start();
    startBtn.addEventListener("click", handleClick);

    return () => {
      startBtn.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div id="voice-box">
      <div className="title">🎙️ Optimus AI</div>
      <div id="scrib" className="output-box">Ready to listen...</div>
      <button id="startBtn" className="start-button">Start Listening</button>
    </div>
  );
};

export default VoiceAssistant;
