import { sessions } from '../data/sessions';
import type { ExerciseCategory } from '../types';

interface Props {
  category: ExerciseCategory;
}

const categoryNames = {
  strength: 'Strength Sessions',
  yoga: 'Stretch Sessions',
  meditation: 'Meditation Sessions',
};

const SessionList = ({ category }: Props) => {
  const filtered = sessions.filter((s) => s.category === category);

  return (
    <>
      <div className="header">
        <div className="header-content">
          <a href="#/" className="back-button">
            ←
          </a>
          <h1>{categoryNames[category]}</h1>
        </div>
      </div>
      <div className="container">
        <div className="session-list">
          {filtered.map((session) => (
            <a
              key={session.id}
              href={`#/session/${session.id}`}
              className="session-card"
            >
              <h3>{session.name}</h3>
              <div className="session-card-meta">
                ⏱ {session.duration} • {session.exercises.length} exercises
              </div>
              <p>{session.description}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionList;
