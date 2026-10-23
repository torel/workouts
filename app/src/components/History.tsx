import { useEffect, useState } from 'react';
import type { CompletedSession } from '../types';
import {
  getRecentSessions,
  exportData,
  importData,
  clearAllData,
} from '../lib/db';

const History = () => {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const recent = await getRecentSessions();
      setSessions(recent);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
    setLoading(false);
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await importData(text);
        await loadSessions();
        alert('Data imported successfully');
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data');
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        'Are you sure you want to delete all workout history? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await clearAllData();
      await loadSessions();
      alert('All data cleared');
    } catch (error) {
      console.error('Clear failed:', error);
      alert('Failed to clear data');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <div className="header">
        <div className="header-content">
          <a href="#/" className="back-button">
            ←
          </a>
          <h1>History</h1>
        </div>
      </div>
      <div className="container">
        <div className="button-group mb-2">
          <button className="button button-secondary" onClick={handleExport}>
            💾 Export
          </button>
          <button className="button button-secondary" onClick={handleImport}>
            📥 Import
          </button>
          <button className="button button-danger" onClick={handleClearAll}>
            🗑 Clear All
          </button>
        </div>

        {loading && <div className="loading">Loading...</div>}

        {!loading && sessions.length === 0 && (
          <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
            <p>No workout history yet.</p>
            <p style={{ marginTop: '1rem' }}>
              Complete a session to see it here!
            </p>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="history-list">
            {sessions.map((session) => (
              <div key={session.id} className="history-card">
                <div className="history-card-header">
                  <h3>{session.sessionName}</h3>
                  <div className="history-card-date">
                    {formatDate(session.timestamp)}
                  </div>
                </div>
                <div className="history-card-meta">
                  ⏱ {formatDuration(session.duration)} • {session.sets.length}{' '}
                  sets logged
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
