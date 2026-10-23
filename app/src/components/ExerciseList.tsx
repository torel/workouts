import { exercises } from '../data/exercises';
import type { ExerciseCategory } from '../types';

interface Props {
  category: ExerciseCategory;
}

const categoryNames = {
  strength: 'Strength',
  yoga: 'Yoga & Stretches',
  meditation: 'Meditation',
};

const ExerciseList = ({ category }: Props) => {
  const filtered = exercises.filter((ex) => ex.category === category);

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
        <div className="exercise-list">
          {filtered.map((exercise) => (
            <a
              key={exercise.id}
              href={`#/exercise/${exercise.id}`}
              className="exercise-card"
            >
              <img
                src={exercise.image}
                alt={exercise.name}
                className="exercise-card-image"
              />
              <div className="exercise-card-content">
                <h3>{exercise.name}</h3>
                <div className="exercise-card-meta">
                  {exercise.reps || exercise.hold}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExerciseList;
