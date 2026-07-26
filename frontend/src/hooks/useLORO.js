import { useState, useEffect, useRef, useCallback } from 'react';

const TTS_API = 'http://localhost:8080/api/v1/tts/speak';

/**
 * useLORO — ElevenLabs TTS engine with browser TTS fallback.
 *
 * Public API (unchanged from before):
 *   speak(text, options)  → Promise resolves when audio ends
 *   isSpeaking            → boolean (for mic gating)
 *   cancelSpeech()        → stops audio immediately
 *   wait(ms)              → timed pause helper
 *   supported             → always true (fallback guarantees it)
 *
 * options.rate (0.5–2.0): maps to Audio.playbackRate — 0.6 slows
 * pronunciation modeling, 1.0 is normal, keeping ElevenLabs quality
 * intact at any speed since we're adjusting playback not synthesis.
 */
export default function useLORO() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported]                 = useState(true);

  const audioRef   = useRef(null); // currently playing Audio element
  const resolveRef = useRef(null); // resolver for the active speak() promise
  const genRef     = useRef(0);    // generation counter — cancels stale async chains

  // ── Settle the active promise (safe to call multiple times) ──
  const settle = useCallback(() => {
    const r = resolveRef.current;
    resolveRef.current = null;
    if (r) r();
  }, []);

  // ── Stop whatever is playing right now ───────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // ── Public: cancel any in-flight speech ─────────────────────
  const cancelSpeech = useCallback(() => {
    genRef.current += 1; // invalidates any awaiting speak() chain
    stopAudio();
    settle();
  }, [stopAudio, settle]);

  // ── Browser TTS fallback (called when ElevenLabs fails) ─────
  const speakBrowser = useCallback((text, options, myGen, resolve) => {
    if (!('speechSynthesis' in window)) { setIsSpeaking(false); resolve(); return; }

    const utter    = new SpeechSynthesisUtterance(text);
    utter.rate     = options.rate  ?? 0.85;
    utter.pitch    = options.pitch ?? 1.1;
    utter.lang     = 'en-US';

    const done = () => {
      if (genRef.current !== myGen) return;
      setIsSpeaking(false);
      const r = resolveRef.current;
      resolveRef.current = null;
      if (r) r();
    };
    utter.onend   = done;
    utter.onerror = done;

    resolveRef.current = resolve;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, []);

  // ── Main speak() — ElevenLabs with fallback ─────────────────
  const speak = useCallback((text, options = {}) => {
    return new Promise(async (resolve) => {
      if (!text?.trim()) { resolve(); return; }

      // Cancel previous and take the floor
      genRef.current += 1;
      const myGen = genRef.current;
      stopAudio();
      settle(); // resolve any previous awaiting speak()

      resolveRef.current = resolve;
      setIsSpeaking(true);

      try {
        // ── ElevenLabs fetch ────────────────────────────────
        const res = await fetch(TTS_API, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ text }),
        });

        if (genRef.current !== myGen) return; // cancelled while fetching
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        if (genRef.current !== myGen) return; // cancelled while reading blob

        const url   = URL.createObjectURL(blob);
        const audio = new Audio(url);

        // rate → playbackRate: 0.6 = slow pronunciation, 0.85 = normal LORO
        audio.playbackRate = Math.min(Math.max(options.rate ?? 0.85, 0.4), 2.0);
        audioRef.current   = audio;

        const done = () => {
          if (genRef.current !== myGen) return;
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsSpeaking(false);
          const r = resolveRef.current;
          resolveRef.current = null;
          if (r) r();
        };

        audio.onended = done;
        audio.onerror = done;

        if (genRef.current === myGen) {
          audio.play().catch(done);
        }

      } catch (err) {
        // ── Browser TTS fallback ────────────────────────────
        if (genRef.current !== myGen) return;
        console.warn('[LORO] ElevenLabs unavailable — browser TTS fallback:', err.message);
        setIsSpeaking(false);
        resolveRef.current = null;
        speakBrowser(text, options, myGen, resolve);
      }
    });
  }, [stopAudio, settle, speakBrowser]);

  // Timed pause helper (unchanged)
  const wait = useCallback((ms) => new Promise((r) => setTimeout(r, ms)), []);

  // Cleanup on unmount
  useEffect(() => () => {
    genRef.current += 1;
    stopAudio();
  }, [stopAudio]);

  return { speak, isSpeaking, cancelSpeech, wait, supported };
}