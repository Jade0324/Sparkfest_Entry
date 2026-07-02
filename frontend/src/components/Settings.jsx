import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Mic, User, Info, Moon } from 'lucide-react';

export default function Settings({ onBack }) {
  const [speechRate, setSpeechRate] = useState(0.75);
  const [darkMode, setDarkMode] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);

  const speakTest = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance('Hello! I am your speech buddy!');
    utt.rate = speechRate;
    utt.lang = 'en-US';
    window.speechSynthesis.speak(utt);
  };

  const rows = [
    {
      section: 'Audio',
      items: [
        {
          icon: Volume2,
          color: 'text-purple-500',
          bg: 'bg-purple-50',
          label: 'Speech Speed',
          sub: `${speechRate}x`,
          control: (
            <input
              type="range" min="0.5" max="1.5" step="0.25"
              value={speechRate}
              onChange={e => setSpeechRate(Number(e.target.value))}
              className="w-24 accent-[#2881f2]"
            />
          ),
        },
        {
          icon: Mic,
          color: 'text-red-500',
          bg: 'bg-red-50',
          label: 'Microphone',
          sub: micEnabled ? 'Enabled' : 'Disabled',
          control: (
            <button
              onClick={() => setMicEnabled(v => !v)}
              className={`w-12 h-6 rounded-full transition-colors relative ${micEnabled ? 'bg-[#2881f2]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${micEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          ),
        },
      ],
    },
    {
      section: 'Appearance',
      items: [
        {
          icon: Moon,
          color: 'text-indigo-500',
          bg: 'bg-indigo-50',
          label: 'Dark Mode',
          sub: 'Coming soon',
          control: (
            <button
              disabled
              className="w-12 h-6 rounded-full bg-gray-200 relative opacity-50 cursor-not-allowed"
            >
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          ),
        },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          icon: User,
          color: 'text-green-500',
          bg: 'bg-green-50',
          label: 'Child Profile',
          sub: 'Juan Dela Cruz · Age 7',
          control: <ChevronRight size={18} className="text-gray-300" />,
        },
        {
          icon: Info,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          label: 'About LORO',
          sub: 'Version 1.0.0 · Hackathon MVP',
          control: <ChevronRight size={18} className="text-gray-300" />,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white shadow-sm shrink-0">
        <button onClick={onBack} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-95">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-extrabold text-[#1A2C5B]">Settings</h2>
        <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-xl">⚙️</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-5">

        {rows.map((section, si) => (
          <div key={si}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {section.section}
            </p>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {section.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1A2C5B]">{item.label}</p>
                    <p className="text-[11px] text-gray-400 truncate">{item.sub}</p>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Test TTS button */}
        <button
          onClick={speakTest}
          className="w-full py-3.5 bg-white border-2 border-[#2881f2] text-[#2881f2] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Volume2 size={16} /> Test Voice Speed
        </button>

      </div>
    </div>
  );
}