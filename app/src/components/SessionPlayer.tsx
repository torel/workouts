import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const [muted, setMutedState] = useState(isMutedState());
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [, setTick] = useState(0);
  
  const timerEndTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const handleTimerCompleteRef = useRef<() => void>(() => {});
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

  const getTimeRemaining = () => {
    return Math.max(0, (timerEndTimeRef.current - Date.now()) / 1000);
  };

  const updateTimer = useCallback((_timestamp?: number) => {
    const now = Date.now();
    const remaining = Math.max(0, (timerEndTimeRef.current - now) / 1000);
    
    // Trigger re-render
    setTick(prev => prev + 1);
    
    const remainingCeil = Math.ceil(remaining);
    const prevRemainingCeil = Math.ceil(remaining + 0.1);
    
    if (remainingCeil !== prevRemainingCeil && remainingCeil <= 3 && remainingCeil > 0) {
      playCountdownBeep();
    }

    if (remaining <= 0) {
      handleTimerCompleteRef.current();
    } else if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isPaused]);

  const startTimer = (duration: number) => {
    const endTime = Date.now() + (duration * 1000);
    timerEndTimeRef.current = endTime;
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handleSessionComplete = useCallback(async () => {
    setState('complete');
    timerEndTimeRef.current = 0;
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
  }, [session, sessionStartTime, completedSets]);

  const handleNextExercise = useCallback(() => {
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
        const endTime = Date.now() + 5000;
        timerEndTimeRef.current = endTime;
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    } else {
      // Next exercise
      setCurrentExerciseIndex(nextIndex);
      setState('get-ready');
      const endTime = Date.now() + 5000;
      timerEndTimeRef.current = endTime;
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  }, [currentExerciseIndex, session, currentRound, totalRounds, handleSessionComplete]);

  const handleTimerComplete = useCallback(() => {
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
        const endTime = Date.now() + (duration * 1000);
        timerEndTimeRef.current = endTime;
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        // Rep-based exercise
        setState('exercise');
        timerEndTimeRef.current = 0;
      }
    } else if (state === 'exercise') {
      // Check if there's rest after
      const exercise = session!.exercises[currentExerciseIndex];
      if (exercise.restAfter && exercise.restAfter > 0) {
        setState('rest');
        const endTime = Date.now() + (exercise.restAfter * 1000);
        timerEndTimeRef.current = endTime;
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        handleNextExercise();
      }
    } else if (state === 'rest') {
      handleNextExercise();
    }
  }, [state, session, currentExerciseIndex, handleNextExercise]);

  // Keep the ref up to date
  useEffect(() => {
    handleTimerCompleteRef.current = handleTimerComplete;
  }, [handleTimerComplete]);

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
      // Resume - extend the end time by how long we were paused
      setIsPaused(false);
      const pauseDuration = Date.now() - pauseTimeRef.current;
      timerEndTimeRef.current = timerEndTimeRef.current + pauseDuration;
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      // Pause - record pause time
      setIsPaused(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      pauseTimeRef.current = Date.now();
    }
  };

  const handleReset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setState('idle');
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    timerEndTimeRef.current = 0;
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
            <div className="player-timer">{formatTime(Math.ceil(getTimeRemaining()))}</div>
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
                    timeRemaining={Math.ceil(getTimeRemaining())}
                  />
                )}
                <div className={`player-timer ${Math.ceil(getTimeRemaining()) <= 3 ? 'warning' : ''}`}>
                  {formatTime(Math.ceil(getTimeRemaining()))}
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
            <div className="player-timer">{formatTime(Math.ceil(getTimeRemaining()))}</div>
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
