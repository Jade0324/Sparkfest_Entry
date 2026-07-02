import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Volume2, ChevronDown, ChevronUp,
  Mic, Check, Lock, Star, Sparkles, MessageCircle,
} from 'lucide-react';

const API = 'http://localhost:8080/api/v1';

// ── Helpers ────────────────────────────────────────────────

function getPriority(accuracy) {
  if (accuracy === null || accuracy === undefined)
    return { label: 'Not Tried', color: 'bg-gray-100 text-gray-500' };
  if (accuracy < 50)
    return { label: 'Needs Work', color: 'bg-red-100 text-red-600' };
  if (accuracy < 80)
    return { label: 'Improving',  color: 'bg-orange-100 text-orange-600' };
  return   { label: 'Mastered',   color: 'bg-green-100 text-green-700' };
}

function scoreColor(score) {
  if (score === null || score === undefined) return 'text-gray-400';
  if (score < 50)  return 'text-red-500';
  if (score < 80)  return 'text-orange-500';
  return 'text-green-600';
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.75; utt.lang = 'en-US';
  window.speechSynthesis.speak(utt);
}

// ── Build 3 levels from word object (uses real backend text if available) ──
function buildLevels(word) {
  const { targetWord, level1Text, level2Text, level3Text, levelData } = word;
  const article = ['a','e','i','o','u'].includes(targetWord[0]?.toLowerCase()) ? 'an' : 'a';

  const targets = [
    level1Text || targetWord,
    level2Text || `I see ${article} ${targetWord.toLowerCase()}`,
    level3Text || `The ${targetWord.toLowerCase()} is very beautiful`,
  ];
  const labels = ['Word', 'Phrase', 'Sentence'];

  return targets.map((prompt, i) => {
    const hist      = levelData?.[String(i)] ?? null;
    const prevDone  = i === 0 ? true : !!(levelData?.[String(i - 1)]?.passed);
    return {
      level:      i + 1,
      label:      labels[i],
      prompt,
      score:      hist?.accuracy    ?? null,
      transcript: hist?.transcript  ?? null,
      passed:     hist?.passed      ?? null,
      unlocked:   i === 0 || prevDone,
    };
  });
}

function getMockFeedback(targetWord, accuracy) {
  if (accuracy === null || accuracy === undefined)
    return `Let's practice saying "${targetWord}" together! Tap the mic and give it a try. 🎙️`;
  if (accuracy >= 85)
    return `Wow, amazing work on "${targetWord}"! Your pronunciation is really improving. Keep it up! 🌟`;
  if (accuracy >= 60)
    return `Good effort on "${targetWord}"! You're getting closer. Try saying it a little slower next time. 💪`;
  return `Let's keep practicing "${targetWord}" — every attempt makes you stronger! You've got this! 🤖`;
}

