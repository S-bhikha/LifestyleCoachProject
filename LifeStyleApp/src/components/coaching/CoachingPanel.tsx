import {
  Activity, AlertCircle, Apple, Award, Beef, Brain, Dumbbell, Heart, Moon, Plus,
  Scale, Star, TrendingDown, TrendingUp, Utensils, Zap,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { generateRecommendations } from '../../utils/coaching';
import { calculateLifestyleScore, getWorkoutsInLastNDays, getAverageCalories, getAverageProtein } from '../../utils/calculations';
import { Recommendation } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  TrendingDown: <TrendingDown size={20} />,
  AlertCircle: <AlertCircle size={20} />,
  Heart: <Heart size={20} />,
  Apple: <Apple size={20} />,
  Beef: <Beef size={20} />,
  Moon: <Moon size={20} />,
  Star: <Star size={20} />,
  Award: <Award size={20} />,
  Scale: <Scale size={20} />,
  Plus: <Plus size={20} />,
  Utensils: <Utensils size={20} />,
  Activity: <Activity size={20} />,
  Zap: <Zap size={20} />,
};

const colorConfig: Record<string, { bg: string; icon: string; badge: string; border: string }> = {
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600 bg-violet-100', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  teal: { bg: 'bg-primary-50', icon: 'text-primary-600 bg-primary-100', badge: 'bg-primary-100 text-primary-700', border: 'border-primary-200' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600 bg-amber-100', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600 bg-rose-100', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600 bg-emerald-100', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
};

const priorityConfig = {
  high: { label: 'High Priority', bg: 'bg-rose-100 text-rose-700' },
  medium: { label: 'Medium', bg: 'bg-amber-100 text-amber-700' },
  low: { label: 'Good Job!', bg: 'bg-emerald-100 text-emerald-700' },
};

const categoryConfig = {
  workout: { label: 'Workout', icon: <Dumbbell size={12} /> },
  nutrition: { label: 'Nutrition', icon: <Apple size={12} /> },
  recovery: { label: 'Recovery', icon: <Moon size={12} /> },
  general: { label: 'General', icon: <Brain size={12} /> },
};

