export type ExerciseCategory = 'strength' | 'yoga' | 'meditation';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  image: string;
  howTo: string;
  formCues?: string[];
  reps?: string;
  hold?: string;
  rounds?: number;
}

export interface SessionExercise {
  exerciseId: string;
  rounds?: number;
  duration?: number; // seconds for timed exercises
  reps?: number;
  restAfter?: number; // seconds
}

export interface Session {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  duration: string;
  exercises: SessionExercise[];
}

export interface CompletedSet {
  exerciseId: string;
  reps?: number;
  weight?: number;
  timestamp: number;
}

export interface CompletedSession {
  id: string;
  sessionId: string;
  sessionName: string;
  timestamp: number;
  duration: number; // actual duration in seconds
  sets: CompletedSet[];
}

export interface ExerciseHistory {
  exerciseId: string;
  sets: CompletedSet[];
}
