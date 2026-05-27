import { UserProfile, DailyNutrition, DailyTotals } from '../types';

export function calculateBMR(user: UserProfile): number {
  const { weight, height, age, gender } = user;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(user: UserProfile): number {
  const bmr = calculateBMR(user);
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return Math.round(bmr * multipliers[user.activityLevel]);
}

export function calculateTargetCalories(user: UserProfile): number {
  const tdee = calculateTDEE(user);
  const adjustments = {
    lose_weight: -500,
    gain_muscle: 300,
    maintain: 0,
    improve_endurance: 200,
  };
  return Math.round(tdee + adjustments[user.goal]);
}

export function calculateMacroTargets(calories: number, goal: UserProfile['goal']): {
  protein: number;
  carbs: number;
  fat: number;
} {
  const ratios = {
    lose_weight: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    gain_muscle: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    maintain: { protein: 0.25, carbs: 0.45, fat: 0.30 },
    improve_endurance: { protein: 0.20, carbs: 0.55, fat: 0.25 },
  };
  const r = ratios[goal];
  return {
    protein: Math.round((calories * r.protein) / 4),
    carbs: Math.round((calories * r.carbs) / 4),
    fat: Math.round((calories * r.fat) / 9),
  };
}

export function getDailyTotals(log: DailyNutrition | undefined): DailyTotals {
  if (!log) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  return log.meals.reduce(
    (totals, meal) => {
      meal.foods.forEach((food) => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
        totals.fiber += food.fiber ?? 0;
      });
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

export function calculateNutritionFromFood(
  food: { calories: number; protein: number; carbs: number; fat: number; fiber?: number; servingGrams: number },
  quantityGrams: number
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } {
  const ratio = quantityGrams / 100;
  return {
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10,
    fiber: Math.round((food.fiber ?? 0) * ratio * 10) / 10,
  };
}

export function getAverageCalories(logs: DailyNutrition[], days: number): number {
  if (logs.length === 0) return 0;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const recent = logs.filter((l) => new Date(l.date) >= cutoff);
  if (recent.length === 0) return 0;
  const total = recent.reduce((sum, log) => sum + getDailyTotals(log).calories, 0);
  return Math.round(total / recent.length);
}

export function getAverageProtein(logs: DailyNutrition[], days: number): number {
  if (logs.length === 0) return 0;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const recent = logs.filter((l) => new Date(l.date) >= cutoff);
  if (recent.length === 0) return 0;
  const total = recent.reduce((sum, log) => sum + getDailyTotals(log).protein, 0);
  return Math.round(total / recent.length);
}

export function getWorkoutsInLastNDays(workouts: { date: string; completed: boolean }[], days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return workouts.filter((w) => w.completed && new Date(w.date) >= cutoff).length;
}

export function getWeightChange(entries: { date: string; weight: number }[]): number | null {
  if (entries.length < 2) return null;
  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return Math.round((sorted[sorted.length - 1].weight - sorted[0].weight) * 10) / 10;
}

export function formatMacroCalories(protein: number, carbs: number, fat: number): number {
  return Math.round(protein * 4 + carbs * 4 + fat * 9);
}

export function calculateLifestyleScore(
  workouts: { date: string; completed: boolean }[],
  nutrition: DailyNutrition[],
  weightEntries: { date: string; weight: number }[],
  user: UserProfile
): number {
  let score = 0;

  const workoutsLast14 = getWorkoutsInLastNDays(workouts, 14);
  const idealWorkouts = 8;
  score += Math.min(25, (workoutsLast14 / idealWorkouts) * 25);

  const avgCal = getAverageCalories(nutrition, 14);
  if (avgCal > 0) {
    const adherence = 1 - Math.min(1, Math.abs(avgCal - user.targetCalories) / user.targetCalories);
    score += adherence * 20;
  } else {
    score += 5;
  }

  const avgPro = getAverageProtein(nutrition, 14);
  if (avgPro > 0) {
    score += Math.min(20, (avgPro / user.targetProtein) * 20);
  } else {
    score += 5;
  }

  const logsLast14 = nutrition.filter((l) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    return new Date(l.date) >= cutoff;
  }).length;
  score += Math.min(20, (logsLast14 / 14) * 20);

  if (weightEntries.length >= 2) {
    const change = getWeightChange(weightEntries);
    if (change !== null) {
      if (user.goal === 'lose_weight') {
        score += change < 0 ? 15 : change === 0 ? 7.5 : 2;
      } else if (user.goal === 'gain_muscle') {
        score += change > 0 ? 15 : change === 0 ? 7.5 : 5;
      } else {
        score += Math.abs(change) < 1 ? 15 : 7;
      }
    }
  } else {
    score += 7.5;
  }

  return Math.min(100, Math.round(score));
}
