import React from 'react';
import { Bell, Mic, BookOpen, Target, Star, Flame, Check, Lock } from 'lucide-react';

export default function Home({ onStartSession, onOpenProgress, onOpenDictionary, onOpenAccount }) {

  // Mock data — replace with real DashboardController once built
  const summary = {
    sessionsCompleted: 3,
    overallAccuracy: 72,
    starsEarned: 45,
    streakDays: 2,
    recentSessions: [
      { title: 'Fruits Around Us', date: 'Today', score: '85%', icon: '🍎' },
      { title: 'Animals', date: 'Yesterday', score: '70%', icon: '🐱' },
    ],
    child: { name: 'Juan Dela Cruz', age: 7, grade: 'Grade 2', tier: 'Tier 2' }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] relative overflow-hidden">

      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-white shrink-0">
        <div className="w-6 h-6" /> {/* spacer */}
        <div className="flex items-center gap-1">
          <svg className="w-6 h-6 text-[#1A2C5B]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M85 50 C85 69 69 85 50 85 H25 L35 75 C19 65 15 45 25 30 C35 15 55 10 70 20 C80 30 85 40 85 50 Z" />
            <circle cx="38" cy="45" r="5" fill="currentColor" stroke="none"/>
            <circle cx="62" cy="45" r="5" fill="currentColor" stroke="none"/>
            <path d="M38 60 Q50 72 62 60" />
          </svg>
          <h1 className="text-lg font-extrabold tracking-tight">
            <span className="text-[#1A2C5B]">Talino</span>
            <span className="text-[#F8A03E]">Tini</span>
            <span className="text-[#F495A5]">g</span>
          </h1>
        </div>
        <Bell className="w-6 h-6 text-gray-600" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-5 pt-4">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl">👦🏻</div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-[#1A2C5B] text-lg">{summary.child.name}</h2>
              <p className="text-xs text-gray-500 mb-1">Age {summary.child.age} • {summary.child.grade}</p>
              <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                <Star className="w-3 h-3 fill-indigo-600" /> {summary.child.tier}
              </div>
            </div>
          </div>
          <div className="text-3xl bg-green-50 p-2 rounded-2xl">🤖</div>
        </div>

        {/* Stats */}
        <h3 className="font-bold text-[#1A2C5B] mb-3">Overview</h3>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: BookOpen, val: summary.sessionsCompleted, label: 'Sessions\nCompleted', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Target, val: `${summary.overallAccuracy}%`, label: 'Overall\nAccuracy', color: 'text-green-500', bg: 'bg-green-50' },
            { icon: Star, val: summary.starsEarned, label: 'Stars\nEarned', color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { icon: Flame, val: summary.streakDays, label: 'Day\nStreak', color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center text-center shadow-sm border border-gray-50">
              <div className={`w-8 h-8 ${stat.bg} rounded-full flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="font-bold text-[#1A2C5B] text-sm">{stat.val}</span>
              <span className="text-[9px] text-gray-500 whitespace-pre-line leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tier progress */}
        <div className="flex justify-between items-center mb-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full translate-y-2" />
          <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-[#4A5CE0] -z-10 rounded-full translate-y-2" />
          {[
            { label: 'Tier 1', done: true },
            { label: 'Tier 2', active: true },
            { label: 'Tier 3', locked: true },
          ].map((tier, i) => (
            <div key={i} className="flex flex-col items-center gap-1 bg-[#F8F9FC] px-1">
              <span className={`text-xs font-semibold ${tier.active ? 'text-[#4A5CE0]' : tier.done ? 'text-green-500' : 'text-gray-400'}`}>
                {tier.label}
              </span>
              <div className={`${tier.active ? 'w-8 h-8 ring-4 ring-[#E0E4FF]' : 'w-6 h-6'} ${
                tier.done ? 'bg-green-500' : tier.active ? 'bg-[#4A5CE0]' : 'bg-gray-200'
              } rounded-full flex items-center justify-center text-white`}>
                {tier.done ? <Check size={14} /> : tier.active ? <Star size={16} className="fill-white" /> : <Lock size={12} className="text-gray-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold text-[#1A2C5B]">Recent Sessions</h3>
          <button onClick={onOpenProgress} className="text-xs font-semibold text-[#4A5CE0]">View all</button>
        </div>
        <div className="space-y-3">
          {summary.recentSessions.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4F6FB] rounded-xl flex items-center justify-center text-xl">{s.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm text-[#1A2C5B]">{s.title}</h4>
                  <p className="text-[10px] text-gray-500">{s.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#F8A03E] font-bold text-sm bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={12} className="fill-[#F8A03E]" /> {s.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB — Start Session → goes to Topic Picker */}
      <div className="absolute bottom-20 left-0 w-full px-5 pointer-events-none">
        <button
          onClick={onStartSession}
          className="w-full bg-[#6B5AE0] hover:bg-[#5A48D0] pointer-events-auto text-white rounded-3xl py-4 px-4 flex items-center justify-between shadow-lg shadow-indigo-200 transition-transform active:scale-95"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Mic size={18} className="text-white" />
          </div>
          <span className="font-semibold text-base">Start Learning Session</span>
          <svg className="w-5 h-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 flex justify-around items-center py-3 px-4 shrink-0 absolute bottom-0 w-full">
        <button className="flex flex-col items-center gap-1 text-[#6B5AE0]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={onOpenProgress} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#6B5AE0]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button onClick={onOpenDictionary} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#6B5AE0]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          <span className="text-[10px] font-medium">Dictionary</span>
        </button>
        <button onClick={onOpenAccount} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#6B5AE0]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-medium">Account</span>
        </button>
      </div>

    </div>
  );
}