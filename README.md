# Workday Workouts

A mobile-first web app for quick exercise breaks during your workday. Built with React, TypeScript, and Vite. Deployed as a Progressive Web App (PWA) on GitHub Pages.

## Features

- **Three Exercise Categories**: Strength, Yoga & Stretches, Meditation
- **20 Exercises**: Illustrated with 16:9 images, complete with instructions and form cues
- **Guided Sessions**: Predefined workout sequences with built-in timers
- **Session Player**: Step-through exercises with audio cues, countdown timers, and screen wake lock
- **Custom Workouts**: Create ad-hoc sessions via URL deep links
- **Progress Tracking**: Log completed sessions and sets in browser storage (IndexedDB)
- **History & Export**: View workout history and export/import data as JSON
- **PWA Support**: Install on mobile home screen, works offline
- **Dark Mode**: Automatic light/dark theme based on system preference

## Live App

Visit: [https://torel.github.io/workouts/](https://torel.github.io/workouts/)

## Deep Link URL Formats

All routes use hash-based routing for GitHub Pages compatibility:

### Category Pages
- `#/strength` - List all strength exercises
- `#/yoga` - List all yoga and stretch exercises
- `#/meditation` - List all meditation practices

### Exercise Detail
- `#/exercise/{exercise-id}` - View single exercise detail
  - Example: `#/exercise/romanian-deadlift`

### Session Pages
- `#/sessions/strength` - List strength sessions
- `#/sessions/yoga` - List stretch sessions
- `#/sessions/meditation` - List meditation sessions

### Session Player
- `#/session/{session-id}` - Start a predefined session
  - Example: `#/session/desk-posture-stretch`

### Custom Sessions
- `#/session/custom?ex={exercise-ids}&rounds={number}` - Create a custom workout
  - Example: `#/session/custom?ex=goblet-squat,one-arm-dumbbell-row,plank&rounds=3`
  - Exercise IDs are comma-separated
  - Rounds parameter is optional (default: 3)

### History
- `#/history` - View completed workouts and export/import data

## Local Development

### Prerequisites
- Node.js 20+ and npm

### Setup
```bash
cd app
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

The production build will be in `app/dist/`

### Preview Production Build
```bash
npm run preview
```

## Adding Exercises

Exercises are stored as structured data in `app/src/data/exercises.ts`. To add a new exercise:

1. **Add the exercise image** to `app/public/assets/` (16:9 aspect ratio, JPG format recommended)

2. **Add exercise data** to the `exercises` array in `app/src/data/exercises.ts`:

```typescript
{
  id: 'exercise-slug',           // URL-friendly ID
  name: 'Exercise Name',          // Display name
  category: 'strength',           // 'strength', 'yoga', or 'meditation'
  image: '/assets/image.jpg',     // Path to image
  howTo: 'Detailed instructions...',
  reps: '10-12 reps',            // For rep-based exercises
  hold: '30-45 s',               // For timed holds (optional)
  formCues: ['cue 1', 'cue 2'],  // Optional form tips
}
```

3. **Add to sessions** (optional): Include in predefined sessions in `app/src/data/sessions.ts`

## Adding Sessions

Sessions are predefined workout sequences stored in `app/src/data/sessions.ts`. To add a new session:

```typescript
{
  id: 'session-slug',
  name: 'Session Name',
  category: 'strength',
  description: 'Brief description',
  duration: '10 min',
  exercises: [
    {
      exerciseId: 'exercise-slug',
      reps: 12,              // For rep-based
      duration: 45,          // For timed (seconds)
      restAfter: 30,         // Rest in seconds
    },
    // ... more exercises
  ],
}
```

## Deployment

The app automatically deploys to GitHub Pages when code is pushed to the `main` branch.

### Manual Setup Required

After pushing code for the first time, enable GitHub Pages in the repository settings:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will deploy automatically on the next push

### Base Path Configuration

The app is configured for the `/workouts/` base path (see `vite.config.ts`). If you fork this repo to a different URL, update:
- `base` in `vite.config.ts`
- `start_url` in the PWA manifest (also in `vite.config.ts`)

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **IndexedDB** (via `idb`) for local data storage
- **Vite PWA Plugin** for service worker and offline support
- **Web Audio API** for exercise timer beeps
- **Screen Wake Lock API** to keep screen on during sessions
- **CSS Variables** for theming with automatic dark mode

## Project Structure

```
app/
├── public/
│   ├── assets/          # Exercise images
│   └── icon-*.png       # PWA icons
├── src/
│   ├── components/      # React components
│   ├── data/           # Exercise and session data
│   ├── lib/            # IndexedDB wrapper
│   ├── types/          # TypeScript types
│   ├── utils/          # Audio and wake lock utilities
│   ├── App.tsx         # Main app with routing
│   └── main.tsx        # Entry point
├── index.html
├── vite.config.ts
└── package.json
```

## Browser Support

- Modern browsers with ES6+ support
- Service Worker support for offline functionality
- Optional: Wake Lock API (Chrome, Edge, Safari 16.4+)
- Optional: Web Audio API for timer sounds

## License

MIT

## Author

Built for Tor Einar's workday health breaks.
