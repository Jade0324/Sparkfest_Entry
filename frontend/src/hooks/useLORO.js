import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useLORO — wraps Web Speech API TTS for the LORO parrot coach.
 *
 * Exposes:
 *   speak(text, options)  → Promise that resolves when speech ends
 *   isSpeaking            → boolean (for mic gating + button visual)
 *   cancelSpeech()        → stop any ongoing speech immediately
 *   wait(ms)              → helper promise for the timed pauses in sequences
 *   supported            → false if the browser has no speechSynthesis
 *
 * Voice defaults: rate 0.85, pitch 1.1, lang 'en-US' (friendly, child-paced).
 * Always cancels any in-progress speech before starting new speech, and never
 * rejects on cancel/interrupt — so `await speak(...)` is always safe to gate mic.
 */
export default function useLORO() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported]   = useState(true);

  const utterRef      = useRef(null); // currently-speaking utterance
  const resolveRef    = useRef(null); // resolver for the current speak() promise
  const voicesRef     = useRef([]);
  const keepAliveRef  = useRef(null);

  // ── Load available voices (async in Chrome) ──────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices() || []; };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const pickVoice = useCallback((lang) => {
    const voices = voicesRef.current;
    if (!voices || voices.length === 0) return null;
    // Prefer known friendly voices, then any en-US, then any English, then default.
    const preferred = ['Google US English', 'Samantha', 'Microsoft Aria Online (Natural) - English (United States)', 'Microsoft Zira'];
    for (const name of preferred) {
      const v = voices.find(v => v.name === name);
      if (v) return v;
    }
    return voices.find(v => v.lang === lang)
        || voices.find(v => v.lang && v.lang.startsWith('en'))
        || voices[0];
  }, []);

  // ── Chrome cuts speech at ~15s; ping resume to keep it alive ──
  const startKeepAlive = () => {
    stopKeepAlive();
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
    }, 10000);
  };
  const stopKeepAlive = () => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  };

  // Resolve whatever speak() promise is currently pending (used on end + cancel).
  const settle = useCallback(() => {
    const r = resolveRef.current;
    resolveRef.current = null;
    if (r) r();
  }, []);

  const cancelSpeech = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    if (utterRef.current) {           // detach so its handlers don't double-fire
      utterRef.current.onend = null;
      utterRef.current.onerror = null;
      utterRef.current = null;
    }
    stopKeepAlive();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    settle();                         // let any awaiting caller continue
  }, [settle]);

  const speak = useCallback((text, options = {}) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window) || !text) { resolve(); return; }

      const wasBusy = window.speechSynthesis.speaking
                   || window.speechSynthesis.pending
                   || !!utterRef.current;

      // Cancel + settle the previous utterance before starting the new one.
      if (utterRef.current) {
        utterRef.current.onend = null;
        utterRef.current.onerror = null;
        utterRef.current = null;
      }
      if (wasBusy) { window.speechSynthesis.cancel(); settle(); }

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate  = options.rate  ?? 0.85;
      utter.pitch = options.pitch ?? 1.1;
      utter.lang  = options.lang  ?? 'en-US';
      const voice = pickVoice(utter.lang);
      if (voice) utter.voice = voice;

      const finish = () => {
        if (utterRef.current === utter) {
          utterRef.current = null;
          stopKeepAlive();
          setIsSpeaking(false);
          settle();
        }
      };
      utter.onend   = finish;
      utter.onerror = finish; // 'canceled'/'interrupted' land here — treat as done, never throw

      resolveRef.current = resolve;
      utterRef.current   = utter;

      // Small defer after a cancel: Chrome sometimes swallows the first
      // utterance queued immediately after cancel().
      const go = () => {
        setIsSpeaking(true);
        window.speechSynthesis.speak(utter);
        startKeepAlive();
      };
      if (wasBusy) setTimeout(go, 60); else go();
    });
  }, [pickVoice, settle]);

  // Timed-pause helper for the LORO sequences (800ms intro delay, 600ms, 1000ms…)
  const wait = useCallback((ms) => new Promise((r) => setTimeout(r, ms)), []);

  // Stop talking if the screen unmounts mid-sentence.
  useEffect(() => () => {
    stopKeepAlive();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, isSpeaking, cancelSpeech, wait, supported };
}