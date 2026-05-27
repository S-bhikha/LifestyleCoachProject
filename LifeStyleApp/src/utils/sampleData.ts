import { UserProfile, WorkoutSession, DailyNutrition, WeightEntry } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function generateSampleData(user: UserProfile): {
  workouts: WorkoutSession[];
  dailyLogs: DailyNutrition[];
  weightEntries: WeightEntry[];
} {
  // 12 workouts over past 30 days
  const workouts: WorkoutSession[] = [
    {
      id: uid(), date: dateStr(28), name: 'Push Day', completed: true, totalDuration: 60,
      exercises: [
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 8, weight: 80, completed: true },
          { id: uid(), reps: 8, weight: 80, completed: true },
          { id: uid(), reps: 6, weight: 82.5, completed: true },
        ]},
        { id: uid(), name: 'Incline Dumbbell Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 10, weight: 30, completed: true },
          { id: uid(), reps: 10, weight: 30, completed: true },
          { id: uid(), reps: 9, weight: 30, completed: true },
        ]},
        { id: uid(), name: 'Overhead Press', muscleGroup: 'shoulders', sets: [
          { id: uid(), reps: 8, weight: 50, completed: true },
          { id: uid(), reps: 8, weight: 50, completed: true },
          { id: uid(), reps: 7, weight: 50, completed: true },
        ]},
        { id: uid(), name: 'Tricep Pushdown', muscleGroup: 'arms', sets: [
          { id: uid(), reps: 12, weight: 35, completed: true },
          { id: uid(), reps: 12, weight: 35, completed: true },
          { id: uid(), reps: 12, weight: 35, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(26), name: 'Pull Day', completed: true, totalDuration: 55,
      exercises: [
        { id: uid(), name: 'Deadlift', muscleGroup: 'back', sets: [
          { id: uid(), reps: 5, weight: 120, completed: true },
          { id: uid(), reps: 5, weight: 120, completed: true },
          { id: uid(), reps: 5, weight: 125, completed: true },
        ]},
        { id: uid(), name: 'Pull-Ups', muscleGroup: 'back', sets: [
          { id: uid(), reps: 8, weight: 0, completed: true },
          { id: uid(), reps: 7, weight: 0, completed: true },
          { id: uid(), reps: 6, weight: 0, completed: true },
        ]},
        { id: uid(), name: 'Barbell Row', muscleGroup: 'back', sets: [
          { id: uid(), reps: 10, weight: 60, completed: true },
          { id: uid(), reps: 10, weight: 60, completed: true },
          { id: uid(), reps: 9, weight: 62.5, completed: true },
        ]},
        { id: uid(), name: 'Barbell Bicep Curl', muscleGroup: 'arms', sets: [
          { id: uid(), reps: 12, weight: 30, completed: true },
          { id: uid(), reps: 11, weight: 30, completed: true },
          { id: uid(), reps: 10, weight: 32.5, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(24), name: 'Leg Day', completed: true, totalDuration: 65,
      exercises: [
        { id: uid(), name: 'Back Squat', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 6, weight: 100, completed: true },
          { id: uid(), reps: 6, weight: 100, completed: true },
          { id: uid(), reps: 5, weight: 105, completed: true },
        ]},
        { id: uid(), name: 'Romanian Deadlift', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 10, weight: 70, completed: true },
          { id: uid(), reps: 10, weight: 70, completed: true },
          { id: uid(), reps: 10, weight: 72.5, completed: true },
        ]},
        { id: uid(), name: 'Leg Press', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 12, weight: 150, completed: true },
          { id: uid(), reps: 12, weight: 150, completed: true },
          { id: uid(), reps: 12, weight: 160, completed: true },
        ]},
        { id: uid(), name: 'Calf Raises', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 15, weight: 60, completed: true },
          { id: uid(), reps: 15, weight: 60, completed: true },
          { id: uid(), reps: 15, weight: 60, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(21), name: 'Push Day', completed: true, totalDuration: 58,
      exercises: [
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 8, weight: 82.5, completed: true },
          { id: uid(), reps: 8, weight: 82.5, completed: true },
          { id: uid(), reps: 6, weight: 85, completed: true },
        ]},
        { id: uid(), name: 'Lateral Raises', muscleGroup: 'shoulders', sets: [
          { id: uid(), reps: 15, weight: 10, completed: true },
          { id: uid(), reps: 15, weight: 10, completed: true },
          { id: uid(), reps: 15, weight: 12, completed: true },
        ]},
        { id: uid(), name: 'Skull Crushers', muscleGroup: 'arms', sets: [
          { id: uid(), reps: 10, weight: 25, completed: true },
          { id: uid(), reps: 10, weight: 25, completed: true },
          { id: uid(), reps: 9, weight: 27.5, completed: true },
        ]},
      ],
      cardio: [{ id: uid(), type: 'Running', duration: 20, distance: 3.5, calories: 280, avgHeartRate: 148 }],
    },
    {
      id: uid(), date: dateStr(19), name: 'Pull Day', completed: true, totalDuration: 52,
      exercises: [
        { id: uid(), name: 'Deadlift', muscleGroup: 'back', sets: [
          { id: uid(), reps: 5, weight: 125, completed: true },
          { id: uid(), reps: 5, weight: 125, completed: true },
          { id: uid(), reps: 4, weight: 130, completed: true },
        ]},
        { id: uid(), name: 'Lat Pulldown', muscleGroup: 'back', sets: [
          { id: uid(), reps: 12, weight: 65, completed: true },
          { id: uid(), reps: 12, weight: 65, completed: true },
          { id: uid(), reps: 10, weight: 70, completed: true },
        ]},
        { id: uid(), name: 'Hammer Curl', muscleGroup: 'arms', sets: [
          { id: uid(), reps: 12, weight: 18, completed: true },
          { id: uid(), reps: 12, weight: 18, completed: true },
          { id: uid(), reps: 11, weight: 20, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(17), name: 'Cardio Session', completed: true, totalDuration: 35,
      exercises: [],
      cardio: [
        { id: uid(), type: 'Cycling', duration: 35, distance: 15, calories: 320, avgHeartRate: 145 },
      ],
    },
    {
      id: uid(), date: dateStr(14), name: 'Full Body', completed: true, totalDuration: 70,
      exercises: [
        { id: uid(), name: 'Back Squat', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 6, weight: 100, completed: true },
          { id: uid(), reps: 6, weight: 105, completed: true },
          { id: uid(), reps: 5, weight: 107.5, completed: true },
        ]},
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 8, weight: 85, completed: true },
          { id: uid(), reps: 7, weight: 85, completed: true },
          { id: uid(), reps: 6, weight: 87.5, completed: true },
        ]},
        { id: uid(), name: 'Barbell Row', muscleGroup: 'back', sets: [
          { id: uid(), reps: 8, weight: 65, completed: true },
          { id: uid(), reps: 8, weight: 65, completed: true },
          { id: uid(), reps: 8, weight: 65, completed: true },
        ]},
        { id: uid(), name: 'Plank', muscleGroup: 'core', sets: [
          { id: uid(), reps: 60, weight: 0, completed: true },
          { id: uid(), reps: 60, weight: 0, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(12), name: 'Leg Day', completed: true, totalDuration: 62,
      exercises: [
        { id: uid(), name: 'Front Squat', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 6, weight: 80, completed: true },
          { id: uid(), reps: 6, weight: 80, completed: true },
          { id: uid(), reps: 5, weight: 82.5, completed: true },
        ]},
        { id: uid(), name: 'Walking Lunges', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 12, weight: 20, completed: true },
          { id: uid(), reps: 12, weight: 20, completed: true },
          { id: uid(), reps: 12, weight: 22.5, completed: true },
        ]},
        { id: uid(), name: 'Leg Curl', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 12, weight: 45, completed: true },
          { id: uid(), reps: 12, weight: 45, completed: true },
          { id: uid(), reps: 11, weight: 47.5, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(9), name: 'Push Day', completed: true, totalDuration: 60,
      exercises: [
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 8, weight: 87.5, completed: true },
          { id: uid(), reps: 7, weight: 87.5, completed: true },
          { id: uid(), reps: 6, weight: 90, completed: true },
        ]},
        { id: uid(), name: 'Cable Chest Fly', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 12, weight: 20, completed: true },
          { id: uid(), reps: 12, weight: 20, completed: true },
          { id: uid(), reps: 12, weight: 22.5, completed: true },
        ]},
        { id: uid(), name: 'Overhead Press', muscleGroup: 'shoulders', sets: [
          { id: uid(), reps: 8, weight: 52.5, completed: true },
          { id: uid(), reps: 8, weight: 52.5, completed: true },
          { id: uid(), reps: 7, weight: 55, completed: true },
        ]},
      ],
      cardio: [{ id: uid(), type: 'Running', duration: 15, distance: 2.5, calories: 190, avgHeartRate: 155 }],
    },
    {
      id: uid(), date: dateStr(7), name: 'Pull Day', completed: true, totalDuration: 55,
      exercises: [
        { id: uid(), name: 'Deadlift', muscleGroup: 'back', sets: [
          { id: uid(), reps: 5, weight: 130, completed: true },
          { id: uid(), reps: 5, weight: 130, completed: true },
          { id: uid(), reps: 4, weight: 132.5, completed: true },
        ]},
        { id: uid(), name: 'Chin-Ups', muscleGroup: 'back', sets: [
          { id: uid(), reps: 8, weight: 0, completed: true },
          { id: uid(), reps: 7, weight: 0, completed: true },
          { id: uid(), reps: 7, weight: 0, completed: true },
        ]},
        { id: uid(), name: 'Dumbbell Row', muscleGroup: 'back', sets: [
          { id: uid(), reps: 10, weight: 35, completed: true },
          { id: uid(), reps: 10, weight: 35, completed: true },
          { id: uid(), reps: 10, weight: 37.5, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(4), name: 'Leg Day', completed: true, totalDuration: 68,
      exercises: [
        { id: uid(), name: 'Back Squat', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 6, weight: 107.5, completed: true },
          { id: uid(), reps: 6, weight: 107.5, completed: true },
          { id: uid(), reps: 5, weight: 110, completed: true },
        ]},
        { id: uid(), name: 'Romanian Deadlift', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 10, weight: 75, completed: true },
          { id: uid(), reps: 10, weight: 75, completed: true },
          { id: uid(), reps: 9, weight: 77.5, completed: true },
        ]},
        { id: uid(), name: 'Bulgarian Split Squat', muscleGroup: 'legs', sets: [
          { id: uid(), reps: 10, weight: 20, completed: true },
          { id: uid(), reps: 10, weight: 20, completed: true },
          { id: uid(), reps: 9, weight: 22.5, completed: true },
        ]},
      ],
      cardio: [],
    },
    {
      id: uid(), date: dateStr(2), name: 'Upper Body', completed: true, totalDuration: 60,
      exercises: [
        { id: uid(), name: 'Bench Press', muscleGroup: 'chest', sets: [
          { id: uid(), reps: 8, weight: 90, completed: true },
          { id: uid(), reps: 8, weight: 90, completed: true },
          { id: uid(), reps: 7, weight: 90, completed: true },
        ]},
        { id: uid(), name: 'Pull-Ups', muscleGroup: 'back', sets: [
          { id: uid(), reps: 9, weight: 0, completed: true },
          { id: uid(), reps: 8, weight: 0, completed: true },
          { id: uid(), reps: 8, weight: 0, completed: true },
        ]},
        { id: uid(), name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', sets: [
          { id: uid(), reps: 10, weight: 25, completed: true },
          { id: uid(), reps: 10, weight: 25, completed: true },
          { id: uid(), reps: 9, weight: 27.5, completed: true },
        ]},
        { id: uid(), name: 'Barbell Bicep Curl', muscleGroup: 'arms', sets: [
          { id: uid(), reps: 10, weight: 32.5, completed: true },
          { id: uid(), reps: 10, weight: 32.5, completed: true },
          { id: uid(), reps: 9, weight: 35, completed: true },
        ]},
      ],
      cardio: [],
    },
  ];

  // Generate nutrition logs for last 28 days
  const dailyLogs: DailyNutrition[] = [];

  const mealTemplates = [
    {
      type: 'breakfast' as const,
      options: [
        [
          { foodId: 'f23', name: 'Rolled Oats (dry)', quantity: 80, calories: 303, protein: 10.6, carbs: 54, fat: 5.5, fiber: 8.5 },
          { foodId: 'f54', name: 'Protein Shake (made)', quantity: 350, calories: 130, protein: 25, carbs: 5, fat: 2, fiber: 0 },
          { foodId: 'f31', name: 'Blueberries', quantity: 100, calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4 },
        ],
        [
          { foodId: 'f9', name: 'Whole Egg', quantity: 150, calories: 233, protein: 19.5, carbs: 1.7, fat: 16.5, fiber: 0 },
          { foodId: 'f24', name: 'Whole Wheat Bread', quantity: 60, calories: 148, protein: 7.8, carbs: 24.6, fat: 2.5, fiber: 4.2 },
          { foodId: 'f53', name: 'Coffee (black)', quantity: 240, calories: 5, protein: 0.7, carbs: 0, fat: 0, fiber: 0 },
        ],
        [
          { foodId: 'f11', name: 'Greek Yogurt (plain, non-fat)', quantity: 200, calories: 118, protein: 20, carbs: 7.2, fat: 0.8, fiber: 0 },
          { foodId: 'f29', name: 'Banana', quantity: 120, calories: 107, protein: 1.3, carbs: 27.6, fat: 0.4, fiber: 3.1 },
          { foodId: 'f43', name: 'Almonds', quantity: 30, calories: 174, protein: 6.3, carbs: 6.6, fat: 15, fiber: 3.8 },
        ],
      ],
    },
    {
      type: 'lunch' as const,
      options: [
        [
          { foodId: 'f1', name: 'Chicken Breast (cooked)', quantity: 180, calories: 297, protein: 55.8, carbs: 0, fat: 6.5, fiber: 0 },
          { foodId: 'f21', name: 'Brown Rice (cooked)', quantity: 200, calories: 224, protein: 5.2, carbs: 46, fat: 1.8, fiber: 3.6 },
          { foodId: 'f36', name: 'Broccoli', quantity: 150, calories: 51, protein: 4.2, carbs: 10.5, fat: 0.6, fiber: 3.9 },
        ],
        [
          { foodId: 'f5', name: 'Tuna (canned, water)', quantity: 150, calories: 174, protein: 39, carbs: 0, fat: 1.5, fiber: 0 },
          { foodId: 'f58', name: 'Mixed Salad Greens', quantity: 120, calories: 24, protein: 2.2, carbs: 4.2, fat: 0.4, fiber: 2.4 },
          { foodId: 'f25', name: 'White Bread', quantity: 60, calories: 159, protein: 5.4, carbs: 29.4, fat: 1.9, fiber: 1.6 },
        ],
        [
          { foodId: 'f3', name: 'Turkey Breast (cooked)', quantity: 150, calories: 203, protein: 45, carbs: 0, fat: 1.5, fiber: 0 },
          { foodId: 'f27', name: 'Quinoa (cooked)', quantity: 200, calories: 240, protein: 8.8, carbs: 42.6, fat: 3.8, fiber: 5.6 },
          { foodId: 'f37', name: 'Spinach', quantity: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
        ],
      ],
    },
    {
      type: 'dinner' as const,
      options: [
        [
          { foodId: 'f4', name: 'Salmon (cooked)', quantity: 200, calories: 416, protein: 40, carbs: 0, fat: 26, fiber: 0 },
          { foodId: 'f28', name: 'Sweet Potato (cooked)', quantity: 200, calories: 172, protein: 3.2, carbs: 40, fat: 0.2, fiber: 6 },
          { foodId: 'f36', name: 'Broccoli', quantity: 150, calories: 51, protein: 4.2, carbs: 10.5, fat: 0.6, fiber: 3.9 },
        ],
        [
          { foodId: 'f2', name: 'Ground Beef (lean, cooked)', quantity: 150, calories: 323, protein: 39, carbs: 0, fat: 18, fiber: 0 },
          { foodId: 'f26', name: 'Pasta (cooked)', quantity: 200, calories: 262, protein: 10, carbs: 50, fat: 2.2, fiber: 3.6 },
          { foodId: 'f42', name: 'Tomato', quantity: 150, calories: 27, protein: 1.4, carbs: 5.9, fat: 0.3, fiber: 1.8 },
        ],
        [
          { foodId: 'f1', name: 'Chicken Breast (cooked)', quantity: 200, calories: 330, protein: 62, carbs: 0, fat: 7.2, fiber: 0 },
          { foodId: 'f22', name: 'White Rice (cooked)', quantity: 200, calories: 260, protein: 5.4, carbs: 56, fat: 0.6, fiber: 0.8 },
          { foodId: 'f38', name: 'Bell Pepper', quantity: 100, calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
        ],
      ],
    },
    {
      type: 'snack' as const,
      options: [
        [{ foodId: 'f11', name: 'Greek Yogurt (plain, non-fat)', quantity: 170, calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0 }],
        [
          { foodId: 'f43', name: 'Almonds', quantity: 30, calories: 174, protein: 6.3, carbs: 6.6, fat: 15, fiber: 3.8 },
          { foodId: 'f30', name: 'Apple', quantity: 182, calories: 95, protein: 0.5, carbs: 25.5, fat: 0.4, fiber: 4.4 },
        ],
        [{ foodId: 'f48', name: 'Protein Bar (generic)', quantity: 60, calories: 200, protein: 20, carbs: 22, fat: 6, fiber: 3 }],
      ],
    },
  ];

  for (let i = 27; i >= 0; i--) {
    const skip = Math.random() < 0.1;
    if (skip) continue;

    const meals = mealTemplates.map((mt) => ({
      id: uid(),
      type: mt.type,
      foods: mt.options[Math.floor(Math.random() * mt.options.length)].map((f) => ({
        id: uid(),
        ...f,
        quantity: Math.round(f.quantity * (0.9 + Math.random() * 0.2)),
      })),
    }));

    dailyLogs.push({
      id: uid(),
      date: dateStr(i),
      meals,
    });
  }

  // Weight entries (weekly)
  const baseWeight = user.weight;
  const weightEntries: WeightEntry[] = [
    { id: uid(), date: dateStr(28), weight: Math.round((baseWeight + 1.5) * 10) / 10, notes: 'Starting weight' },
    { id: uid(), date: dateStr(21), weight: Math.round((baseWeight + 1.0) * 10) / 10 },
    { id: uid(), date: dateStr(14), weight: Math.round((baseWeight + 0.5) * 10) / 10 },
    { id: uid(), date: dateStr(7), weight: Math.round((baseWeight + 0.1) * 10) / 10 },
    { id: uid(), date: dateStr(0), weight: Math.round(baseWeight * 10) / 10, notes: 'Feeling great' },
  ];

  return { workouts, dailyLogs, weightEntries };
}
