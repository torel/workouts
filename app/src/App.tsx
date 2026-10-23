import { useEffect, useState } from 'react';
import Home from './components/Home';
import ExerciseList from './components/ExerciseList';
import ExerciseDetail from './components/ExerciseDetail';
import SessionList from './components/SessionList';
import SessionPlayer from './components/SessionPlayer';
import History from './components/History';
import { initDB } from './lib/db';
import { initAudio, loadMutedState } from './utils/audio';
import './App.css';

function App() {
  const [route, setRoute] = useState('');

  useEffect(() => {
    // Initialize database
    initDB().catch(console.error);
    
    // Initialize audio
    initAudio();
    loadMutedState();

    // Handle hash routing
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse route
  const renderRoute = () => {
    const path = route.split('?')[0];
    const searchParams = new URLSearchParams(route.split('?')[1]);

    if (path === '/' || path === '') {
      return <Home />;
    }

    if (path === '/strength') {
      return <ExerciseList category="strength" />;
    }

    if (path === '/yoga') {
      return <ExerciseList category="yoga" />;
    }

    if (path === '/meditation') {
      return <ExerciseList category="meditation" />;
    }

    if (path.startsWith('/exercise/')) {
      const exerciseId = path.split('/exercise/')[1];
      return <ExerciseDetail exerciseId={exerciseId} />;
    }

    if (path === '/sessions/strength') {
      return <SessionList category="strength" />;
    }

    if (path === '/sessions/yoga') {
      return <SessionList category="yoga" />;
    }

    if (path === '/sessions/meditation') {
      return <SessionList category="meditation" />;
    }

    if (path.startsWith('/session/')) {
      const sessionId = path.split('/session/')[1];
      return <SessionPlayer sessionId={sessionId} searchParams={searchParams} />;
    }

    if (path === '/history') {
      return <History />;
    }

    return <div className="container"><h2>404 - Page not found</h2></div>;
  };

  return <div className="app">{renderRoute()}</div>;
}

export default App;
