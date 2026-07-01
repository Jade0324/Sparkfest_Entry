import React, { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Award, Target } from 'lucide-react';

const API = 'http://localhost:8080/api/v1';
const CHILD_ID = 1;

export default function Progress({ onBack }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/children/${CHILD_ID}/dashboard`);
        if (res.ok) setDashboard(await res.json());
      } catch {
        // Show mock data if backend not available
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = dashboard ? [
    { icon: '📚', label: 'Total Sessions', value: dashboard.totalSessions },
    { icon: '✅', label: 'Completed', value: dashboard.completedSessions },
    { icon: '🎯', label: 'Attempts', value: dashboard.totalAttempts },
    { icon: '⭐', label: 'Passed', value: dashboard.passedAttempts },
    { icon: '📊', label: 'Accuracy', value: dashboard.overallAccuracy ? `${Math.round(dashboard.overallAccuracy)}%` : '—' },
    { icon: '🔥', label: 'Pass Rate', value: dashboard.passRate ? `${Math.round(dashboard.passRate)}%` : '—' },
    { icon: '📖', label: 'Words Practiced', value: dashboard.uniqueWordsPracticed },
    { icon: '🏆', label: 'Words Mastered', value: dashboard.uniqueWordsMastered },
  ] : [];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white shadow-sm shrink-0">
        <button onClick={onBack} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center active:scale-95">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-extrabold text-[#1A2C5B]">My Progress</h2>
        <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-xl">📈</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">

        {/* Hero card */}
        <div className="bg-[#1A2C5B] rounded-3xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#6B5AE0] rounded-full opacity-20" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👦🏻</span>
            <div>
              <h3 className="text-white font-extrabold text-base">Juan Dela Cruz</h3>
              <p className="text-indigo-200 text-xs">Speech Learner · Tier 2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#F8A03E]" />
            <p className="text-indigo-200 text-xs font-medium">Keep going! You're making great progress.</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-4xl animate-bounce">🤖</div>
          </div>
        )}

        {/* Stats grid */}
        {!loading && dashboard && (
          <>
            <h3 className="font-bold text-[#1A2C5B] mb-3 text-sm">Overall Statistics</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-extrabold text-[#1A2C5B] text-lg">{s.value}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent sessions */}
            {dashboard.recentSessions?.length > 0 && (
              <>
                <h3 className="font-bold text-[#1A2C5B] mb-3 text-sm">Recent Sessions</h3>
                <div className="space-y-2">
                  {dashboard.recentSessions.map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Target size={18} className="text-[#6B5AE0]" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1A2C5B]">Session #{s.id}</p>
                          <p className="text-[10px] text-gray-400">{s.status} · {s.exerciseCount} words</p>
                        </div>
                      </div>
                      {s.totalScore && (
                        <div className="bg-yellow-50 px-2 py-1 rounded-xl">
                          <p className="text-[#F8A03E] font-bold text-xs">{Math.round(s.totalScore)}%</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* No data yet */}
        {!loading && !dashboard && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-5xl">📭</span>
            <p className="text-gray-400 text-sm font-medium text-center">
              Complete your first learning session to see progress here!
            </p>
            <button onClick={onBack} className="px-6 py-3 bg-[#6B5AE0] text-white rounded-2xl font-bold text-sm active:scale-95 mt-2">
              Start a Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}