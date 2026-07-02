import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Volume2, ChevronDown, ChevronUp,
  Mic, Check, Lock, Star, Sparkles
} from 'lucide-react';

// ── Priority config ────────────────────────────────────────
function getPriority(accuracy) {
  if (accuracy === null || accuracy === undefined)
    return { label: 'Not Tried', color: 'bg-gray-100 text-gray-500', filter: 'none' };
  if (accuracy < 50)
    return { label: 'Needs Work', color: 'bg-red-100 text-red-600', filter: 'High Priority' };
  if (accuracy < 80)
    return { label: 'Improving', color: 'bg-orange-100 text-orange-600', filter: 'Improving' };
  return { label: 'Mastered', color: 'bg-green-100 text-green-700', filter: 'Mastered' };
}

// ── Score ring color ───────────────────────────────────────
function scoreColor(score) {
  if (score === null || score === undefined) return 'text-gray-400';
  if (score < 50) return 'text-red-500';
  if (score < 80) return 'text-orange-500';
  return 'text-green-600';
}

// ── Build levels from REAL saved data (levelHistory) ───────
// entry shape: { targetWord, level1Text, level2Text, level3Text,
//                levels: { "0": {passed,accuracy,transcript}, "1": ..., "2": ... } }
function buildLevelsFromHistory(entry) {
  const texts  = [entry.level1Text, entry.level2Text, entry.level3Text];
  const labels = ['Word', 'Phrase', 'Sentence'];
  return [0, 1, 2].map((i) => {
    const r = entry.levels?.[i] ?? entry.levels?.[String(i)] ?? null;
    return {
      level:    i + 1,
      label:    labels[i],
      prompt:   texts[i] || entry.targetWord,          // real seeded text
      score:    r && typeof r.accuracy === 'number' ? Math.round(r.accuracy) : null,
      unlocked: r !== null,                            // attempted = unlocked (real, not fabricated)
      transcript: r?.transcript || null,
    };
  });
}

// ── Templated AI feedback (real Gemini not wired yet — demo placeholder) ──
function getMockFeedback(targetWord, accuracy) {
  if (accuracy === null || accuracy === undefined)
    return `Let's practice saying "${targetWord}" together! Tap the mic and give it a try. 🎙️`;
  if (accuracy >= 85)
    return `Wow, amazing work on "${targetWord}"! Your pronunciation is really improving. Keep it up! 🌟`;
  if (accuracy >= 60)
    return `Good effort on "${targetWord}"! You're getting closer. Try saying it a little slower next time. 💪`;
  return `Let's keep practicing "${targetWord}" — every attempt makes you stronger! You've got this! 🤖`;
}

// ── TTS helper ─────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.75; utt.lang = 'en-US';
  window.speechSynthesis.speak(utt);
}

