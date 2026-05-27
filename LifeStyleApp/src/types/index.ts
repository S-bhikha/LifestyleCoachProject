export type Goal = 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type Gender = 'male' | 'female' | 'other';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'full_body';
export type RecommendationCategory = 'workout' | 'nutrition' | 'recovery' | 'general';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type AppView = 'dashboard' | 'workout' | 'nutrition' | 'progress' | 'coaching';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  createdAt: string;
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface LoggedExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: ExerciseSet[];
  notes?: string;
}

export interface CardioLog {
  id: string;
  type: string;
  duration: number;
  distance?: number;
  calories?: number;
  avgHeartRate?: number;
  pace?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: LoggedExercise[];
  cardio: CardioLog[];
  totalDuration?: number;
  notes?: string;
  completed: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category: string;
  serving: string;
  servingGrams: number;
}

export interface LoggedFood {
  id: string;
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MealLog {
  id: string;
  type: MealType;
  foods: LoggedFood[];
}

export interface DailyNutrition {
  id: string;
  date: string;
  meals: MealLog[];
  waterIntake?: number;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string;
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  title: string;
  description: string;
  actionable: string;
  icon: string;
  color: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}
