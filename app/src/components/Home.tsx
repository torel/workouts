const Home = () => {
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>💪 Workday Workouts</h1>
        </div>
      </div>
      <div className="container">
        <p className="text-center mb-2" style={{ color: 'var(--text-secondary)' }}>
          Quick exercise breaks for your workday
        </p>

        <div className="nav-grid">
          <a href="#/strength" className="nav-card">
            <div className="nav-card-icon">💪</div>
            <h2>Strength</h2>
            <p>10 exercises</p>
          </a>

          <a href="#/yoga" className="nav-card">
            <div className="nav-card-icon">🧘</div>
            <h2>Yoga & Stretches</h2>
            <p>6 stretches</p>
          </a>

          <a href="#/meditation" className="nav-card">
            <div className="nav-card-icon">🧠</div>
            <h2>Meditation</h2>
            <p>4 practices</p>
          </a>
        </div>

        <div className="nav-grid">
          <a href="#/sessions/strength" className="nav-card">
            <div className="nav-card-icon">🏋️</div>
            <h2>Strength Sessions</h2>
            <p>Preset workouts</p>
          </a>

          <a href="#/sessions/yoga" className="nav-card">
            <div className="nav-card-icon">🌊</div>
            <h2>Stretch Sessions</h2>
            <p>Guided sequences</p>
          </a>

          <a href="#/sessions/meditation" className="nav-card">
            <div className="nav-card-icon">✨</div>
            <h2>Meditation Sessions</h2>
            <p>Timed practices</p>
          </a>
        </div>

        <div className="button-group">
          <a href="#/history" className="button button-secondary button-large">
            📊 View History
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