function ScoreGauge({ score }: { score: number }) {
  const angle = (score / 100) * 180 - 90;
  let grade = 'C';
  let gradeColor = 'text-amber-600';
  if (score >= 85) { grade = 'A+'; gradeColor = 'text-emerald-600'; }
  else if (score >= 75) { grade = 'A'; gradeColor = 'text-emerald-500'; }
  else if (score >= 65) { grade = 'B+'; gradeColor = 'text-teal-600'; }
  else if (score >= 55) { grade = 'B'; gradeColor = 'text-teal-500'; }
  else if (score >= 45) { grade = 'C+'; gradeColor = 'text-amber-500'; }

  const scoreColor = score >= 75 ? '#16a34a' : score >= 55 ? '#0d9488' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-28 overflow-hidden mb-2">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Track */}
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round" />
          {/* Fill */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={scoreColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${Math.min(score, 100) * 2.83} 283`}
            className="transition-all duration-1000"
          />
          {/* Center text */}
          <text x="100" y="85" textAnchor="middle" className="font-bold" style={{ fontSize: 28, fontWeight: 800, fill: '#0f172a', fontFamily: 'Inter' }}>
            {score}
          </text>
          <text x="100" y="104" textAnchor="middle" style={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}>
            / 100
          </text>
        </svg>
      </div>
      <div className={`text-3xl font-bold ${gradeColor}`}>{grade}</div>
      <p className="text-slate-500 text-sm mt-1">Lifestyle Score</p>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const colors = colorConfig[rec.color] ?? colorConfig.teal;
  const pConfig = priorityConfig[rec.priority];
  const cConfig = categoryConfig[rec.category];

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 transition-all hover:shadow-md duration-200`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {iconMap[rec.icon] ?? <Zap size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
            <span className={`badge text-xs ${pConfig.bg}`}>{pConfig.label}</span>
            <span className="badge text-xs bg-slate-100 text-slate-600 flex items-center gap-1">
              {cConfig.icon} {cConfig.label}
            </span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">{rec.description}</p>
          <div className={`${colors.bg} border ${colors.border} rounded-xl p-3`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Action Plan</p>
            <p className="text-sm font-medium text-slate-800">{rec.actionable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoachingPanel() {
  const { user, workouts, dailyLogs, weightEntries, setCurrentView, loadSampleData } = useApp();
  if (!user) return null;

  const score = calculateLifestyleScore(workouts, dailyLogs, weightEntries, user);
  const recommendations = generateRecommendations(user, workouts, dailyLogs, weightEntries);

  const workoutsLast7 = getWorkoutsInLastNDays(workouts, 7);
  const workoutsLast30 = getWorkoutsInLastNDays(workouts, 30);
  const avgCal = getAverageCalories(dailyLogs, 14);
  const avgProtein = getAverageProtein(dailyLogs, 14);

  const goalDescriptions: Record<string, { title: string; desc: string; targets: { label: string; value: string; status: 'good' | 'ok' | 'bad' }[] }> = {
    lose_weight: {
      title: 'Weight Loss Program',
      desc: 'Focus: calorie deficit + preserving muscle through strength training',
      targets: [
        { label: 'Calorie target', value: `${user.targetCalories} cal/day`, status: Math.abs(avgCal - user.targetCalories) < 200 ? 'good' : Math.abs(avgCal - user.targetCalories) < 400 ? 'ok' : 'bad' },
        { label: 'Protein target', value: `${user.targetProtein}g/day`, status: avgProtein >= user.targetProtein * 0.9 ? 'good' : avgProtein >= user.targetProtein * 0.7 ? 'ok' : 'bad' },
        { label: 'Workout frequency', value: '3-4x/week', status: workoutsLast7 >= 3 ? 'good' : workoutsLast7 >= 2 ? 'ok' : 'bad' },
      ],
    },
    gain_muscle: {
      title: 'Muscle Building Program',
      desc: 'Focus: progressive overload + slight calorie surplus + high protein',
      targets: [
        { label: 'Calorie target', value: `${user.targetCalories} cal/day (surplus)`, status: avgCal >= user.targetCalories * 0.95 ? 'good' : avgCal >= user.targetCalories * 0.85 ? 'ok' : 'bad' },
        { label: 'Protein target', value: `${user.targetProtein}g/day`, status: avgProtein >= user.targetProtein * 0.9 ? 'good' : avgProtein >= user.targetProtein * 0.7 ? 'ok' : 'bad' },
        { label: 'Workout frequency', value: '4-5x/week', status: workoutsLast7 >= 4 ? 'good' : workoutsLast7 >= 3 ? 'ok' : 'bad' },
      ],
    },
    maintain: {
      title: 'Maintenance Program',
      desc: 'Focus: consistency, balanced nutrition, regular exercise',
      targets: [
        { label: 'Calorie target', value: `${user.targetCalories} cal/day`, status: Math.abs(avgCal - user.targetCalories) < 200 ? 'good' : Math.abs(avgCal - user.targetCalories) < 350 ? 'ok' : 'bad' },
        { label: 'Workout frequency', value: '3x/week', status: workoutsLast7 >= 3 ? 'good' : workoutsLast7 >= 2 ? 'ok' : 'bad' },
        { label: 'Nutritional logging', value: 'Daily', status: dailyLogs.filter((l) => { const c = new Date(); c.setDate(c.getDate() - 7); return new Date(l.date) >= c; }).length >= 5 ? 'good' : 'ok' },
      ],
    },
    improve_endurance: {
      title: 'Endurance Training Program',
      desc: 'Focus: cardio volume + carb-rich diet + consistent training',
      targets: [
        { label: 'Cardio sessions', value: '3-4x/week', status: workouts.filter((w) => { const c = new Date(); c.setDate(c.getDate() - 7); return new Date(w.date) >= c && w.cardio.length > 0; }).length >= 3 ? 'good' : 'ok' },
        { label: 'Calorie target', value: `${user.targetCalories} cal/day`, status: Math.abs(avgCal - user.targetCalories) < 300 ? 'good' : 'ok' },
        { label: 'Carb intake', value: `${user.targetCarbs}g/day`, status: 'ok' },
      ],
    },
  };

  const goalInfo = goalDescriptions[user.goal];
  const statusColors = { good: 'text-emerald-600 bg-emerald-100', ok: 'text-amber-600 bg-amber-100', bad: 'text-rose-600 bg-rose-100' };
  const statusLabels = { good: '✓ On track', ok: '~ Close', bad: '✗ Needs work' };

  const hasData = workouts.length > 0 || dailyLogs.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score + goal overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score card */}
        <div className="card flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
            <Brain size={24} className="text-primary-600" />
          </div>
          <h3 className="section-title mb-1">Your Wellness Score</h3>
          <p className="text-slate-500 text-sm mb-6">Based on workouts, nutrition & consistency</p>
          <ScoreGauge score={score} />
          <div className="mt-6 w-full grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-slate-900">{workoutsLast7}</p>
              <p className="text-xs text-slate-500">Workouts this week</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-slate-900">{workoutsLast30}</p>
              <p className="text-xs text-slate-500">Workouts this month</p>
            </div>
          </div>
        </div>

        {/* Goal card */}
        <div className="card">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{goalInfo.title}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{goalInfo.desc}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress Targets</p>
            {goalInfo.targets.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.value}</p>
                </div>
                <span className={`badge text-xs ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">14-Day Averages</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Calories:</span>{' '}
                <span className="font-bold text-slate-800">{avgCal > 0 ? Math.round(avgCal).toLocaleString() : '—'}</span>
              </div>
              <div>
                <span className="text-slate-500">Protein:</span>{' '}
                <span className="font-bold text-violet-700">{avgProtein > 0 ? `${Math.round(avgProtein)}g` : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Personalized Recommendations</h3>
            <p className="text-slate-500 text-sm">Based on your recent activity and goals</p>
          </div>
          {!hasData && (
            <button onClick={loadSampleData} className="btn-secondary text-sm py-2">
              <Zap size={14} /> Load Demo Data
            </button>
          )}
        </div>

        {!hasData ? (
          <div className="card text-center py-12">
            <Brain size={48} className="mx-auto mb-4 text-slate-300" />
            <h4 className="font-bold text-slate-700 mb-2">No Data to Analyze Yet</h4>
            <p className="text-slate-400 text-sm mb-4">
              Start logging workouts and meals to receive personalized coaching.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setCurrentView('workout')} className="btn-primary">
                <Activity size={16} /> Log Workout
              </button>
              <button onClick={() => setCurrentView('nutrition')} className="btn-secondary">
                <Apple size={16} /> Track Meals
              </button>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="card text-center py-10">
            <Award size={40} className="mx-auto mb-3 text-emerald-400" />
            <h4 className="font-bold text-emerald-700 text-lg mb-1">Outstanding performance!</h4>
            <p className="text-slate-500 text-sm">You're crushing all your goals. Keep up the amazing work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="card">
        <h3 className="section-title mb-4">💡 Evidence-Based Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '💪', title: 'Progressive Overload', body: 'Gradually increase the weight, reps, or sets each week to continuously challenge your muscles.' },
            { icon: '🥩', title: 'Protein Timing', body: 'Spread protein intake across 3-4 meals. Aim for 20-40g per meal for optimal muscle protein synthesis.' },
            { icon: '😴', title: 'Sleep for Recovery', body: '7-9 hours of quality sleep is when growth hormone is released and muscles are repaired.' },
            { icon: '💧', title: 'Stay Hydrated', body: 'Drink at least 2-3 liters of water daily. Dehydration reduces strength and endurance by up to 10%.' },
          ].map((tip) => (
            <div key={tip.title} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-1">{tip.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{tip.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
