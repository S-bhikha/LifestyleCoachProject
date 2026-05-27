import { UserProfile, WorkoutSession, DailyNutrition, WeightEntry, Recommendation } from '../types';
import {
  getWorkoutsInLastNDays,
  getAverageCalories,
  getAverageProtein,
  getWeightChange,
} from './calculations';

export function generateRecommendations(
  user: UserProfile,
  workouts: WorkoutSession[],
  nutrition: DailyNutrition[],
  weightEntries: WeightEntry[]
): Recommendation[] {
  const recs: Recommendation[] = [];

  const workoutsLast7 = getWorkoutsInLastNDays(workouts, 7);
  const workoutsLast30 = getWorkoutsInLastNDays(workouts, 30);
  const avgCalLast14 = getAverageCalories(nutrition, 14);
  const avgProLast14 = getAverageProtein(nutrition, 14);
  const weightChange = getWeightChange(weightEntries);

  // Workout frequency
  const weeklyRate = workoutsLast30 / 4;
  if (weeklyRate < 2) {
    recs.push({
      id: 'workout-freq-low',
      category: 'workout',
      priority: 'high',
      title: 'Increase Workout Frequency',
      description: `You're averaging ${weeklyRate.toFixed(1)} workouts per week over the past month. Consistency is the #1 driver of long-term results.`,
      actionable: 'Schedule 3 workout sessions this week and block off the time in your calendar.',
      icon: 'Dumbbell',
      color: 'violet',
    });
  } else if (weeklyRate >= 2 && weeklyRate < 3) {
    recs.push({
      id: 'workout-freq-medium',
      category: 'workout',
      priority: 'medium',
      title: 'Add One More Workout',
      description: `${weeklyRate.toFixed(1)} workouts per week is a solid start. Adding one more session can significantly accelerate your progress.`,
      actionable: 'Try adding a 30-minute session on a rest day — even a walk counts!',
      icon: 'TrendingUp',
      color: 'teal',
    });
  }

  // Workout this week
  if (workoutsLast7 === 0) {
    recs.push({
      id: 'workout-this-week',
      category: 'workout',
      priority: 'high',
      title: 'No Workouts This Week',
      description: "You haven't logged any workouts yet this week. Every day is a fresh start.",
      actionable: "Start with a 20-minute workout today — short sessions are better than none.",
      icon: 'AlertCircle',
      color: 'rose',
    });
  }

  // Protein intake
  if (avgProLast14 > 0) {
    const proteinGoal =
      user.goal === 'gain_muscle'
        ? user.weight * 2.0
        : user.goal === 'lose_weight'
        ? user.weight * 1.8
        : user.weight * 1.4;

    if (avgProLast14 < proteinGoal * 0.75) {
      recs.push({
        id: 'protein-low',
        category: 'nutrition',
        priority: 'high',
        title: 'Boost Your Protein Intake',
        description: `You're averaging ${Math.round(avgProLast14)}g of protein daily, but your goal needs ~${Math.round(proteinGoal)}g for optimal ${user.goal === 'gain_muscle' ? 'muscle growth' : 'results'}.`,
        actionable: 'Add a protein source to each meal: chicken, fish, eggs, Greek yogurt, or legumes.',
        icon: 'Beef',
        color: 'amber',
      });
    } else if (avgProLast14 >= proteinGoal) {
      recs.push({
        id: 'protein-great',
        category: 'nutrition',
        priority: 'low',
        title: 'Excellent Protein Intake',
        description: `You're hitting ${Math.round(avgProLast14)}g of protein daily — great for muscle retention and satiety.`,
        actionable: 'Keep it up! Maintain consistent protein intake throughout the day.',
        icon: 'Star',
        color: 'emerald',
      });
    }
  } else {
    recs.push({
      id: 'log-nutrition',
      category: 'nutrition',
      priority: 'high',
      title: 'Start Logging Your Meals',
      description: 'Nutrition tracking is one of the most powerful tools for achieving your goals. You can\'t manage what you don\'t measure.',
      actionable: 'Log everything you eat today — breakfast, lunch, dinner, and snacks.',
      icon: 'Utensils',
      color: 'teal',
    });
  }

  // Calorie adherence
  if (avgCalLast14 > 0) {
    const calDiff = avgCalLast14 - user.targetCalories;
    if (calDiff < -400) {
      recs.push({
        id: 'calories-too-low',
        category: 'nutrition',
        priority: 'medium',
        title: 'Calorie Intake May Be Too Low',
        description: `You're averaging ${Math.round(avgCalLast14)} calories, about ${Math.abs(Math.round(calDiff))} below your target. Under-eating can slow metabolism and reduce performance.`,
        actionable: 'Add nutrient-dense foods: a handful of nuts, avocado, or whole grains between meals.',
        icon: 'TrendingDown',
        color: 'amber',
      });
    } else if (calDiff > 400) {
      recs.push({
        id: 'calories-too-high',
        category: 'nutrition',
        priority: 'medium',
        title: 'Calorie Intake Above Target',
        description: `You're averaging ${Math.round(avgCalLast14)} calories — ${Math.round(calDiff)} above your goal. Small adjustments now prevent larger corrections later.`,
        actionable: 'Reduce portion sizes slightly or swap high-calorie snacks for fruits or vegetables.',
        icon: 'TrendingUp',
        color: 'rose',
      });
    }
  }

  // Weight progress
  if (weightChange !== null && weightEntries.length >= 2) {
    if (user.goal === 'lose_weight') {
      if (weightChange > 0.5) {
        recs.push({
          id: 'weight-increasing',
          category: 'general',
          priority: 'medium',
          title: 'Weight Trending Up',
          description: `Your weight has increased by ${weightChange}kg. For weight loss, a mild calorie deficit combined with consistent exercise is the key.`,
          actionable: 'Review your calorie intake and aim for a 250-500 calorie daily deficit.',
          icon: 'Scale',
          color: 'rose',
        });
      } else if (weightChange < -0.5) {
        recs.push({
          id: 'weight-decreasing-good',
          category: 'general',
          priority: 'low',
          title: 'Weight Loss on Track',
          description: `You've lost ${Math.abs(weightChange)}kg — great progress! Aim for 0.5–1kg per week for sustainable results.`,
          actionable: 'Continue your current routine and keep logging to maintain momentum.',
          icon: 'TrendingDown',
          color: 'emerald',
        });
      }
    } else if (user.goal === 'gain_muscle' && weightChange < 0) {
      recs.push({
        id: 'weight-low-muscle',
        category: 'nutrition',
        priority: 'medium',
        title: 'Not Eating Enough to Grow',
        description: 'Your weight is decreasing, making muscle gain harder. You need a slight calorie surplus to build muscle effectively.',
        actionable: `Increase your daily intake by 200-300 calories with carbs and protein.`,
        icon: 'Plus',
        color: 'amber',
      });
    }
  }

  // Recovery
  const sortedWorkouts = [...workouts]
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedWorkouts.length >= 5) {
    let consecutiveDays = 0;
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (sortedWorkouts.some((w) => w.date === dateStr)) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    if (consecutiveDays >= 4) {
      recs.push({
        id: 'recovery-needed',
        category: 'recovery',
        priority: 'medium',
        title: 'Schedule a Rest Day',
        description: `You've worked out ${consecutiveDays} days in a row. Rest is when muscles actually grow — recovery is part of the process.`,
        actionable: 'Take tomorrow as an active rest day: a gentle walk, stretching, or yoga.',
        icon: 'Moon',
        color: 'violet',
      });
    }
  }

  // Cardio for weight loss
  if (user.goal === 'lose_weight' || user.goal === 'improve_endurance') {
    const hasCardioLast14 = workouts
      .filter((w) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 14);
        return new Date(w.date) >= cutoff && w.completed;
      })
      .some((w) => w.cardio.length > 0);

    if (!hasCardioLast14) {
      recs.push({
        id: 'add-cardio',
        category: 'workout',
        priority: 'medium',
        title: 'Add Cardio to Your Routine',
        description: `You haven't logged any cardio in the past 2 weeks. Cardiovascular training supports ${user.goal === 'lose_weight' ? 'fat loss and' : ''} heart health.`,
        actionable: '20-30 minutes of moderate cardio (running, cycling, swimming) 2-3 times per week.',
        icon: 'Heart',
        color: 'rose',
      });
    }
  }

  // Consistency encouragement
  const loggingDays = nutrition.filter((l) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return new Date(l.date) >= cutoff;
  }).length;

  if (loggingDays >= 6) {
    recs.push({
      id: 'great-consistency',
      category: 'general',
      priority: 'low',
      title: 'Outstanding Consistency!',
      description: `You've logged nutrition ${loggingDays} out of the last 7 days. This level of dedication is what separates people who see results.`,
      actionable: 'Keep it up and review your weekly progress every Sunday to stay on track.',
      icon: 'Award',
      color: 'emerald',
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 6);
}
