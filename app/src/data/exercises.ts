import type { Exercise } from '../types';

const BASE_URL = import.meta.env.BASE_URL;

export const exercises: Exercise[] = [
  // Strength exercises
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'strength',
    image: `${BASE_URL}assets/romanian-deadlift_ba64.jpg`,
    howTo: 'Stand tall with a dumbbell in each hand, knees soft. Push your hips back and slide the weights down the front of your legs with a flat back until you feel your hamstrings stretch, then drive your hips forward to stand.',
    reps: '10–12 reps',
  },
  {
    id: 'decline-push-up',
    name: 'Decline Push-up',
    category: 'strength',
    image: `${BASE_URL}assets/decline-push-up_bfd7.jpg`,
    howTo: 'Put your feet on a bench or chair and your hands on the floor slightly wider than your shoulders. Lower your chest toward the floor with elbows about 45° from your body, keeping one straight line from head to heels, then press up.',
    reps: '10–15 reps',
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-up',
    category: 'strength',
    image: `${BASE_URL}assets/diamond-push-up_f0de.jpg`,
    howTo: 'Place your hands together under your chest with thumbs and index fingers forming a diamond. Lower with elbows tucked along your ribs until your chest nearly touches your hands, then press up with a tight core.',
    reps: '8–12 reps',
  },
  {
    id: 'slow-negative-push-up',
    name: 'Slow Negative Push-up',
    category: 'strength',
    image: `${BASE_URL}assets/slow-negative-push-up_552c.jpg`,
    howTo: 'Standard push-up with hands under your shoulders and a straight body. Take a full 3 seconds to lower until your chest is just above the floor, then push up at normal speed.',
    reps: '8–12 reps',
  },
  {
    id: 'goblet-squat',
    name: 'Dumbbell Goblet Squat',
    category: 'strength',
    image: `${BASE_URL}assets/goblet-squat_dcef.jpg`,
    howTo: 'Hold one dumbbell vertically against your chest, feet about shoulder-width, toes slightly out. Sit down between your heels until your thighs are about parallel, keeping your chest up, knees tracking over your toes and heels down, then stand.',
    reps: '10–12 reps',
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'strength',
    image: `${BASE_URL}assets/bulgarian-split-squat_5311.jpg`,
    howTo: 'Rest the top of your rear foot on a bench, a dumbbell in each hand. Lower straight down until your front thigh is about parallel and the back knee is near the floor, with your torso tall and front knee over the foot, then push up through the front heel.',
    reps: '10–12 reps per leg',
  },
  {
    id: 'one-arm-dumbbell-row',
    name: 'One-arm Dumbbell Row',
    category: 'strength',
    image: `${BASE_URL}assets/one-arm-dumbbell-row_38d3.jpg`,
    howTo: 'Put one knee and the same-side hand on a bench, back flat, free arm hanging with a dumbbell. Pull the dumbbell up toward your hip, elbow close to your body, pause, then lower under control.',
    reps: '10–12 reps per arm',
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'strength',
    image: `${BASE_URL}assets/plank_e693.jpg`,
    howTo: 'Forearms on the floor with elbows under shoulders, up on your toes. Hold one straight line from head to heels, bracing your core and squeezing your glutes so your hips neither sag nor pike.',
    hold: '30–45 s',
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'strength',
    image: `${BASE_URL}assets/side-plank_f773.jpg`,
    howTo: 'Lie on your side, forearm on the floor with the elbow under your shoulder, feet stacked. Lift your hips until your body is a straight line and hold without letting the hips drop.',
    hold: '30–45 s per side',
  },
  {
    id: 'pull-up',
    name: 'Pull-up',
    category: 'strength',
    image: `${BASE_URL}assets/pull-up_a002.jpg`,
    howTo: 'Hang from the bar with an overhand grip slightly wider than your shoulders, arms straight. Pull your elbows down toward your ribs until your chin is over the bar, then lower all the way to a full hang.',
    reps: '5–8 reps per round',
  },
  
  // Yoga and stretch exercises
  {
    id: 'hip-flexor-lunge-stretch',
    name: 'Kneeling Hip Flexor Lunge Stretch',
    category: 'yoga',
    image: `${BASE_URL}assets/hip-flexor-lunge-stretch_2cff.jpg`,
    howTo: 'Kneel on one knee with the other foot flat in front, knee at 90°. Tuck your pelvis, squeeze the glute of the kneeling leg and shift your hips gently forward until you feel the front of the hip stretch, torso tall.',
    hold: '45 s per side',
  },
  {
    id: 'downward-dog-to-cobra',
    name: 'Downward Dog to Cobra Flow',
    category: 'yoga',
    image: `${BASE_URL}assets/downward-dog-to-cobra_9e11.jpg`,
    howTo: 'From downward dog (hips high, long spine, heels reaching down), lower your hips to the mat and lift your chest into cobra with hands under your shoulders and shoulders down. Move slowly between the two with your breath.',
    reps: '5 slow rounds',
  },
  {
    id: 'thread-the-needle',
    name: 'Thread the Needle',
    category: 'yoga',
    image: `${BASE_URL}assets/thread-the-needle_2e07.jpg`,
    howTo: 'On all fours, reach one arm up to the ceiling and rotate your chest open. Then sweep that arm under your other arm, palm up, until your shoulder and the side of your head rest on the mat, hips staying over your knees.',
    reps: '8 reps per side, pause 2–3 s at each end',
  },
  {
    id: 'doorway-chest-stretch',
    name: 'Doorway Chest Stretch',
    category: 'yoga',
    image: `${BASE_URL}assets/doorway-chest-stretch_d808.jpg`,
    howTo: 'Place your forearm or palm on a door frame with the elbow at shoulder height. Step forward through the doorway until you feel a stretch across the chest, standing tall with your shoulder down.',
    hold: '45 s per side',
  },
  {
    id: 'standing-forward-fold',
    name: 'Standing Forward Fold with Bent Knees',
    category: 'yoga',
    image: `${BASE_URL}assets/standing-forward-fold_40fb.jpg`,
    howTo: 'Stand with feet hip-width, bend your knees generously and fold forward so your belly rests on your thighs. Let your head and arms hang heavy and your back relax; roll up slowly.',
    hold: '45 s',
  },
  {
    id: 'neck-stretch-chin-tuck',
    name: 'Neck Side Stretch and Chin Tuck',
    category: 'yoga',
    image: `${BASE_URL}assets/neck-stretch-chin-tuck_3549.jpg`,
    howTo: 'Sitting tall, tilt your ear toward your shoulder, keep the opposite shoulder down and rest your hand lightly on your head. For the chin tuck, glide your head straight back to make a double chin, ears over shoulders.',
    hold: '30 s per side; chin tucks 10 reps with a 2 s hold',
  },
  
  // Meditation exercises
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'meditation',
    image: `${BASE_URL}assets/box-breathing_fcb2.jpg`,
    howTo: 'Sit tall and breathe in through your nose for 4, hold for 4, breathe out for 4, hold for 4, tracing the square in your mind. Keep the breath soft rather than forced.',
    hold: '5–10 rounds (about 5 min)',
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    category: 'meditation',
    image: `${BASE_URL}assets/body-scan_bf7e.jpg`,
    howTo: 'Lie down or sit comfortably and close your eyes. Move your attention slowly from your head through shoulders, belly and legs to your feet, noticing each area and letting tension go as you breathe out.',
    hold: '5–10 min',
  },
  {
    id: 'counting-breaths',
    name: 'Counting Breaths',
    category: 'meditation',
    image: `${BASE_URL}assets/counting-breaths_7b82.jpg`,
    howTo: 'Sit upright with eyes closed and count each out-breath from 1 to 10. When you reach 10, or notice your mind has wandered, simply start again at 1 without judging yourself.',
    hold: '5–10 min',
  },
  {
    id: 'noting',
    name: 'Noting',
    category: 'meditation',
    image: `${BASE_URL}assets/noting_df82.jpg`,
    howTo: 'Sit quietly and rest attention on your breath. When a thought comes, give it a one-word label such as "planning", "remembering" or "worrying", let it drift away, and return to the breath.',
    hold: '5–10 min',
  },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(ex => ex.id === id);
};

export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return exercises.filter(ex => ex.category === category);
};