// ══════════════════════════════════════════════════════════
// WORD ROW — expandable accordion card
// ══════════════════════════════════════════════════════════
function WordRow({ word, onPractice }) {
  const [open, setOpen] = useState(false);
  const { label: priorityLabel, color: priorityColor } = getPriority(word.accuracy);
  const levels    = buildLevels(word);
  const aiFeedback = word.aiFeedback || getMockFeedback(word.targetWord, word.accuracy);
  const isMastered = word.accuracy !== null && word.accuracy >= 85;

  return (
    <div className={`border-b border-gray-50 last:border-0 transition-colors ${open ? 'bg-indigo-50/20' : 'bg-white'}`}>

      {/* ── Collapsed row ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50"
      >
        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 min-w-[76px] text-center ${priorityColor}`}>
          {priorityLabel}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-[#1A2C5B] truncate">{word.targetWord}</span>
            {word.nativeWord && (
              <span className="text-[10px] text-gray-400 font-medium">· {word.nativeWord}</span>
            )}
          </div>
          {/* Show latest transcript in collapsed view */}
          {word.transcript && (
            <p className="text-[11px] text-gray-400 truncate mt-0.5 italic">
              Last said: "{word.transcript}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`font-extrabold text-sm ${scoreColor(word.accuracy)}`}>
            {word.accuracy !== null ? `${word.accuracy}%` : '—'}
          </span>
          {open
            ? <ChevronUp   size={15} className="text-gray-400" />
            : <ChevronDown size={15} className="text-gray-400" />
          }
        </div>
      </button>

      {/* ── Expanded content ── */}
      {open && (
        <div className="px-4 pb-4 space-y-3">

          {/* Per-level history */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Progressive Levels
              </p>
              <p className="text-[9px] text-gray-300 font-medium">Tap 🔊 to hear</p>
            </div>

            {levels.map((lv) => (
              <div
                key={lv.level}
                className={`px-3 py-3 border-b border-gray-50 last:border-0 ${!lv.unlocked ? 'opacity-40' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Level indicator dot */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold ${
                    lv.passed === true
                      ? 'bg-green-100 text-green-600'
                      : !lv.unlocked
                      ? 'bg-gray-100 text-gray-400'
                      : lv.score !== null
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-indigo-100 text-[#6B5AE0]'
                  }`}>
                    {lv.passed === true   ? <Check size={12} /> :
                     !lv.unlocked         ? <Lock  size={10} /> :
                     lv.level}
                  </div>

                  {/* Level text + transcript */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        L{lv.level} · {lv.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1A2C5B] leading-snug">
                      "{lv.prompt}"
                    </p>

                    {/* What the child said */}
                    {lv.transcript ? (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MessageCircle size={10} className="text-gray-300 shrink-0" />
                        <span className="text-[10px] text-gray-400">
                          Said: <span className="italic font-medium text-gray-500">"{lv.transcript}"</span>
                        </span>
                      </div>
                    ) : lv.unlocked && lv.score === null ? (
                      <p className="text-[10px] text-indigo-400 mt-1 font-medium">
                        Not attempted yet
                      </p>
                    ) : !lv.unlocked ? (
                      <p className="text-[10px] text-gray-300 mt-1">
                        Complete previous level to unlock
                      </p>
                    ) : null}
                  </div>

                  {/* Score + TTS button */}
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {lv.score !== null && (
                      <span className={`text-sm font-extrabold ${scoreColor(lv.score)}`}>
                        {lv.score}%
                      </span>
                    )}
                    {lv.unlocked && (
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(lv.prompt); }}
                        className="w-7 h-7 rounded-full bg-gray-50 hover:bg-indigo-50 flex items-center justify-center text-gray-400 hover:text-[#6B5AE0] active:scale-95 transition-colors"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Coach feedback bubble */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-3 border border-indigo-100 flex gap-2.5 items-start">
            <div className="w-8 h-8 bg-[#6B5AE0] rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold text-[#6B5AE0] uppercase tracking-wider mb-1">
                AI Coach Says
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">{aiFeedback}</p>
            </div>
          </div>

          {/* Practice Now / Mastered */}
          {isMastered ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-2xl">
              <Star size={15} className="text-green-600 fill-green-600" />
              <span className="font-extrabold text-sm text-green-700">Word Mastered! 🏆</span>
            </div>
          ) : (
            <button
              onClick={() => onPractice && onPractice(word.exerciseId, word.targetWord)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#6B5AE0] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-indigo-200 active:scale-95 transition-transform"
            >
              <Mic size={15} />
              Practice Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN DICTIONARY COMPONENT
// ══════════════════════════════════════════════════════════
export default function Dictionary({ onBack, onPractice }) {
  const [words,   setWords]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All Words');
  const [stats,   setStats]   = useState({ total: 0, improving: 0, mastered: 0, accuracy: 0 });

  // ── Drag-to-scroll refs ────────────────────────────────
  const pillsRef    = useRef(null);
  const isDragging  = useRef(false);
  const dragStartX  = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown  = (e) => {
    isDragging.current  = true;
    dragStartX.current  = e.pageX - pillsRef.current.offsetLeft;
    scrollStart.current = pillsRef.current.scrollLeft;
    pillsRef.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    if (pillsRef.current) pillsRef.current.style.cursor = 'grab';
  };
  const onMouseUp    = () => {
    isDragging.current = false;
    if (pillsRef.current) pillsRef.current.style.cursor = 'grab';
  };
  const onMouseMove  = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x    = e.pageX - pillsRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    pillsRef.current.scrollLeft = scrollStart.current - walk;
  };

  // ── Fetch data ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const sessionId    = localStorage.getItem('lastSessionId');
      const levelHistory = JSON.parse(localStorage.getItem('levelHistory') || '{}');

      if (!sessionId) { setLoading(false); return; }

      try {
        const res = await fetch(`${API}/sessions/${sessionId}/attempts`);
        if (!res.ok) throw new Error();
        const attempts = await res.json();

        // Keep latest attempt per exercise
        const byExercise = {};
        for (const a of attempts) {
          const key = a.exerciseId;
          if (!byExercise[key] || a.attemptNumber > byExercise[key].attemptNumber) {
            byExercise[key] = a;
          }
        }

        const wordList = Object.values(byExercise).map(a => {
          const hist = levelHistory[a.exerciseId] || null;

          // Overall accuracy: use backend score, or derive from level data
          let accuracy = a.accuracyScore !== null
            ? Math.round(Number(a.accuracyScore))
            : null;

          // If we have level history, compute overall as average of attempted levels
          if (hist?.levels) {
            const attempted = Object.values(hist.levels).filter(l => l.accuracy !== undefined);
            if (attempted.length > 0) {
              accuracy = Math.round(
                attempted.reduce((s, l) => s + l.accuracy, 0) / attempted.length
              );
            }
          }

          return {
            exerciseId: a.exerciseId,
            targetWord: a.targetWord,
            nativeWord: a.nativeWord,
            // Latest transcript from backend attempt
            transcript: a.transcript || null,
            accuracy,
            passed:     a.passed,
            aiFeedback: a.aiFeedback || null,
            // Level-specific text from localStorage (set by LearningSession on complete)
            level1Text: hist?.level1Text || null,
            level2Text: hist?.level2Text || null,
            level3Text: hist?.level3Text || null,
            // Per-level scores + transcripts
            levelData:  hist?.levels    || null,
          };
        });

        const avg = wordList.length
          ? Math.round(wordList.reduce((s, w) => s + (w.accuracy ?? 0), 0) / wordList.length)
          : 0;

        setWords(wordList);
        setStats({
          total:     wordList.length,
          improving: wordList.filter(w => w.accuracy !== null && w.accuracy >= 50 && w.accuracy < 85).length,
          mastered:  wordList.filter(w => w.accuracy !== null && w.accuracy >= 85).length,
          accuracy:  avg,
        });
      } catch {
        // empty state shown below
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const FILTERS = ['All Words', 'High Priority', 'Improving', 'Mastered'];

  const filtered = words.filter(w => {
    const acc = w.accuracy;
    if (filter === 'High Priority') return acc === null || acc < 50;
    if (filter === 'Improving')    return acc !== null && acc >= 50 && acc < 85;
    if (filter === 'Mastered')     return acc !== null && acc >= 85;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white shadow-sm shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-95"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-extrabold text-[#1A2C5B]">Practice Dictionary</h2>
        <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-xl">🤖</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">

        {/* ── AI tip card ── */}
        <div className="bg-white rounded-3xl p-4 flex gap-3 items-start shadow-sm mb-4 border border-gray-100">
          <span className="text-2xl mt-0.5">👦🏻</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            These words are from Juan's recent sessions. Tap any row to see all{' '}
            <span className="text-[#6B5AE0] font-semibold">3 progressive levels</span>,
            what was said, and AI coach feedback!
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { val: stats.total,     label: 'WORDS'     },
            { val: stats.improving, label: 'IMPROVING' },
            { val: stats.mastered,  label: 'MASTERED'  },
            { val: `${stats.accuracy}%`, label: 'ACCURACY' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-50">
              <p className="font-extrabold text-[#1A2C5B] text-sm">{s.val}</p>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter pills — drag-to-scroll on desktop ── */}
        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto pb-1 mb-4 select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                filter === f
                  ? 'bg-[#6B5AE0] text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Accordion word list ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-[#1A2C5B] text-sm">Word Breakdown</h3>
            <span className="text-[10px] text-gray-400 font-medium">Tap a word to expand</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-3xl animate-bounce">🤖</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 px-6">
              <span className="text-4xl">📭</span>
              <p className="text-sm text-gray-400 font-medium text-center">
                {words.length === 0
                  ? 'Complete a learning session to see your words here.'
                  : 'No words in this category yet.'}
              </p>
            </div>
          ) : (
            filtered.map((w, i) => (
              <WordRow key={`${w.exerciseId}-${i}`} word={w} onPractice={onPractice} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}