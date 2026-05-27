import { ExerciseTemplate } from '../types';

export const exerciseDatabase: ExerciseTemplate[] = [
  // Chest
  { id: 'e1', name: 'Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'e2', name: 'Incline Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'e3', name: 'Decline Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'e4', name: 'Dumbbell Chest Press', muscleGroup: 'chest', equipment: 'Dumbbell' },
  { id: 'e5', name: 'Cable Chest Fly', muscleGroup: 'chest', equipment: 'Cable' },
  { id: 'e6', name: 'Push-Ups', muscleGroup: 'chest', equipment: 'Bodyweight' },
  { id: 'e7', name: 'Chest Dips', muscleGroup: 'chest', equipment: 'Bodyweight' },
  { id: 'e8', name: 'Pec Deck (Machine Fly)', muscleGroup: 'chest', equipment: 'Machine' },

  // Back
  { id: 'e9', name: 'Deadlift', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'e10', name: 'Pull-Ups', muscleGroup: 'back', equipment: 'Bodyweight' },
  { id: 'e11', name: 'Chin-Ups', muscleGroup: 'back', equipment: 'Bodyweight' },
  { id: 'e12', name: 'Barbell Row', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'e13', name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'Dumbbell' },
  { id: 'e14', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'Cable' },
  { id: 'e15', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'Cable' },
  { id: 'e16', name: 'T-Bar Row', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'e17', name: 'Face Pulls', muscleGroup: 'back', equipment: 'Cable' },

  // Shoulders
  { id: 'e18', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'Barbell' },
  { id: 'e19', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'Dumbbell' },
  { id: 'e20', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'Dumbbell' },
  { id: 'e21', name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'Dumbbell' },
  { id: 'e22', name: 'Front Raises', muscleGroup: 'shoulders', equipment: 'Dumbbell' },
  { id: 'e23', name: 'Rear Delt Fly', muscleGroup: 'shoulders', equipment: 'Dumbbell' },
  { id: 'e24', name: 'Barbell Shrugs', muscleGroup: 'shoulders', equipment: 'Barbell' },

  // Arms
  { id: 'e25', name: 'Barbell Bicep Curl', muscleGroup: 'arms', equipment: 'Barbell' },
  { id: 'e26', name: 'Dumbbell Bicep Curl', muscleGroup: 'arms', equipment: 'Dumbbell' },
  { id: 'e27', name: 'Hammer Curl', muscleGroup: 'arms', equipment: 'Dumbbell' },
  { id: 'e28', name: 'Preacher Curl', muscleGroup: 'arms', equipment: 'Barbell' },
  { id: 'e29', name: 'Tricep Pushdown', muscleGroup: 'arms', equipment: 'Cable' },
  { id: 'e30', name: 'Skull Crushers', muscleGroup: 'arms', equipment: 'Barbell' },
  { id: 'e31', name: 'Overhead Tricep Extension', muscleGroup: 'arms', equipment: 'Dumbbell' },
  { id: 'e32', name: 'Close-Grip Bench Press', muscleGroup: 'arms', equipment: 'Barbell' },
  { id: 'e33', name: 'Diamond Push-Ups', muscleGroup: 'arms', equipment: 'Bodyweight' },

  // Legs
  { id: 'e34', name: 'Back Squat', muscleGroup: 'legs', equipment: 'Barbell' },
  { id: 'e35', name: 'Front Squat', muscleGroup: 'legs', equipment: 'Barbell' },
  { id: 'e36', name: 'Leg Press', muscleGroup: 'legs', equipment: 'Machine' },
  { id: 'e37', name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'Barbell' },
  { id: 'e38', name: 'Leg Curl', muscleGroup: 'legs', equipment: 'Machine' },
  { id: 'e39', name: 'Leg Extension', muscleGroup: 'legs', equipment: 'Machine' },
  { id: 'e40', name: 'Walking Lunges', muscleGroup: 'legs', equipment: 'Dumbbell' },
  { id: 'e41', name: 'Bulgarian Split Squat', muscleGroup: 'legs', equipment: 'Dumbbell' },
  { id: 'e42', name: 'Calf Raises', muscleGroup: 'legs', equipment: 'Machine' },
  { id: 'e43', name: 'Goblet Squat', muscleGroup: 'legs', equipment: 'Dumbbell' },

  // Core
  { id: 'e44', name: 'Plank', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'e45', name: 'Crunches', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'e46', name: 'Russian Twists', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'e47', name: 'Hanging Leg Raises', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'e48', name: 'Ab Wheel Rollout', muscleGroup: 'core', equipment: 'Ab Wheel' },
  { id: 'e49', name: 'Cable Crunch', muscleGroup: 'core', equipment: 'Cable' },
  { id: 'e50', name: 'Mountain Climbers', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'e51', name: 'Dead Bug', muscleGroup: 'core', equipment: 'Bodyweight' },

  // Full Body
  { id: 'e52', name: 'Burpees', muscleGroup: 'full_body', equipment: 'Bodyweight' },
  { id: 'e53', name: 'Kettlebell Swing', muscleGroup: 'full_body', equipment: 'Kettlebell' },
  { id: 'e54', name: 'Clean and Press', muscleGroup: 'full_body', equipment: 'Barbell' },
  { id: 'e55', name: 'Thrusters', muscleGroup: 'full_body', equipment: 'Barbell' },
  { id: 'e56', name: 'Box Jumps', muscleGroup: 'full_body', equipment: 'Box' },
  { id: 'e57', name: 'Battle Ropes', muscleGroup: 'full_body', equipment: 'Battle Ropes' },
];

export const muscleGroups = [
  { id: 'all', label: 'All' },
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'legs', label: 'Legs' },
  { id: 'core', label: 'Core' },
  { id: 'full_body', label: 'Full Body' },
];

export const cardioTypes = [
  'Running',
  'Cycling',
  'Swimming',
  'Rowing',
  'Elliptical',
  'Jump Rope',
  'Walking',
  'Hiking',
  'Stair Climbing',
  'HIIT',
];

export const workoutTemplates = [
  { name: 'Push Day', description: 'Chest, Shoulders, Triceps' },
  { name: 'Pull Day', description: 'Back, Biceps' },
  { name: 'Leg Day', description: 'Quads, Hamstrings, Calves, Glutes' },
  { name: 'Upper Body', description: 'Chest, Back, Shoulders, Arms' },
  { name: 'Lower Body', description: 'Legs and Core' },
  { name: 'Full Body', description: 'All muscle groups' },
  { name: 'Cardio Session', description: 'Cardiovascular training' },
  { name: 'Core & Cardio', description: 'Core focus with cardio' },
];
