import React, { useState } from 'react';
import GetStarted   from './components/GetStarted';
import Login        from './components/Login';
import Home         from './components/Home';
import TopicPicker  from './components/TopicPicker';
import WordPicker   from './components/WordPicker';
import LearningSession from './components/LearningSession';
import Settings     from './components/Settings';
import Progress     from './components/Progress';
import Dictionary   from './components/Dictionary';

const API      = '[https://sparkfest-entry-1.onrender.com](https://sparkfest-entry-1.onrender.com)/api/v1';
const CHILD_ID = 1;

export default function App() {
  const [currentScreen,      setCurrentScreen]      = useState('getStarted');
  const [sessionId,          setSessionId]          = useState(null);
  const [practiceExerciseId, setPracticeExerciseId] = useState(null);
  const [selectedCategory,   setSelectedCategory]   = useState(null);
  // where LearningSession returns after summary: 'wordPicker' | 'home'
  const [sessionOrigin,      setSessionOrigin]      = useState('wordPicker');

  // Called from Dictionary "Practice Now" button
  const handlePracticeWord = async (exerciseId) => {
    try {
      const res = await fetch(`${API}/sessions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ childId: CHILD_ID, exerciseIds: [exerciseId] }),
      });
      if (!res.ok) throw new Error();
      const session = await res.json();
      localStorage.setItem('lastSessionId', String(session.id));
      setPracticeExerciseId(exerciseId);
      setSessionOrigin('home');       // Practice Now returns to Home, not the picker
      setSessionId(session.id);
      setCurrentScreen('learning');
    } catch {
      setCurrentScreen('home');
    }
  };

  const afterSession = () =>
    setCurrentScreen(sessionOrigin === 'wordPicker' ? 'wordPicker' : 'home');

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl relative overflow-hidden border-[8px] border-gray-900">

        {currentScreen === 'getStarted' && (
          <GetStarted onNext={() => setCurrentScreen('login')} />
        )}
        {currentScreen === 'login' && (
          <Login onLogin={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'home' && (
          <Home
            onStartSession={() => setCurrentScreen('topicPicker')}
            onOpenProgress={() => setCurrentScreen('progress')}
            onOpenDictionary={() => setCurrentScreen('dictionary')}
            onOpenAccount={() => setCurrentScreen('settings')}
          />
        )}
        {currentScreen === 'topicPicker' && (
          <TopicPicker
            onBack={() => setCurrentScreen('home')}
            onPickCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentScreen('wordPicker');
            }}
          />
        )}
        {currentScreen === 'wordPicker' && (
          <WordPicker
            category={selectedCategory}
            onBack={() => setCurrentScreen('topicPicker')}
            onStartSession={(id) => {
              setSessionOrigin('wordPicker');
              setSessionId(id);
              setCurrentScreen('learning');
            }}
          />
        )}
        {currentScreen === 'progress' && (
          <Progress onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'learning' && (
          <LearningSession
            sessionId={sessionId}
            onComplete={afterSession}
            onBack={afterSession}
          />
        )}
        {currentScreen === 'dictionary' && (
          <Dictionary
            onBack={() => setCurrentScreen('home')}
            onPractice={handlePracticeWord}
          />
        )}
        {currentScreen === 'settings' && (
          <Settings onBack={() => setCurrentScreen('home')} />
        )}

      </div>
    </div>
  );
}