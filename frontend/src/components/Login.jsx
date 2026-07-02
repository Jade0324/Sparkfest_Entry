import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) { setError('Please enter a username.'); return; }
    setLoading(true);
    setError('');

    // Try backend but never block navigation — demo mode always proceeds
    try {
      await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: username.trim(), password }).toString(),
      });
    } catch {
      // Backend not running — that's fine for demo
    }

    setLoading(false);
    onLogin(); // Always navigate regardless of backend response
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] overflow-hidden">

      {/* Top wave header */}
      <div className="bg-[#1A2C5B] px-6 pt-12 pb-16 relative shrink-0">
        <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden">
          <svg viewBox="0 0 390 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q97.5 0 195 20 Q292.5 40 390 10 L390 40 Z" fill="#F8F9FC" />
          </svg>
        </div>
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">👦🏻</span>
          </div>
        </div>
        <h1 className="text-white text-2xl font-extrabold text-center">Welcome Back!</h1>
        <p className="text-indigo-200 text-sm text-center mt-1">Sign in to continue your journey</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">

          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Username / Nickname
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="e.g. juan123"
              className="w-full border-2 border-gray-100 focus:border-[#6B5AE0] rounded-2xl px-4 py-3 text-sm text-[#1A2C5B] font-medium outline-none transition-colors bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full border-2 border-gray-100 focus:border-[#6B5AE0] rounded-2xl px-4 py-3 text-sm text-[#1A2C5B] font-medium outline-none transition-colors bg-gray-50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-[#6B5AE0] text-white rounded-2xl font-extrabold text-base shadow-md shadow-indigo-200 active:scale-95 transition-transform disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In 👋'}
          </button>
        </div>

        {/* Demo note */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <p className="text-amber-700 text-xs text-center font-medium">
            🛠️ Demo mode — any username works. No account needed!
          </p>
        </div>

        {/* App branding */}
        <div className="flex items-center justify-center gap-1 mt-6">
          <p className="text-gray-400 text-xs">Powered by</p>
            <span className="text-xs font-extrabold text-[#1A2C5B]">LORO</span>
        </div>
      </div>
    </div>
  );
}