// ════════════════════════════════════════════════════════════
// WORD ROW — accordion card
// ════════════════════════════════════════════════════════════
function WordRow({ word, onPractice }) {
  const [open, setOpen] = useState(false);
  const { label: priorityLabel, color: priorityColor } = getPriority(word.accuracy);
  const levels = word.levels; // already built from real history
  const aiFeedback = getMockFeedback(word.targetWord, word.accuracy);

  return (
    <div className={`border-b border-gray-50 last:border-0 transition-all ${open ? 'bg-indigo-50/30' : 'bg-white'}`}>

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
          {word.transcript && word.transcript !== '—' && (
            <p className="text-[11px] text-gray-400 truncate mt-0.5">
              Said: <span className="italic">"{word.transcript}"</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`font-extrabold text-sm ${scoreColor(word.accuracy)}`}>
            {word.accuracy !== null ? `${word.accuracy}%` : '—'}
          </span>
          {open
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {/* ── Expanded accordion content ── */}
      {open && (
        <div className="px-4 pb-4 space-y-3">

          {/* Progressive Overload Levels */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Progressive Levels
              </p>
            </div>
            {levels.map((lv) => (
              <div
                key={lv.level}
                className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-50 last:border-0 ${
                  !lv.unlocked ? 'opacity-50' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-extrabold ${
                  lv.score !== null && lv.score >= 80
                    ? 'bg-green-100 text-green-600'
                    : lv.unlocked
                    ? 'bg-indigo-100 text-[#2881f2]'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {lv.score !== null && lv.score >= 80
                    ? <Check size={12} />
                    : !lv.unlocked
                    ? <Lock size={10} />
                    : lv.level
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{lv.label}</p>
                  <p className="text-sm font-semibold text-[#1A2C5B] truncate">"{lv.prompt}"</p>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {!lv.unlocked ? (
                    <span className="text-[10px] text-gray-400 font-medium">Locked</span>
                  ) : lv.score !== null ? (
                    <span className={`text-sm font-extrabold ${scoreColor(lv.score)}`}>
                      {lv.score}%
                    </span>
                  ) : (
                    <button
                      onClick={() => speak(lv.prompt)}
                      className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[#2881f2] active:scale-95"
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                  {lv.unlocked && lv.score !== null && (
                    <button
                      onClick={() => speak(lv.prompt)}
                      className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-95 ml-1"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Feedback Bubble (templated for now) */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-3 border border-indigo-100 flex gap-2.5 items-start">
            <div className="w-8 h-8 bg-[#2881f2] rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold text-[#2881f2] uppercase tracking-wider mb-1">
                AI Coach Says
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">{aiFeedback}</p>
            </div>
          </div>

          {(word.accuracy === null || word.accuracy < 85) && (
            <button
              onClick={() => onPractice && onPractice(word.exerciseId, word.targetWord)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2881f2] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-indigo-200 active:scale-95 transition-transform"
            >
              <Mic size={16} />
              Practice Now
            </button>
          )}

          {word.accuracy !== null && word.accuracy >= 85 && (
            <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-2xl">
              <Star size={16} className="text-green-600 fill-green-600" />
              <span className="font-extrabold text-sm text-green-700">Word Mastered!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN DICTIONARY COMPONENT — reads levelHistory (real data)
// ════════════════════════════════════════════════════════════
export default function Dictionary({ onBack, onPractice }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Words');
  const [stats, setStats] = useState({ total: 0, improving: 0, mastered: 0, accuracy: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('levelHistory');
      if (!raw) { setLoading(false); return; }

      const history = JSON.parse(raw);

        const wordList = Object.entries(history)
        .filter(([, entry]) => entry && entry.targetWord && entry.levels)
        .map(([exerciseId, entry]) => {
            // ... unchanged
        const levels = buildLevelsFromHistory(entry);

        // Overall word accuracy = average of attempted levels (real scores)
        const scored = levels.map(l => l.score).filter(s => s !== null);
        const accuracy = scored.length
          ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
          : null;

        // Best available transcript for the "Said:" preview (prefer last level attempted)
        const lastTranscript =
          levels[2]?.transcript || levels[1]?.transcript || levels[0]?.transcript || null;

        return {
          exerciseId:  isNaN(Number(exerciseId)) ? exerciseId : Number(exerciseId),
          targetWord:  entry.targetWord,
          nativeWord:  entry.nativeWord || null,
          transcript:  lastTranscript,
          accuracy,
          levels,
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
      // corrupt/absent history → empty state handled below
    } finally {
      setLoading(false);
    }
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
            These words are curated from Juan's recent sessions. Tap any word to see
            all 3 practice levels and your <span className="text-[#2881f2] font-semibold">AI coach feedback</span>!
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { val: stats.total,     label: 'WORDS' },
            { val: stats.improving, label: 'IMPROVING' },
            { val: stats.mastered,  label: 'MASTERED' },
            { val: `${stats.accuracy}%`, label: 'ACCURACY' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-50">
              <p className="font-extrabold text-[#1A2C5B] text-sm">{s.val}</p>
              <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter pills — scrollbar hidden ── */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                filter === f
                  ? 'bg-[#2881f2] text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Word accordion list ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-[#1A2C5B] text-sm">Word Breakdown</h3>
            <span className="text-[10px] text-gray-400 font-medium">Tap a word to expand</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <img
                src="/src/assets/FLAP.gif"
                alt="FLAP loading mascot"
                className="w-16 h-16 object-contain"
              />
              <p className="text-sm text-gray-500 font-medium">Loading your words...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-4xl">📭</span>
              <p className="text-sm text-gray-400 font-medium text-center px-6">
                {words.length === 0
                  ? 'Complete a learning session to see your words here.'
                  : 'No words in this category yet.'}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((w, i) => (
                <WordRow key={i} word={w} onPractice={onPractice} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}