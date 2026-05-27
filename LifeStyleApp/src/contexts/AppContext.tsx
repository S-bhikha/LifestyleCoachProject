import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  UserProfile, WorkoutSession, DailyNutrition, WeightEntry,
  AppView, MealType, LoggedFood, MealLog, LoggedExercise, CardioLog, ExerciseSet,
} from '../types';
import { generateSampleData } from '../utils/sampleData';

interface AppState {
  user: UserProfile | null;
  workouts: WorkoutSession[];
  dailyLogs: DailyNutrition[];
  weightEntries: WeightEntry[];
  currentView: AppView;
  selectedDate: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'ADD_WORKOUT'; payload: WorkoutSession }
  | { type: 'UPDATE_WORKOUT'; payload: { id: string; updates: Partial<WorkoutSession> } }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_FOOD_TO_MEAL'; payload: { date: string; mealType: MealType; food: LoggedFood } }
  | { type: 'REMOVE_FOOD_FROM_MEAL'; payload: { date: string; mealId: string; foodId: string } }
  | { type: 'ADD_WEIGHT_ENTRY'; payload: WeightEntry }
  | { type: 'DELETE_WEIGHT_ENTRY'; payload: string }
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'LOAD_SAMPLE_DATA'; payload: { workouts: WorkoutSession[]; dailyLogs: DailyNutrition[]; weightEntries: WeightEntry[] } }
  | { type: 'CLEAR_ALL_DATA' };

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };

    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };

    case 'DELETE_WORKOUT':
      return { ...state, workouts: state.workouts.filter((w) => w.id !== action.payload) };

    case 'ADD_FOOD_TO_MEAL': {
      const { date, mealType, food } = action.payload;
      const existingLog = state.dailyLogs.find((l) => l.date === date);
      if (existingLog) {
        const existingMeal = existingLog.meals.find((m) => m.type === mealType);
        const updatedMeals: MealLog[] = existingMeal
          ? existingLog.meals.map((m) =>
              m.type === mealType ? { ...m, foods: [...m.foods, food] } : m
            )
          : [...existingLog.meals, { id: crypto.randomUUID(), type: mealType, foods: [food] }];
        return {
          ...state,
          dailyLogs: state.dailyLogs.map((l) =>
            l.date === date ? { ...l, meals: updatedMeals } : l
          ),
        };
      }
      const newLog: DailyNutrition = {
        id: crypto.randomUUID(),
        date,
        meals: [{ id: crypto.randomUUID(), type: mealType, foods: [food] }],
      };
      return { ...state, dailyLogs: [...state.dailyLogs, newLog] };
    }

    case 'REMOVE_FOOD_FROM_MEAL': {
      const { date, mealId, foodId } = action.payload;
      return {
        ...state,
        dailyLogs: state.dailyLogs.map((l) =>
          l.date === date
            ? {
                ...l,
                meals: l.meals.map((m) =>
                  m.id === mealId ? { ...m, foods: m.foods.filter((f) => f.id !== foodId) } : m
                ),
              }
            : l
        ),
      };
    }

    case 'ADD_WEIGHT_ENTRY':
      return {
        ...state,
        weightEntries: [...state.weightEntries.filter((w) => w.date !== action.payload.date), action.payload].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      };

    case 'DELETE_WEIGHT_ENTRY':
      return { ...state, weightEntries: state.weightEntries.filter((w) => w.id !== action.payload) };

    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };

    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        workouts: action.payload.workouts,
        dailyLogs: action.payload.dailyLogs,
        weightEntries: action.payload.weightEntries,
      };

    case 'CLEAR_ALL_DATA':
      return { ...state, workouts: [], dailyLogs: [], weightEntries: [] };

    default:
      return state;
  }
}

const STORAGE_KEY = 'lifecoach_state';

function loadFromStorage(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

interface AppContextType extends AppState {
  setUser: (user: UserProfile) => void;
  addWorkout: (session: WorkoutSession) => void;
  updateWorkout: (id: string, updates: Partial<WorkoutSession>) => void;
  deleteWorkout: (id: string) => void;
  addFoodToMeal: (date: string, mealType: MealType, food: LoggedFood) => void;
  removeFoodFromMeal: (date: string, mealId: string, foodId: string) => void;
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (id: string) => void;
  setCurrentView: (view: AppView) => void;
  setSelectedDate: (date: string) => void;
  loadSampleData: () => void;
  clearAllData: () => void;
  getDailyLog: (date: string) => DailyNutrition | undefined;
  getTodayWorkouts: () => WorkoutSession[];
  updateExerciseSet: (workoutId: string, exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => void;
  addExerciseToWorkout: (workoutId: string, exercise: LoggedExercise) => void;
  addCardioToWorkout: (workoutId: string, cardio: CardioLog) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [state, dispatch] = useReducer(reducer, {
    user: stored.user ?? null,
    workouts: stored.workouts ?? [],
    dailyLogs: stored.dailyLogs ?? [],
    weightEntries: stored.weightEntries ?? [],
    currentView: 'dashboard',
    selectedDate: getToday(),
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const ctx: AppContextType = {
    ...state,

    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),

    addWorkout: (session) => dispatch({ type: 'ADD_WORKOUT', payload: session }),

    updateWorkout: (id, updates) => dispatch({ type: 'UPDATE_WORKOUT', payload: { id, updates } }),

    deleteWorkout: (id) => dispatch({ type: 'DELETE_WORKOUT', payload: id }),

    addFoodToMeal: (date, mealType, food) =>
      dispatch({ type: 'ADD_FOOD_TO_MEAL', payload: { date, mealType, food } }),

    removeFoodFromMeal: (date, mealId, foodId) =>
      dispatch({ type: 'REMOVE_FOOD_FROM_MEAL', payload: { date, mealId, foodId } }),

    addWeightEntry: (entry) => dispatch({ type: 'ADD_WEIGHT_ENTRY', payload: entry }),

    deleteWeightEntry: (id) => dispatch({ type: 'DELETE_WEIGHT_ENTRY', payload: id }),

    setCurrentView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),

    setSelectedDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),

    loadSampleData: () => {
      if (!state.user) return;
      const data = generateSampleData(state.user);
      dispatch({ type: 'LOAD_SAMPLE_DATA', payload: data });
    },

    clearAllData: () => dispatch({ type: 'CLEAR_ALL_DATA' }),

    getDailyLog: (date) => state.dailyLogs.find((l) => l.date === date),

    getTodayWorkouts: () => state.workouts.filter((w) => w.date === getToday()),

    updateExerciseSet: (workoutId, exerciseId, setId, updates) => {
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (!workout) return;
      const updatedExercises = workout.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)) }
          : ex
      );
      dispatch({ type: 'UPDATE_WORKOUT', payload: { id: workoutId, updates: { exercises: updatedExercises } } });
    },

    addExerciseToWorkout: (workoutId, exercise) => {
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (!workout) return;
      dispatch({
        type: 'UPDATE_WORKOUT',
        payload: { id: workoutId, updates: { exercises: [...workout.exercises, exercise] } },
      });
    },

    addCardioToWorkout: (workoutId, cardio) => {
      const workout = state.workouts.find((w) => w.id === workoutId);
      if (!workout) return;
      dispatch({
        type: 'UPDATE_WORKOUT',
        payload: { id: workoutId, updates: { cardio: [...workout.cardio, cardio] } },
      });
    },
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
