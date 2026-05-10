import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../../services/api.js";
import "./VoiceAssistant.css";

const STATUS = {
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
  ERROR: "error",
};

const STATUS_META = {
  [STATUS.IDLE]:      { label: "STANDBY",   tone: "neutral" },
  [STATUS.LISTENING]: { label: "LISTENING", tone: "live"    },
  [STATUS.THINKING]:  { label: "PROCESSING",tone: "warn"    },
  [STATUS.SPEAKING]:  { label: "RESPONDING",tone: "ok"      },
  [STATUS.ERROR]:     { label: "ERROR",     tone: "error"   },
};

/* — icons — */
const MicIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);
const StopIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
  </svg>
);
const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 7h16" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
  </svg>
);
const CornerArrow = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/* — speech synthesis helper — */
const speak = (text) => {
  if (!("speechSynthesis" in window)) return null;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN";
  u.pitch = 1.05;
  u.rate = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.name.toLowerCase().includes("google")) ||
    voices.find((v) => v.lang?.startsWith("en"));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return u;
};

/* — time format — */
const timestamp = (date = new Date()) =>
  date.toTimeString().slice(0, 8); // HH:MM:SS

const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [messages, setMessages] = useState([]);
  const [supported, setSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const recognitionRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setStatus(STATUS.LISTENING);
    recognition.onerror = (e) => {
      setStatus(STATUS.ERROR);
      setErrorMessage(e.error || "Speech recognition error");
    };
    recognition.onend = () => {
      setStatus((s) => (s === STATUS.LISTENING ? STATUS.IDLE : s));
    };
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      pushMessage({ role: "user", content: transcript });
      await callGemini(transcript);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onstart = recognition.onerror = recognition.onend = recognition.onresult = null;
      try { recognition.abort(); } catch {}
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, status]);

  const pushMessage = (msg) =>
    setMessages((prev) => [...prev, { ...msg, time: timestamp() }]);

  const callGemini = async (text) => {
    setStatus(STATUS.THINKING);
    try {
      const { data } = await API.post("/gemini/generate", { text });
      const reply = data?.reply?.trim() || "No reply received.";
      pushMessage({ role: "assistant", content: reply });
      setStatus(STATUS.SPEAKING);
      const utter = speak(reply);
      if (utter) {
        utter.onend = () => setStatus(STATUS.IDLE);
      } else {
        setStatus(STATUS.IDLE);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Network error";
      pushMessage({ role: "assistant", content: msg, error: true });
      setErrorMessage(msg);
      setStatus(STATUS.ERROR);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (status === STATUS.LISTENING) {
      recognitionRef.current.stop();
      return;
    }
    if (status === STATUS.SPEAKING) {
      window.speechSynthesis.cancel();
      setStatus(STATUS.IDLE);
      return;
    }
    setErrorMessage("");
    if (status === STATUS.ERROR) setStatus(STATUS.IDLE);
    try {
      recognitionRef.current.start();
    } catch {/* already running */}
  };

  const handleClear = () => {
    setMessages([]);
    setErrorMessage("");
    setStatus(STATUS.IDLE);
    window.speechSynthesis?.cancel();
  };

  const meta = STATUS_META[status];
  const messageCount = messages.length;

  const counter = useMemo(
    () => String(messageCount).padStart(3, "0"),
    [messageCount]
  );

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        className={[
          "va-fab",
          open && "va-fab--open",
          status === STATUS.LISTENING && "va-fab--live",
        ].filter(Boolean).join(" ")}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        <span className="va-fab__inner">
          {open ? <CloseIcon className="va-fab__icon" /> : <MicIcon className="va-fab__icon" />}
        </span>
        {!open && status === STATUS.LISTENING && <span className="va-fab__beacon" />}
      </button>

      {/* Panel */}
      {open && (
        <section className="va-panel" role="dialog" aria-label="Optimus AI">

          <header className="va-head">
            <div className="va-head__brand">
              <span className="va-head__rule" aria-hidden="true" />
              <div>
                <div className="va-head__name">
                  Optimus <span className="va-head__italic">AI</span>
                </div>
                <div className="va-head__meta">
                  <span className={`va-status va-status--${meta.tone}`}>
                    <span className="va-status__dot" aria-hidden="true" />
                    <span className="va-status__label">{meta.label}</span>
                    {status === STATUS.LISTENING && <Waveform />}
                  </span>
                  <span className="va-head__sep">·</span>
                  <span className="va-head__counter">{counter} TURNS</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="va-iconbtn"
              onClick={() => setOpen(false)}
              aria-label="Close panel"
            >
              <CloseIcon className="va-iconbtn__icon" />
            </button>
          </header>

          {/* Transcript */}
          <div className="va-log" ref={logRef}>
            {messages.length === 0 ? (
              <div className="va-empty">
                <div className="va-empty__eyebrow">TRANSCRIPT</div>
                <h3 className="va-empty__title">Awaiting input.</h3>
                <p className="va-empty__body">
                  Press the microphone below and speak naturally. Each turn is
                  recorded with a timestamp.
                </p>
              </div>
            ) : (
              <ol className="va-turns">
                {messages.map((m, i) => (
                  <li
                    key={i}
                    className={[
                      "va-turn",
                      `va-turn--${m.role}`,
                      m.error && "va-turn--error",
                    ].filter(Boolean).join(" ")}
                  >
                    <div className="va-turn__head">
                      <span className="va-turn__bar" aria-hidden="true" />
                      <span className="va-turn__who">
                        {m.role === "user" ? "YOU" : "OPTIMUS"}
                      </span>
                      <span className="va-turn__time">{m.time}</span>
                    </div>
                    <p className="va-turn__body">{m.content}</p>
                  </li>
                ))}
                {status === STATUS.THINKING && (
                  <li className="va-turn va-turn--assistant va-turn--ghost">
                    <div className="va-turn__head">
                      <span className="va-turn__bar" aria-hidden="true" />
                      <span className="va-turn__who">OPTIMUS</span>
                      <span className="va-turn__time">{timestamp()}</span>
                    </div>
                    <div className="va-typing" aria-label="Thinking">
                      <span /><span /><span />
                    </div>
                  </li>
                )}
              </ol>
            )}
          </div>

          {errorMessage && status === STATUS.ERROR && (
            <div className="va-banner" role="alert">
              <span className="va-banner__label">ERR</span>
              <span className="va-banner__text">{errorMessage}</span>
            </div>
          )}

          {/* Composer */}
          <footer className="va-foot">
            <button
              type="button"
              className={[
                "va-mic",
                status === STATUS.LISTENING && "va-mic--live",
                (!supported || status === STATUS.THINKING) && "va-mic--disabled",
              ].filter(Boolean).join(" ")}
              onClick={handleMicClick}
              disabled={!supported || status === STATUS.THINKING}
              aria-label={status === STATUS.LISTENING ? "Stop" : "Start"}
            >
              {status === STATUS.LISTENING
                ? <StopIcon className="va-mic__icon" />
                : <MicIcon className="va-mic__icon" />}
            </button>

            <div className="va-foot__hint">
              <div className="va-foot__primary">
                {!supported
                  ? "Speech not supported"
                  : status === STATUS.LISTENING
                  ? "Tap to stop"
                  : status === STATUS.THINKING
                  ? "Working…"
                  : status === STATUS.SPEAKING
                  ? "Tap to interrupt"
                  : "Tap to speak"}
              </div>
              <div className="va-foot__sub">
                <CornerArrow className="va-foot__arrow" />
                {messageCount === 0 ? "First turn" : `Turn ${messageCount + 1}`}
              </div>
            </div>

            <button
              type="button"
              className="va-iconbtn va-iconbtn--ghost"
              onClick={handleClear}
              disabled={messageCount === 0}
              aria-label="Clear transcript"
              title="Clear transcript"
            >
              <TrashIcon className="va-iconbtn__icon" />
            </button>
          </footer>
        </section>
      )}
    </>
  );
};

const Waveform = () => (
  <span className="va-wave" aria-hidden="true">
    <i /><i /><i /><i /><i />
  </span>
);

export default VoiceAssistant;
