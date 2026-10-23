import { useEffect, useState, useRef } from 'react';
import { getSessionById, parseCustomSession } from '../data/sessions';
import { getExerciseById } from '../data/exercises';
import type { Session, CompletedSet, CompletedSession } from '../types';
import { saveCompletedSession, saveSet } from '../lib/db';
import {
  playBeep,
  playCountdownBeep,
  playFinishChime,
  setMuted,
  isMutedState,
} from '../utils/audio';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';

interface Props {
  sessionId: string;
  searchParams: URLSearchParams;
}

type PlayerState = 'idle' | 'get-ready' | 'exercise' | 'rest' | 'complete';

const SessionPlayer = ({ sessionId, searchParams }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<PlayerState>('idle');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const [muted, setMutedState] = useState(isMutedState());
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const totalRounds = parseInt(searchParams.get('rounds') || '3');

  // Load session
  useEffect(() => {
    const loadSession = () => {
      if (sessionId === 'custom') {
        const exerciseIds = searchParams.get('ex')?.split(',') || [];
        const rounds = parseInt(searchParams.get('rounds') || '3');
        const custom = parseCustomSession(exerciseIds, rounds);
        setSession(custom);
      } else {
        const loaded = getSessionById(sessionId);
        setSession(loaded || null);
      }
    };

    loadSession();
  }, [sessionId, searchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      releaseWakeLock();
    };
  }, []);

  const toggleMute = () => {
    const newMuted = !muted;
    setMutedState(newMuted);
    setMuted(newMuted);
  };

  const updateTimer = (_timestamp?: number) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, Math.ceil(timeRemaining - elapsed));
    
    if (remaining !== Math.ceil(timeRemaining - (elapsed - 0.001))) {
      // Second changed
      if (remaining <= 3 && remaining > 0) {
        playCountdownBeep();
      }
    }

    if (elapsed >= timeRemaining) {
      handleTimerComplete();
    } else if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const startTimer = (duration: number) => {
    setTimeRemaining(duration);
    startTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handleTimerComplete = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    playBeep();

    if (state === 'get-ready') {
      // Start exercise
      const exercise = session!.exercises[currentExerciseIndex];
      const duration = exercise.duration || 0;
      
      if (duration > 0) {
        setState('exercise');
        startTimer(duration);
      } else {
        // Rep-based exercise
        setState('exercise');
        setTimeRemaining(0);
      }
    } else if (state === 'exercise') {
      // Check if there's rest after
      const exercise = session!.exercises[currentExerciseIndex];
      if (exercise.restAfter && exercise.restAfter > 0) {
        setState('rest');
        startTimer(exercise.restAfter);
      } else {
        handleNextExercise();
      }
    } else if (state === 'rest') {
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex >= session!.exercises.length) {
      // Round complete
      if (currentRound >= totalRounds) {
        // Session complete
        handleSessionComplete();
      } else {
        // Next round
        setCurrentRound(currentRound + 1);
        setCurrentExerciseIndex(0);
        setState('get-ready');
        startTimer(5);
      }
    } else {
      // Next exercise
      setCurrentExerciseIndex(nextIndex);
      setState('get-ready');
      startTimer(5);
    }
  };

  const handleSessionComplete = async () => {
    setState('complete');
    setTimeRemaining(0);
    playFinishChime();
    releaseWakeLock();

    // Save session
    if (sessionStartTime) {
      const completedSession: CompletedSession = {
        id: `${session!.id}-${sessionStartTime}`,
        sessionId: session!.id,
        sessionName: session!.name,
        timestamp: sessionStartTime,
        duration: Math.floor((Date.now() - sessionStartTime) / 1000),
        sets: completedSets,
      };

      try {
        await saveCompletedSession(completedSession);
      } catch (error) {
        console.error('Failed to save session:', error);
      }
    }
  };

  const handleStart = async () => {
    if (state === 'idle') {
      setSessionStartTime(Date.now());
      await requestWakeLock();
      setState('get-ready');
      setCurrentExerciseIndex(0);
      setCurrentRound(1);
      startTimer(5);
    }
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = timeRemaining - elapsed;
      startTimeRef.current = Date.now();
      setTimeRemaining(remaining);
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      // Pause
      setIsPaused(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTimeRemaining(Math.max(0, timeRemaining - elapsed));
    }
  };

  const handleReset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState('idle');
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setTimeRemaining(0);
    setIsPaused(false);
    setCompletedSets([]);
    setSessionStartTime(null);
    releaseWakeLock();
  };

  const handleSkip = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    handleNextExercise();
  };

  const handleDoneSet = async (reps?: number, weight?: number) => {
    const exercise = session!.exercises[currentExerciseIndex];
    const set: CompletedSet = {
      exerciseId: exercise.exerciseId,
      reps,
      weight,
      timestamp: Date.now(),
    };

    setCompletedSets([...completedSets, set]);

    try {
      await saveSet(set);
    } catch (error) {
      console.error('Failed to save set:', error);
    }

    // Move to rest or next exercise
    if (exercise.restAfter && exercise.restAfter > 0) {
      setState('rest');
      startTimer(exercise.restAfter);
    } else {
      handleNextExercise();
    }
  };

  if (!session) {
    return (
      <div className="container">
        <h2>Session not found</h2>
        <a href="#/" className="button">
          Back to home
        </a>
      </div>
    );
  }

  const currentSessionExercise = session.exercises[currentExerciseIndex];
  const currentExercise = currentSessionExercise
    ? getExerciseById(currentSessionExercise.exerciseId)
    : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isBoxBreathing = currentExercise?.id === 'box-breathing';

  return (
    <>
      <div className="header">
        <div className="header-content">
          <a href="#/" className="back-button" onClick={() => handleReset()}>
            ←
          </a>
          <h1>{session.name}</h1>
          <button className="back-button" onClick={toggleMute}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
      <div className="container session-player">
        {state === 'idle' && (
          <>
            <div className="player-status">
              <h2>{session.name}</h2>
              <p>{session.description}</p>
              <p style={{ marginTop: '1rem' }}>
                {session.exercises.length} exercises • {totalRounds} rounds
              </p>
            </div>
            <button className="button button-large" onClick={handleStart}>
              ▶️ Start Session
            </button>
          </>
        )}

        {state === 'get-ready' && (
          <>
            <div className="player-status">
              <h2>Get Ready</h2>
              <p>
                Round {currentRound} of {totalRounds}
              </p>
            </div>
            <div className="player-timer">{formatTime(Math.ceil(timeRemaining - (Date.now() - startTimeRef.current) / 1000))}</div>
            {currentExercise && (
              <div className="player-current">
                <h2>{currentExercise.name}</h2>
                <p className="player-current-meta">
                  {currentSessionExercise.reps
                    ? `${currentSessionExercise.reps} reps`
                    : currentSessionExercise.duration
                    ? `${currentSessionExercise.duration}s hold`
                    : currentExercise.reps || currentExercise.hold}
                </p>
              </div>
            )}
          </>
        )}

        {state === 'exercise' && currentExercise && (
          <>
            <div className="player-current">
              <h2>{currentExercise.name}</h2>
              <p className="player-current-meta">
                Round {currentRound} of {totalRounds} • Exercise{' '}
                {currentExerciseIndex + 1} of {session.exercises.length}
              </p>
            </div>

            {currentSessionExercise.duration ? (
              <>
                {!isBoxBreathing && (
                  <img
                    src={currentExercise.image}
                    alt={currentExercise.name}
                    className="player-image"
                  />
                )}
                {isBoxBreathing && (
                  <BoxBreathingVisual
                    timeRemaining={Math.ceil(timeRemaining - (Date.now() - startTimeRef.current) / 1000)}
                  />
                )}
                <div className={`player-timer ${Math.ceil(timeRemaining - (Date.now() - startTimeRef.current) / 1000) <= 3 ? 'warning' : ''}`}>
                  {formatTime(Math.ceil(timeRemaining - (Date.now() - startTimeRef.current) / 1000))}
                </div>
              </>
            ) : (
              <>
                <img
                  src={currentExercise.image}
                  alt={currentExercise.name}
                  className="player-image"
                />
                <div className="player-instructions">
                  <p><strong>Target:</strong> {currentSessionExercise.reps || currentExercise.reps} reps</p>
                  <p>{currentExercise.howTo}</p>
                </div>
                <button
                  className="button button-success button-large"
                  onClick={() => handleDoneSet(currentSessionExercise.reps)}
                >
                  ✓ Done Set
                </button>
              </>
            )}

            <div className="player-instructions">
              <p>{currentExercise.howTo}</p>
            </div>

            <div className="player-controls">
              <button className="button button-secondary" onClick={handlePause}>
                {isPaused ? '▶️ Resume' : '⏸ Pause'}
              </button>
              <button className="button button-secondary" onClick={handleSkip}>
                ⏭ Skip
              </button>
            </div>
          </>
        )}

        {state === 'rest' && (
          <>
            <div className="player-status">
              <h2>Rest</h2>
              <p>
                Round {currentRound} of {totalRounds}
              </p>
            </div>
            <div className="player-timer">{formatTime(Math.ceil(timeRemaining - (Date.now() - startTimeRef.current) / 1000))}</div>
            <div className="player-controls">
              <button className="button button-secondary" onClick={handleSkip}>
                ⏭ Skip Rest
              </button>
            </div>
          </>
        )}

        {state === 'complete' && (
          <>
            <div className="player-status">
              <h2>🎉 Session Complete!</h2>
              <p>Great work, Tor Einar!</p>
            </div>
            <div className="button-group">
              <button className="button button-large" onClick={handleReset}>
                🔄 Do Again
              </button>
              <a href="#/history" className="button button-secondary button-large">
                📊 View History
              </a>
              <a href="#/" className="button button-secondary button-large">
                🏠 Home
              </a>
            </div>
          </>
        )}

        {state !== 'idle' && state !== 'complete' && (
          <button
            className="button button-danger button-large mt-2"
            onClick={handleReset}
          >
            🛑 End Session
          </button>
        )}
      </div>
    </>
  );
};

const BoxBreathingVisual = ({ timeRemaining }: { timeRemaining: number }) => {
  const phase = Math.floor((300 - timeRemaining) % 16 / 4);
  const instructions = [
    'Breathe in (4s)',
    'Hold (4s)',
    'Breathe out (4s)',
    'Hold (4s)',
  ];

  return (
    <div className="box-breathing">
      <div className="breathing-box"></div>
      <div className="breathing-instruction">{instructions[phase]}</div>
    </div>
  );
};

export default SessionPlayer;
