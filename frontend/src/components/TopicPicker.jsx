import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';

const API = 'http://localhost:8080/api/v1';

const CATEGORY_EMOJI = {
  'Animals': '🐾',
  'Fruits':  '🍎',
  'Things':  '🏠',
  'Colors':  '🎨',
  'Numbers': '🔢',
  'Body':    '👁️',
};

// subtle tint rotation so cards feel varied but stay on-brand
const CARD_TINTS = [
  'bg-purple-50',
  'bg-orange-50',
  'bg-pink-50',
  'bg-green-50',
  'bg-blue-50',
  'bg-yellow-50',
];

export default function TopicPicker({ onBack, onPickCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/exercises/categories`);
        if (!res.ok) throw new Error('Could not load categories.');
        const data = await res.json();
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load categories. Is the backend running on port 8080?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">

      {/* Header */}
      <div className="flex items-center gap-3 p-6 bg-white shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#F4F6FB] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A2C5B]" />
        </button>
        <h1 className="text-lg font-extrabold text-[#1A2C5B]">Choose a Topic</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-8">

        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-2xl bg-[#EDEAFB] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#6B5AE0]" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Pick something fun to practice today!</p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm text-center font-medium">
              No categories yet. Set a <span className="font-bold">category</span> on your exercises first
              (run the seed SQL), then come back.
            </p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => onPickCategory(cat)}
                className="bg-white rounded-3xl p-5 flex flex-col items-start gap-3 shadow-sm border border-gray-100 active:scale-95 transition-transform text-left"
              >
                <div className={`w-16 h-16 ${CARD_TINTS[i % CARD_TINTS.length]} rounded-2xl flex items-center justify-center text-4xl`}>
                  {CATEGORY_EMOJI[cat] || '📚'}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1A2C5B] text-base leading-tight">{cat}</h3>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Tap to explore</p>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}