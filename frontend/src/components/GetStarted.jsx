import React from 'react';

export default function GetStarted({ onNext }) {
  return (
    <div className="flex flex-col h-full bg-[#1A2C5B] relative overflow-hidden">

      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-[#6B5AE0] rounded-full opacity-20" />
      <div className="absolute top-[80px] left-[-40px] w-40 h-40 bg-[#F8A03E] rounded-full opacity-10" />
      <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 bg-[#6B5AE0] rounded-full opacity-15" />

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">

        {/* Logo */}
        <div className="w-28 h-28 bg-white rounded-[32px] shadow-2xl flex items-center justify-center mb-6 overflow-hidden p-2">
          <img
            src="/src/assets/LOGO.svg"
            alt="TalinoTinig logo"
            className="w-full h-full object-contain"
          />
        </div>

            {/* App name */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-center">
            <span className="text-white">LORO</span>
        </h1>
        <p className="text-[#F8A03E] text-sm font-bold tracking-[0.15em] uppercase text-center mb-4">
          Speech Progress Buddy
        </p>
        <p className="text-indigo-200 text-sm text-center mb-10 leading-relaxed px-4">
          Speech Progress Buddy.
        </p>

        {/* Illustration */}
        <div className="flex gap-4 mb-10">
          {['🍎', '🐱', '🌟', '🐶', '🍌'].map((emoji, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Feature bullets */}
        <div className="w-full space-y-3 mb-8">
          {[
            { icon: '🎙️', text: 'Speech practice with real-time feedback' },
            { icon: '📚', text: 'Personalized word dictionary' },
            { icon: '🏆', text: 'Track progress across sessions' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-white text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 shrink-0">
        <div
          className="w-full relative z-20 cursor-pointer"
          onClick={onNext}
        >
          <button
            type="button"
            className="w-full py-4 bg-[#6B5AE0] text-white rounded-3xl font-extrabold text-base shadow-lg shadow-indigo-900/40 active:scale-95 transition-transform"
          >
            Get Started 🚀
          </button>
        </div>
        <p className="text-indigo-300 text-xs text-center mt-4">
          Designed for children with speech delays
        </p>
      </div>
    </div>
  );
}