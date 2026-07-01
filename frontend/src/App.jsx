import React, { useState } from 'react';
import GetStarted from './components/GetStarted';
import Login from './components/Login';
import Home from './components/Home';
import LearningSession from './components/LearningSession';
import Settings from './components/Settings';
import Progress from './components/Progress';
import Dictionary from './components/Dictionary';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');
  const [sessionId, setSessionId] = useState(null);
  const [practiceExerciseId, setPracticeExerciseId] = useState(null);

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
            onStartSession={(id) => { setSessionId(id); setCurrentScreen('learning'); }}
            onOpenProgress={() => setCurrentScreen('progress')}
            onOpenDictionary={() => setCurrentScreen('dictionary')}
            onOpenAccount={() => setCurrentScreen('settings')}
            onPracticeExercise={(exerciseId) => {
              setPracticeExerciseId(exerciseId);
              setCurrentScreen('home');
            }}
          />
        )}
        {currentScreen === 'progress' && (
          <Progress onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'learning' && (
          <LearningSession
            sessionId={sessionId}
            onComplete={() => setCurrentScreen('home')}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'dictionary' && (
          <Dictionary
            onBack={() => setCurrentScreen('home')}
            onPractice={(exerciseId, targetWord) => {
              // Start a targeted single-exercise session
              setPracticeExerciseId(exerciseId);
              setCurrentScreen('home'); // Home's handleStartSession will pick it up
              // For now, just go home — full targeted session wiring is next step
            }}
          />
        )}
        {currentScreen === 'settings' && (
          <Settings onBack={() => setCurrentScreen('home')} />
        )}

      </div>
    </div>
  );
}