import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Volume2, ArrowRight, Mic } from 'lucide-react';
import useLORO from '../hooks/useLORO';

const API = '[https://sparkfest-entry-1.onrender.com](https://sparkfest-entry-1.onrender.com)/api/v1';

// ═══════════════════════════════════════════════════════════
// LORO SPEECH LINES
// ═══════════════════════════════════════════════════════════
const LORO_INTRO =
  "Hi! I'm LORO, your speech buddy! Let's practice some words together. Are you ready? Let's go!";

const CORRECT_LINES = [
  "Woohoo! You got it! That was perfect!",
  "Amazing job! I knew you could do it!",
  "Yes! You are a superstar!",
];

// Each line is a lead-in; LORO then speaks the target word slowly (rate 0.6).
const INCORRECT_LINES = [
  "Almost! Let's try that together. Listen carefully...",
  "That was really close! Can you try one more time? Let's hear it...",
  "You're doing great! Let's practice this one more time. Say after me...",
];

// ═══════════════════════════════════════════════════════════
// MASCOT  (unchanged — kept as the current parrot)
// ═══════════════════════════════════════════════════════════
function Mascot({ state = 'idle' }) {
  const states = {
    idle:        { body: '🦜', bubble: null },
    listening:   { body: '🦜', bubble: "I'm listening… speak up! 🎙️" },
    celebrating: { body: '🦜', bubble: "Amazing job! Let's unlock the next part! 🌟" },
    encouraging: { body: '🦜', bubble: "Almost there! Give it another try! 💪" },
  };
  const current = states[state] || states.idle;
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className={`text-5xl transition-all duration-300 ${
        state === 'celebrating' ? 'animate-bounce' :
        state === 'listening'   ? 'animate-pulse' : ''
      }`}>
        {current.body}
      </div>
      {current.bubble && (
        <div className="relative max-w-[220px]">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent
            border-b-[8px] border-b-white" />
          <div className={`rounded-2xl px-3 py-2 text-center text-xs font-semibold
            leading-snug shadow-sm ${
            state === 'celebrating' ? 'bg-white text-[#5B4FCF]' :
            state === 'encouraging' ? 'bg-white text-[#C07000]' :
            'bg-white text-[#1A2C5B]'
          }`}>
            {current.bubble}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════════════
function Confetti() {
  const pieces = ['🌟','⭐','✨','🎉','🎊','💫','🌈'];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="absolute text-2xl animate-bounce" style={{
          left: `${Math.random() * 100}%`,
          top:  `${Math.random() * 60}%`,
          animationDelay:    `${Math.random() * 0.6}s`,
          animationDuration: `${0.6 + Math.random() * 0.6}s`,
          opacity: 0.85,
        }}>
          {pieces[i % pieces.length]}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LEVEL CONFIG — derived from exercise object
// ═══════════════════════════════════════════════════════════
function getLevels(exercise) {
  return [
    {
      level:  1,
      label:  'Word',
      prompt: exercise.level1Prompt   || `What is this?`,
      target: exercise.level1Text     || exercise.targetWord,
      image:  exercise.level1ImageUrl || exercise.mediaUrl || null,
    },
    {
      level:  2,
      label:  'Phrase',
      prompt: exercise.level2Prompt   || `What is the ${exercise.targetWord} doing?`,
      target: exercise.level2Text     || exercise.targetWord,
      image:  exercise.level2ImageUrl || exercise.level1ImageUrl || exercise.mediaUrl || null,
    },
    {
      level:  3,
      label:  'Sentence',
      prompt: exercise.level3Prompt   || `Can you say a full sentence?`,
      target: exercise.level3Text     || exercise.targetWord,
      image:  exercise.level3ImageUrl || exercise.level2ImageUrl || exercise.mediaUrl || null,
    },
  ];
}

// ═══════════════════════════════════════════════════════════
// ACCURACY — Levenshtein, best word match
// ═══════════════════════════════════════════════════════════
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function computeAccuracy(spoken, target) {
  const t           = target.toLowerCase().trim();
  const spokenClean = spoken.toLowerCase().trim();
  const maxLen      = Math.max(spokenClean.length, t.length);
  if (maxLen === 0) return 0;
  const wholeScore = Math.round(
    ((maxLen - levenshtein(spokenClean, t)) / maxLen) * 100
  );
  const wordScore = spokenClean.split(/\s+/).reduce((best, w) => {
    const wMax = Math.max(w.length, t.length);
    if (wMax === 0) return best;
    return Math.max(best, Math.round(((wMax - levenshtein(w, t)) / wMax) * 100));
  }, 0);
  return Math.max(0, Math.max(wholeScore, wordScore));
}

// ═══════════════════════════════════════════════════════════
// EMOJI fallback
// ═══════════════════════════════════════════════════════════
const EMOJI_MAP = {
  apple:'🍎', banana:'🍌', cat:'🐱', dog:'🐶', fish:'🐟',
  rabbit:'🐰', ball:'⚽', water:'💧', bird:'🐦', flower:'🌸',
  tree:'🌳', sun:'☀️', moon:'🌙', star:'⭐', house:'🏠',
  car:'🚗', book:'📚', pen:'✏️', milk:'🥛', egg:'🥚',
  mango:'🥭', orange:'🍊', grapes:'🍇', lion:'🦁', frog:'🐸',
};
const getEmoji = w => EMOJI_MAP[w?.toLowerCase()] ?? '📖';

// ═══════════════════════════════════════════════════════════
// LEVEL BADGE COLORS
// ═══════════════════════════════════════════════════════════
const LEVEL_COLORS = [
  { ring:'ring-sky-300',     bg:'bg-sky-50',     text:'text-sky-600',     dot:'bg-sky-400'     },
  { ring:'ring-violet-300',  bg:'bg-violet-50',  text:'text-violet-600',  dot:'bg-violet-400'  },
  { ring:'ring-emerald-300', bg:'bg-emerald-50', text:'text-emerald-600', dot:'bg-emerald-400' },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function LearningSession({ sessionId, onComplete, onBack }) {

  // ── LORO voice hook ────────────────────────────────────
  const { speak, isSpeaking, wait } = useLORO();

  const [session,      setSession]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [errorMsg,     setErrorMsg]     = useState('');

  const [exIndex,      setExIndex]      = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);

  const [listening,    setListening]    = useState(false);
  const [interim,      setInterim]      = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  const [resultState,  setResultState]  = useState(null);
  const [lastSpoken,   setLastSpoken]   = useState('');
  const [lastAccuracy, setLastAccuracy] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const [summary,      setSummary]      = useState(null);

  // ── LORO orchestration state ───────────────────────────
  const [introComplete, setIntroComplete] = useState(false);
  // Mic is blocked while ANY LORO sequence is mid-flight — this stays true
  // even during the 600ms pauses in a sequence, when isSpeaking briefly dips.
  const [micBlocked,    setMicBlocked]    = useState(false);
  const blockCountRef = useRef(0);
  const beginBlock = () => { blockCountRef.current += 1; setMicBlocked(true); };
  const endBlock   = () => {
    blockCountRef.current = Math.max(0, blockCountRef.current - 1);
    if (blockCountRef.current === 0) setMicBlocked(false);
  };
  // Holds Gemini feedback for the current attempt, if the backend ever returns it.
  const lastFeedbackRef = useRef(null);

  // Per-exercise, per-level results: { [exIndex]: { [levelIndex]: { passed, accuracy, transcript } } }
  const [levelResults, setLevelResults] = useState({});

  const [localAttempts, setLocalAttempts] = useState([]);

  // ── Refs ───────────────────────────────────────────────
  const recognitionRef  = useRef(null);
  const sessionRef      = useRef(null);
  const exIndexRef      = useRef(0);
  const levelRef        = useRef(0);
  const levelResultsRef = useRef({});

  useEffect(() => { sessionRef.current = session;      }, [session]);
  useEffect(() => { exIndexRef.current = exIndex;      }, [exIndex]);
  useEffect(() => { levelRef.current   = currentLevel; }, [currentLevel]);

  // ── Load session ───────────────────────────────────────
  useEffect(() => {
    if (!sessionId) {
      setErrorMsg('No session ID provided.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res  = await fetch(`${API}/sessions/${sessionId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        data.exercises = [...(data.exercises || [])].sort(
          (a, b) => a.sequenceOrder - b.sequenceOrder
        );
        setSession(data);
      } catch {
        setErrorMsg('Cannot load session. Is the backend running on port 8080?');
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  // ── Speech recognition setup ───────────────────────────
  useEffect(() => {
    const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechCtor) {
      setErrorMsg('Speech recognition requires Google Chrome.');
      return;
    }
    const r = new SpeechCtor();
    r.lang           = 'en-US';
    r.continuous     = false;
    r.interimResults = true;

    r.onstart  = () => { setListening(true); setErrorMsg(''); };
    r.onend    = () => setListening(false);
    r.onerror  = (e) => {
      setListening(false);
      if (e.error === 'not-allowed')
        setErrorMsg('Microphone blocked — allow access in browser settings.');
      else if (e.error !== 'no-speech')
        setErrorMsg(`Speech error: ${e.error}`);
    };
    r.onresult = (event) => {
      let final = '', inter = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) final += t + ' ';
        else inter += t + ' ';
      }
      if (final) {
        setInterim('');
        handleSpeechResult(final.trim());
      } else {
        setInterim(inter.trim());
      }
    };
    recognitionRef.current = r;
    return () => r.stop();
  }, []);

  // ══════════════════════════════════════════════════════
  // LORO — A. Session intro (once, 800ms after session loads)
  // ══════════════════════════════════════════════════════
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      beginBlock();
      try {
        await wait(800);
        if (cancelled) return;
        await speak(LORO_INTRO);
      } finally {
        endBlock();
      }
      if (!cancelled) setIntroComplete(true); // unlocks the per-level prompt effect
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // ══════════════════════════════════════════════════════
  // LORO — B & C. Prompt on entering a level
  //   L1 (per new exercise): prompt → pause → "Can you say... target?"
  //   L2: "Great! Now let's try a phrase. <prompt>"
  //   L3: "Amazing! One more challenge. <prompt>" → target sentence, slow
  // Runs only after the intro finishes; re-fires whenever the (exercise, level) changes.
  // ══════════════════════════════════════════════════════
  useEffect(() => {
    if (!session || !introComplete) return;
    const ex = session.exercises[exIndex]?.exercise;
    if (!ex) return;
    const levels = getLevels(ex);
    const lv = levels[currentLevel];
    if (!lv) return;

    let cancelled = false;
    (async () => {
      beginBlock();
      try {
        if (currentLevel === 0) {
          await speak(lv.prompt);
          if (cancelled) return;
          await wait(600);
          if (cancelled) return;
          await speak(`Can you say... ${lv.target}?`, { rate: 0.7 });
        } else if (currentLevel === 1) {
          await speak(`Great! Now let's try a phrase. ${lv.prompt}`);
        } else {
          await speak(`Amazing! One more challenge. ${lv.prompt}`);
          if (cancelled) return;
          await wait(400);
          if (cancelled) return;
          await speak(lv.target, { rate: 0.7 });
        }
      } finally {
        endBlock();
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, introComplete, exIndex, currentLevel]);

  // ══════════════════════════════════════════════════════
  // LORO — D. After correct answer
  //   random praise, then (if present) Gemini feedback after 1000ms
  // ══════════════════════════════════════════════════════
  useEffect(() => {
    if (resultState !== 'correct') return;
    let cancelled = false;
    (async () => {
      beginBlock();
      try {
        const praise = CORRECT_LINES[Math.floor(Math.random() * CORRECT_LINES.length)];
        await speak(praise);
        // ⬇️ DORMANT until your backend returns feedback on the attempt.
        // The moment attempt.aiFeedback (or .feedback / .geminiFeedback) is a
        // non-empty string, LORO speaks it here automatically — no other change needed.
        const fb = lastFeedbackRef.current;
        if (fb && !cancelled) {
          await wait(1000);
          if (cancelled) return;
          await speak(fb);
        }
      } finally {
        endBlock();
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultState]);

  // ══════════════════════════════════════════════════════
  // LORO — E. After incorrect answer
  //   random encouragement, then the target word slowly (rate 0.6)
  // ══════════════════════════════════════════════════════
  useEffect(() => {
    if (resultState !== 'incorrect') return;
    const ex     = sessionRef.current?.exercises[exIndexRef.current]?.exercise;
    const target = ex ? getLevels(ex)[levelRef.current]?.target : null;
    let cancelled = false;
    (async () => {
      beginBlock();
      try {
        const line = INCORRECT_LINES[Math.floor(Math.random() * INCORRECT_LINES.length)];
        await speak(line);
        if (cancelled || !target) return;
        await wait(300);
        if (cancelled) return;
        await speak(target, { rate: 0.6, pitch: 1.0 });
      } finally {
        endBlock();
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultState]);

  // ══════════════════════════════════════════════════════
  // LORO — F. Session complete
  // ══════════════════════════════════════════════════════
  useEffect(() => {
    if (!summary) return;
    const x = sessionRef.current?.exercises?.length || 0;
    speak(`Incredible work today! You practiced ${x} ${x === 1 ? 'word' : 'words'} and did an amazing job. See you next time!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  // ── Handle final speech result ─────────────────────────
  const handleSpeechResult = async (spoken) => {
    const s   = sessionRef.current;
    const idx = exIndexRef.current;
    const lvl = levelRef.current;
    if (!s) return;

    const exercise = s.exercises[idx]?.exercise;
    if (!exercise) return;

    const levels   = getLevels(exercise);
    const target   = levels[lvl].target;
    const accuracy = computeAccuracy(spoken, target);
    const passed   = accuracy >= 70;

    setLastSpoken(spoken);
    setLastAccuracy(accuracy);
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/sessions/${s.id}/attempts`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId:    exercise.id,
          transcript:    spoken,
          audioUrl:      `local://speech-api/${Date.now()}`,
          accuracyScore: accuracy,
        }),
      });
      if (!res.ok) throw new Error();
      const attempt = await res.json();

      // Capture Gemini feedback IF the backend sends it back on the attempt.
      // (Currently it doesn't — no audio is uploaded — so this stays null and
      //  part D just plays the praise line. Wire it later and it lights up.)
      const fb = attempt?.aiFeedback ?? attempt?.feedback ?? attempt?.geminiFeedback ?? null;
      lastFeedbackRef.current = (typeof fb === 'string' && fb.trim()) ? fb.trim() : null;

      setLocalAttempts(prev => [...prev, {
        ...attempt,
        computedAccuracy: accuracy,
        spokenWord: spoken,
        level: lvl + 1,
      }]);

      setLevelResults(prev => {
        const next = {
          ...prev,
          [idx]: {
            ...(prev[idx] || {}),
            [lvl]: { passed, accuracy, transcript: spoken },
          },
        };
        levelResultsRef.current = next;
        return next;
      });

      if (passed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2200);
      }
      setResultState(passed ? 'correct' : 'incorrect');

    } catch {
      setErrorMsg('Could not save attempt. Check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Mic toggle (blocked while LORO speaks) ─────────────
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (blockCountRef.current > 0 || isSpeaking) return; // LORO has the floor
    if (listening) { recognitionRef.current.stop(); return; }
    setInterim('');
    setErrorMsg('');
    setResultState(null);
    setLastSpoken('');
    recognitionRef.current.start();
  };

  // ── Try again ──────────────────────────────────────────
  const handleTryAgain = () => {
    setResultState(null);
    setLastSpoken('');
    setInterim('');
    const exercise = sessionRef.current?.exercises[exIndexRef.current]?.exercise;
    if (exercise) speakWord(getLevels(exercise)[levelRef.current].target);
  };

  // ── Advance level or exercise ──────────────────────────
  const handleNext = async () => {
    const s         = sessionRef.current;
    const idx       = exIndexRef.current;
    const lvl       = levelRef.current;
    const exercises = s?.exercises || [];

    setResultState(null);
    setLastSpoken('');
    setInterim('');

    if (lvl < 2) {
      setCurrentLevel(lvl + 1); // → triggers LORO level-advance prompt (C)
    } else {
      const nextIdx = idx + 1;
      if (nextIdx >= exercises.length) {
        try {
          const res  = await fetch(`${API}/sessions/${sessionId}/complete`, { method: 'PATCH' });
          const data = res.ok ? await res.json() : { totalScore: null };

          const historyByExercise = {};
          exercises.forEach((se, ei) => {
            const ex = se.exercise;
            historyByExercise[ex.id] = {
              targetWord: ex.targetWord,
              level1Text: ex.level1Text || ex.targetWord,
              level2Text: ex.level2Text || null,
              level3Text: ex.level3Text || null,
              levels: levelResultsRef.current[ei] || {},
            };
          });

          localStorage.setItem('levelHistory',  JSON.stringify(historyByExercise));
          localStorage.setItem('lastSessionId', String(sessionId));

          setSummary(data); // → triggers LORO session-complete line (F)
        } catch {
          setSummary({ totalScore: null });
        }
      } else {
        setExIndex(nextIdx);   // → triggers LORO new-exercise prompt (B)
        setCurrentLevel(0);
      }
    }
  };

  // ── TTS helper (routed through LORO so it never fights the hook) ──
  const speakWord = (word) => { if (word) speak(word, { rate: 0.7 }); };

  const loroSpeaking = micBlocked || isSpeaking;

  const mascotState =
    resultState === 'correct'   ? 'celebrating' :
    resultState === 'incorrect' ? 'encouraging' :
    (listening || loroSpeaking) ? 'listening'   : 'idle';

  // ══════════════════════════════════════════════════════
  // RENDER: Loading
  // ══════════════════════════════════════════════════════
  if (loading) return (
    <div className="flex flex-col h-full bg-[#F0F4FF] items-center justify-center gap-4">
      <div className="text-5xl animate-bounce">🦜</div>
      <p className="text-[#1A2C5B] font-semibold text-sm">Loading your adventure...</p>
    </div>
  );

  if (!session) return (
    <div className="flex flex-col h-full bg-[#F0F4FF] items-center justify-center p-6 gap-4">
      <div className="text-5xl">⚠️</div>
      <p className="text-red-400 text-sm text-center font-medium">{errorMsg}</p>
      <button onClick={onBack}
        className="px-8 py-3 bg-[#6B5AE0] text-white rounded-2xl font-bold">
        Go Back
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // RENDER: Session complete summary
  // ══════════════════════════════════════════════════════
  if (summary) {
    const score = typeof summary.totalScore === 'number'
      ? Math.round(summary.totalScore) : null;
    const stars = score === null ? 1 : score >= 90 ? 3 : score >= 70 ? 2 : 1;

    return (
      <div className="flex flex-col h-full bg-[#F0F4FF] overflow-y-auto p-5">
        {showConfetti && <Confetti />}
        <div className="flex justify-between text-3xl pt-2 px-2 mb-3">
          <span>🎉</span><span>✨</span><span>⭐</span>
        </div>
        <div className="bg-white rounded-[32px] shadow-lg p-6 w-full">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="text-2xl font-extrabold text-[#1A2C5B]">Adventure Complete!</h2>
            <p className="text-gray-400 text-sm mt-1">You did amazing today!</p>
          </div>
          <div className="flex justify-center gap-2 mb-5">
            {[1,2,3].map(i => (
              <span key={i} className={`text-4xl ${i <= stars ? '' : 'grayscale opacity-25'}`}>⭐</span>
            ))}
          </div>
          {score !== null && (
            <div className="bg-indigo-50 rounded-3xl p-4 text-center mb-5">
              <p className="text-4xl font-extrabold text-[#6B5AE0]">{score}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Overall Accuracy</p>
            </div>
          )}
          <div className="space-y-3 mb-5">
            {(session?.exercises || []).map((se, ei) => {
              const exercise = se.exercise;
              const levels   = getLevels(exercise);
              const results  = levelResultsRef.current[ei] || {};
              return (
                <div key={ei} className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getEmoji(exercise.targetWord)}</span>
                    <p className="font-bold text-sm text-[#1A2C5B]">{exercise.targetWord}</p>
                  </div>
                  <div className="flex gap-2">
                    {levels.map((lv, li) => {
                      const r = results[li];
                      return (
                        <div key={li} className={`flex-1 rounded-xl p-2 text-center text-[10px] font-bold ${
                          r?.passed === true  ? 'bg-emerald-100 text-emerald-700' :
                          r?.passed === false ? 'bg-orange-100  text-orange-700'  :
                                                'bg-gray-100    text-gray-400'
                        }`}>
                          <p>L{li+1}</p>
                          <p>{r ? `${r.accuracy}%` : '—'}</p>
                          {r?.transcript && (
                            <p className="truncate opacity-70 mt-0.5">"{r.transcript}"</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={onComplete}
            className="w-full py-4 bg-[#6B5AE0] text-white rounded-2xl font-bold
              flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
            Back to Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // RENDER: Main session screen
  // ══════════════════════════════════════════════════════
  const exercises   = session.exercises || [];
  const currentEx   = exercises[exIndex]?.exercise;
  const levelConfig = currentEx ? getLevels(currentEx) : [];
  const activeLv    = levelConfig[currentLevel];
  const levelColor  = LEVEL_COLORS[currentLevel];

  const totalSteps  = exercises.length * 3;
  const doneSteps   = exIndex * 3 + currentLevel;
  const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  if (!currentEx) return (
    <div className="flex flex-col h-full bg-[#F0F4FF] items-center justify-center p-6 gap-4">
      <div className="text-4xl">📭</div>
      <p className="text-gray-500 text-sm text-center">
        No exercises found. Seed the database via POST /api/v1/exercises
      </p>
      <button onClick={onBack}
        className="px-8 py-3 bg-[#6B5AE0] text-white rounded-2xl font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF] overflow-hidden relative">
      {showConfetti && <Confetti />}

      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-3 shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center
            shadow-sm text-gray-500 active:scale-95 shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-violet-400 to-sky-400 rounded-full
            transition-all duration-700"
            style={{ width: `${Math.max(4, progressPct)}%` }} />
        </div>
        <span className="text-xs font-bold text-gray-400 shrink-0">
          {exIndex + 1}/{exercises.length}
        </span>
      </div>

      {/* Level indicator tabs */}
      <div className="flex justify-center gap-2 px-5 mb-3 shrink-0">
        {['Word','Phrase','Sentence'].map((label, i) => (
          <div key={i}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]
              font-bold transition-all duration-300 ${
              i === currentLevel
                ? `${LEVEL_COLORS[i].bg} ${LEVEL_COLORS[i].text} ring-2 ${LEVEL_COLORS[i].ring}`
                : i < currentLevel
                ? 'bg-emerald-50 text-emerald-500'
                : 'bg-white text-gray-300'
            }`}>
            <div className={`w-2 h-2 rounded-full ${
              i === currentLevel ? LEVEL_COLORS[i].dot :
              i < currentLevel   ? 'bg-emerald-400' : 'bg-gray-200'
            }`} />
            {i < currentLevel ? '✓' : `L${i+1}`} {label}
          </div>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4">

        {/* Mascot */}
        <div className="flex justify-center pt-1">
          <Mascot state={mascotState} />
        </div>

        {/* Prompt card */}
        <div className={`rounded-3xl p-4 text-center border-2 transition-all
          duration-500 ${levelColor.bg} ${levelColor.ring} ring-2`}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Level {currentLevel + 1} · {['Word','Phrase','Sentence'][currentLevel]}
          </p>
          <p className={`text-base font-extrabold ${levelColor.text}`}>
            {activeLv?.prompt}
          </p>
          {currentEx.phonemeFocus && (
            <p className="text-[10px] text-orange-400 font-bold mt-1">
              Focus: {currentEx.phonemeFocus}
            </p>
          )}
        </div>

        {/* Image card */}
        <div className="relative bg-white rounded-[28px] shadow-md overflow-hidden
          flex items-center justify-center" style={{ minHeight: 160 }}>
            {activeLv?.image
            ? <img
                src={activeLv.image}
                alt={activeLv.target}
                className="w-full h-40 object-cover transition-all duration-500"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
                />
            : null
            }
            <span
            className="text-[100px] leading-none py-3"
            style={{ display: activeLv?.image ? 'none' : 'flex' }}
            >
            {getEmoji(currentEx.targetWord)}
            </span>
          <button onClick={() => speakWord(activeLv?.target)}
            className="absolute bottom-3 right-3 w-10 h-10 bg-[#6B5AE0] rounded-full
              flex items-center justify-center text-white shadow-lg active:scale-95">
            <Volume2 size={17} />
          </button>
        </div>

        {/* Target word */}
        <div className="text-center">
          <p className="text-[11px] text-gray-400 font-semibold mb-1">Say this:</p>
          <p className="text-3xl font-extrabold text-[#1A2C5B] tracking-tight leading-tight">
            {activeLv?.target}
          </p>
        </div>

        {/* Result: correct */}
        {resultState === 'correct' && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 text-center">
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-extrabold text-emerald-600 text-base">
              {lastAccuracy}% — Excellent!
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              You said: <span className="font-bold">"{lastSpoken}"</span>
            </p>
          </div>
        )}

        {/* Result: incorrect */}
        {resultState === 'incorrect' && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4">
            <p className="text-center font-extrabold text-amber-600 text-base mb-2">
              💪 Almost there!
            </p>
            <div className="flex items-center justify-center gap-2 text-xs
              text-gray-500 font-medium mb-3">
              <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-bold">
                You: "{lastSpoken}"
              </span>
              <span>→</span>
              <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">
                Target: "{activeLv?.target}"
              </span>
            </div>
            <button onClick={() => speakWord(activeLv?.target)}
              className="w-full flex items-center justify-center gap-2 py-2.5
                bg-white border-2 border-amber-200 rounded-2xl text-amber-600
                text-xs font-bold active:scale-95 transition-transform">
              <Volume2 size={14} /> Hear it again 🔊
            </button>
          </div>
        )}

        {/* Interim transcript */}
        {!resultState && interim && (
          <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm text-center">
            <p className="text-sm text-[#1A2C5B] font-medium italic">"{interim}"</p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <p className="text-xs text-red-400 text-center font-medium">{errorMsg}</p>
        )}

        {/* Mic / action buttons */}
        {!resultState ? (
          <div className="flex flex-col items-center gap-2 pb-2">
            <div className="relative">
              {listening && !loroSpeaking && (
                <div className="absolute inset-0 rounded-full bg-violet-300 animate-ping opacity-60" />
              )}
              <button onClick={handleMicClick} disabled={submitting || loroSpeaking}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center
                  text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed ${
                  loroSpeaking
                    ? 'bg-gray-300 shadow-none'
                    : listening
                    ? 'bg-rose-400 shadow-rose-200'
                    : 'bg-[#6B5AE0] shadow-violet-200 hover:bg-[#5A48D0]'
                }`}>
                <Mic size={36} />
              </button>
            </div>
            <p className="text-xs text-gray-400 font-medium min-h-[16px] text-center">
              {loroSpeaking ? 'LORO is speaking… 🦜' :
               submitting  ? 'Checking your answer…' :
               listening   ? 'Listening… tap to stop' :
               'Tap the mic and speak!'}
            </p>
          </div>
        ) : (
          <div className="flex gap-3 pb-2">
            {resultState === 'incorrect' && (
              <button onClick={handleTryAgain}
                className="flex-1 py-4 border-2 border-gray-200 bg-white text-gray-600
                  rounded-2xl font-bold active:scale-95 transition-transform">
                Try Again
              </button>
            )}
            <button onClick={handleNext}
              className="flex-1 py-4 bg-[#6B5AE0] text-white rounded-2xl font-bold
                flex items-center justify-center gap-2 shadow-md
                active:scale-95 transition-transform">
              {currentLevel === 2 && exIndex + 1 >= exercises.length
                ? 'Finish 🎉'
                : currentLevel < 2
                ? <>Next Level <ArrowRight size={17} /></>
                : <>Next Word  <ArrowRight size={17} /></>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}