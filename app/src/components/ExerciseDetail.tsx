import { getExerciseById } from '../data/exercises';

interface Props {
  exerciseId: string;
}

const ExerciseDetail = ({ exerciseId }: Props) => {
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return (
      <div className="container">
        <h2>Exercise not found</h2>
        <a href="#/" className="button">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <div className="header-content">
          <button
            onClick={() => window.history.back()}
            className="back-button"
          >
            ←
          </button>
          <h1>{exercise.name}</h1>
        </div>
      </div>
      <div className="container">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="exercise-detail-image"
        />

        {(exercise.reps || exercise.hold) && (
          <div className="exercise-detail-section">
            <h2>Target</h2>
            <p>{exercise.reps || exercise.hold}</p>
          </div>
        )}

        <div className="exercise-detail-section">
          <h2>How to</h2>
          <p>{exercise.howTo}</p>
        </div>

        {exercise.formCues && exercise.formCues.length > 0 && (
          <div className="exercise-detail-section">
            <h2>Form Cues</h2>
            {exercise.formCues.map((cue, i) => (
              <p key={i}>• {cue}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExerciseDetail;
