import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { CompletedSession, CompletedSet } from '../types';

interface WorkoutDB extends DBSchema {
  sessions: {
    key: string;
    value: CompletedSession;
    indexes: { 'by-date': number; 'by-session-id': string };
  };
  sets: {
    key: string;
    value: CompletedSet & { id: string };
    indexes: { 'by-exercise': string; 'by-date': number };
  };
}

let dbInstance: IDBPDatabase<WorkoutDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<WorkoutDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<WorkoutDB>('workout-tracker', 1, {
    upgrade(db) {
      // Sessions store
      const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionsStore.createIndex('by-date', 'timestamp');
      sessionsStore.createIndex('by-session-id', 'sessionId');

      // Sets store
      const setsStore = db.createObjectStore('sets', { keyPath: 'id' });
      setsStore.createIndex('by-exercise', 'exerciseId');
      setsStore.createIndex('by-date', 'timestamp');
    },
  });

  return dbInstance;
};

// Session operations
export const saveCompletedSession = async (session: CompletedSession): Promise<void> => {
  const db = await initDB();
  await db.put('sessions', session);
};

export const getRecentSessions = async (limit = 50): Promise<CompletedSession[]> => {
  const db = await initDB();
  const sessions = await db.getAllFromIndex('sessions', 'by-date');
  return sessions.reverse().slice(0, limit);
};

export const getSessionsBySessionId = async (sessionId: string): Promise<CompletedSession[]> => {
  const db = await initDB();
  return await db.getAllFromIndex('sessions', 'by-session-id', sessionId);
};

// Set operations
export const saveSet = async (set: CompletedSet): Promise<void> => {
  const db = await initDB();
  const id = `${set.exerciseId}-${set.timestamp}`;
  await db.put('sets', { ...set, id });
};

export const getSetsByExercise = async (exerciseId: string): Promise<CompletedSet[]> => {
  const db = await initDB();
  const sets = await db.getAllFromIndex('sets', 'by-exercise', exerciseId);
  return sets.map(({ id, ...set }) => set);
};

export const getRecentSets = async (limit = 100): Promise<CompletedSet[]> => {
  const db = await initDB();
  const sets = await db.getAllFromIndex('sets', 'by-date');
  return sets.reverse().slice(0, limit).map(({ id, ...set }) => set);
};

// Export/Import
export const exportData = async (): Promise<string> => {
  const db = await initDB();
  const sessions = await db.getAll('sessions');
  const sets = await db.getAll('sets');
  
  return JSON.stringify({
    version: 1,
    exportDate: new Date().toISOString(),
    sessions,
    sets: sets.map(({ id, ...set }) => set),
  }, null, 2);
};

export const importData = async (jsonData: string): Promise<void> => {
  const data = JSON.parse(jsonData);
  const db = await initDB();
  
  // Import sessions
  if (data.sessions && Array.isArray(data.sessions)) {
    for (const session of data.sessions) {
      await db.put('sessions', session);
    }
  }
  
  // Import sets
  if (data.sets && Array.isArray(data.sets)) {
    for (const set of data.sets) {
      const id = `${set.exerciseId}-${set.timestamp}`;
      await db.put('sets', { ...set, id });
    }
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  const db = await initDB();
  await db.clear('sessions');
  await db.clear('sets');
};
