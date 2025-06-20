import React, { useEffect } from "react";
import './VoiceAssistant.css'; 

const VoiceAssistant = () => {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const startBtn = document.getElementById("startBtn");
    const scribDiv = document.getElementById("scrib");

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
      const API_KEY = import.meta.env.VITE_YOUR_GEMINI_API_KEY; 
console.log(API_KEY);

      const body = {
        system_instruction: {
          parts: [
            {
              text: "You are an AI assistant of Harsh Patel. Reply in short sentences with emotions, suitable for speaking.",
            },
          ],
        },
        contents: [{ parts: [{ text }] }],
      };

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply received.";
        scribDiv.textContent = `Optimus AI: ${reply}`;
        speak(reply);
      } catch (err) {
        scribDiv.textContent = "Error: " + err.message;
      }
    };

    if (!SpeechRecognition) {
      scribDiv.textContent = "Speech recognition not supported.";
      startBtn.disabled = true;
    } else {
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

      startBtn.addEventListener("click", () => {
        recognition.start();
      });
    }

    return () => {
      startBtn?.removeEventListener("click", () => {});
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