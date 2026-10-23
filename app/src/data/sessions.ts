import type { Session } from '../types';

export const sessions: Session[] = [
  // Strength sessions
  {
    id: 'strength-circuit',
    name: '10-Minute Strength Circuit',
    category: 'strength',
    description: '3 rounds of compound movements for a quick full-body workout',
    duration: '10 min',
    exercises: [
      { exerciseId: 'goblet-squat', reps: 12, restAfter: 30 },
      { exerciseId: 'one-arm-dumbbell-row', reps: 12, restAfter: 30 },
      { exerciseId: 'romanian-deadlift', reps: 12, restAfter: 30 },
      { exerciseId: 'decline-push-up', reps: 12, restAfter: 60 },
    ],
    // Note: rounds handled by session player
  },
  {
    id: 'core-planks',
    name: 'Core Planks 3 Rounds',
    category: 'strength',
    description: 'Build core stability with plank variations',
    duration: '8 min',
    exercises: [
      { exerciseId: 'plank', duration: 45, restAfter: 15 },
      { exerciseId: 'side-plank', duration: 30, restAfter: 15 }, // Each side
      { exerciseId: 'side-plank', duration: 30, restAfter: 60 }, // Other side
    ],
  },
  {
    id: 'upper-body-push',
    name: 'Upper Body Push',
    category: 'strength',
    description: 'Push-up variations for chest, shoulders and triceps',
    duration: '8 min',
    exercises: [
      { exerciseId: 'decline-push-up', reps: 12, restAfter: 30 },
      { exerciseId: 'diamond-push-up', reps: 10, restAfter: 30 },
      { exerciseId: 'slow-negative-push-up', reps: 8, restAfter: 60 },
    ],
  },
  {
    id: 'pull-upper-body',
    name: 'Pull & Upper Body',
    category: 'strength',
    description: 'Back and pull strength workout',
    duration: '10 min',
    exercises: [
      { exerciseId: 'pull-up', reps: 6, restAfter: 45 },
      { exerciseId: 'one-arm-dumbbell-row', reps: 12, restAfter: 30 },
      { exerciseId: 'romanian-deadlift', reps: 12, restAfter: 60 },
    ],
  },
  
  // Yoga and stretch sessions
  {
    id: 'desk-posture-stretch',
    name: 'Desk Posture Stretch Sequence',
    category: 'yoga',
    description: 'Release tension from sitting at your desk all day',
    duration: '10 min',
    exercises: [
      { exerciseId: 'hip-flexor-lunge-stretch', duration: 45, restAfter: 5 }, // Left
      { exerciseId: 'hip-flexor-lunge-stretch', duration: 45, restAfter: 5 }, // Right
      { exerciseId: 'downward-dog-to-cobra', duration: 60, restAfter: 5 },
      { exerciseId: 'thread-the-needle', duration: 30, restAfter: 5 }, // Left
      { exerciseId: 'thread-the-needle', duration: 30, restAfter: 5 }, // Right
      { exerciseId: 'doorway-chest-stretch', duration: 45, restAfter: 5 }, // Left
      { exerciseId: 'doorway-chest-stretch', duration: 45, restAfter: 5 }, // Right
      { exerciseId: 'standing-forward-fold', duration: 45, restAfter: 5 },
      { exerciseId: 'neck-stretch-chin-tuck', duration: 30, restAfter: 5 }, // Left
      { exerciseId: 'neck-stretch-chin-tuck', duration: 30, restAfter: 0 }, // Right
    ],
  },
  {
    id: 'quick-stretch',
    name: 'Quick Full Body Stretch',
    category: 'yoga',
    description: 'Fast stretch sequence to reset between tasks',
    duration: '5 min',
    exercises: [
      { exerciseId: 'standing-forward-fold', duration: 45, restAfter: 5 },
      { exerciseId: 'doorway-chest-stretch', duration: 30, restAfter: 5 }, // Left
      { exerciseId: 'doorway-chest-stretch', duration: 30, restAfter: 5 }, // Right
      { exerciseId: 'neck-stretch-chin-tuck', duration: 30, restAfter: 5 }, // Left
      { exerciseId: 'neck-stretch-chin-tuck', duration: 30, restAfter: 0 }, // Right
    ],
  },
  
  // Meditation sessions
  {
    id: 'box-breathing-5min',
    name: 'Box Breathing 5 Minutes',
    category: 'meditation',
    description: 'Calm your nervous system with rhythmic breathing',
    duration: '5 min',
    exercises: [
      { exerciseId: 'box-breathing', duration: 300, restAfter: 0 },
    ],
  },
  {
    id: 'body-scan-meditation',
    name: 'Body Scan Meditation',
    category: 'meditation',
    description: 'Progressive relaxation from head to toe',
    duration: '10 min',
    exercises: [
      { exerciseId: 'body-scan', duration: 600, restAfter: 0 },
    ],
  },
  {
    id: 'counting-breaths-5min',
    name: 'Counting Breaths 5 Minutes',
    category: 'meditation',
    description: 'Simple mindfulness practice for focus',
    duration: '5 min',
    exercises: [
      { exerciseId: 'counting-breaths', duration: 300, restAfter: 0 },
    ],
  },
  {
    id: 'counting-breaths-10min',
    name: 'Counting Breaths 10 Minutes',
    category: 'meditation',
    description: 'Extended mindfulness practice',
    duration: '10 min',
    exercises: [
      { exerciseId: 'counting-breaths', duration: 600, restAfter: 0 },
    ],
  },
  {
    id: 'noting-meditation',
    name: 'Noting Meditation',
    category: 'meditation',
    description: 'Observe and label your thoughts without judgment',
    duration: '10 min',
    exercises: [
      { exerciseId: 'noting', duration: 600, restAfter: 0 },
    ],
  },
];

export const getSessionById = (id: string): Session | undefined => {
  return sessions.find(s => s.id === id);
};

export const getSessionsByCategory = (category: Session['category']): Session[] => {
  return sessions.filter(s => s.category === category);
};

// Parse custom session from URL parameters
export const parseCustomSession = (exerciseIds: string[], rounds?: number): Session | null => {
  if (!exerciseIds.length) return null;
  
  return {
    id: 'custom',
    name: 'Custom Workout',
    category: 'strength',
    description: `${exerciseIds.length} exercises${rounds ? ` × ${rounds} rounds` : ''}`,
    duration: 'Custom',
    exercises: exerciseIds.map(id => ({
      exerciseId: id,
      reps: 12,
      restAfter: 30,
    })),
  };
};
