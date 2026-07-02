import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star } from 'lucide-react';

const API      = 'https://sparkfest-entry-1.onrender.com/api/v1';
const CHILD_ID = 1;

const EMOJI_MAP = {
  apple:'🍎', banana:'🍌', cat:'🐱', dog:'🐶', fish:'🐟',
  rabbit:'🐰', ball:'⚽', water:'💧', bird:'🐦', flower:'🌸',
  tree:'🌳', sun:'☀️', moon:'🌙', star:'⭐', house:'🏠',
  car:'🚗', book:'📚', pen:'✏️', milk:'🥛', egg:'🥚',
  mango:'🥭', orange:'🍊', grapes:'🍇', lion:'🦁', frog:'🐸',
};

const CATEGORY_EMOJI = {
  'Animals': '🐾', 'Fruits': '🍎', 'Things': '🏠',
  'Colors':  '🎨', 'Numbers': '🔢', 'Body':  '👁️',
};

function getAccuracy(exerciseId) {
  try {
    const raw = localStorage.getItem('levelHistory');
    if (!raw) return null;
    const history = JSON.parse(raw);
    const entry = history?.[exerciseId] ?? history?.[String(exerciseId)];
    if (!entry || !entry.levels) return null;

    const vals = Object.values(entry.levels)
      .map(l => (typeof l?.accuracy === 'number' ? l.accuracy : null))
      .filter(v => v !== null);

    if (vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  } catch {
    return null;
  }
}

function AccuracyBadge({ value }) {
  if (value === null) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
        New
      </span>
    );
  }
  const color =
    value >= 80 ? 'bg-green-50 text-green-600'
    : value >= 50 ? 'bg-yellow-50 text-[#F8A03E]'
    : 'bg-pink-50 text-[#F495A5]';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      <Star size={9} className="fill-current" /> {value}%
    </span>
  );
}

export default function WordPicker({ category, onBack, onStartSession }) {
  const [words, setWords]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [startingId, setStartingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/exercises?category=${encodeURIComponent(category)}&size=100`);
        if (!res.ok) throw new Error('Could not load words for this topic.');
        const data = await res.json();
        const list = Array.isArray(data?.content) ? data.content
                   : Array.isArray(data) ? data
                   : [];
        if (!cancelled) setWords(list);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load words. Is the backend running on port 8080?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [category]);

  const handlePick = async (exerciseId) => {
    if (startingId !== null) return;
    setStartingId(exerciseId);
    setError('');
    try {
      const res = await fetch(`${API}/sessions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ childId: CHILD_ID, exerciseIds: [exerciseId] }),
      });
      if (!res.ok) throw new Error('Could not start session.');
      const session = await res.json();
      localStorage.setItem('lastSessionId', String(session.id));
      onStartSession(session.id);
    } catch (err) {
      setError(err.message || 'Failed to start. Is the backend running?');
      setStartingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">

      <div className="flex items-center gap-3 p-6 bg-white shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#F4F6FB] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A2C5B]" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CATEGORY_EMOJI[category] || '📚'}</span>
          <h1 className="text-lg font-extrabold text-[#1A2C5B]">{category}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8">

        <p className="text-sm font-semibold text-gray-500 mb-5">Pick a word to practice</p>

        {loading && (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-4">
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && words.length === 0 && (
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm text-center font-medium">
              No words in <span className="font-bold">{category}</span> yet.
            </p>
          </div>
        )}

        {!loading && words.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {words.map((ex) => {
              const word  = ex.targetWord || '';
              const emoji = EMOJI_MAP[word.toLowerCase()] || '🔤';
              const acc   = getAccuracy(ex.id);
              const isStarting = startingId === ex.id;

              return (
                <button
                  key={ex.id}
                  onClick={() => handlePick(ex.id)}
                  disabled={startingId !== null}
                  className="relative bg-white rounded-3xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-transform disabled:opacity-60"
                >
                  <div className="w-16 h-16 bg-[#F4F6FB] rounded-2xl flex items-center justify-center text-4xl">
                    {emoji}
                  </div>
                  <span className="font-extrabold text-[#1A2C5B] text-base">{word}</span>
                  <AccuracyBadge value={acc} />

                  {isStarting && (
                    <div className="absolute inset-0 bg-white/70 rounded-3xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#6B5AE0] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}