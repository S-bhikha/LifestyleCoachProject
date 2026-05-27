import { Activity, Apple, Award, Brain, Dumbbell, Flame, Scale, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { getDailyTotals, getWorkoutsInLastNDays, calculateLifestyleScore } from '../../utils/calculations';
import { generateRecommendations } from '../../utils/coaching';

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 85) return { grade: 'A+', color: 'text-emerald-600' };
  if (score >= 75) return { grade: 'A', color: 'text-emerald-500' };
  if (score >= 65) return { grade: 'B+', color: 'text-teal-600' };
  if (score >= 55) return { grade: 'B', color: 'text-teal-500' };
  if (score >= 45) return { grade: 'C+', color: 'text-amber-500' };
  return { grade: 'C', color: 'text-amber-600' };
}

export default function Dashboard() {
  const { user, workouts, dailyLogs, weightEntries, setCurrentView, loadSampleData } = useApp();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find((l) => l.date === today);
  const todayTotals = getDailyTotals(todayLog);
  const todayWorkouts = workouts.filter((w) => w.date === today && w.completed);

  const caloriesLeft = user.targetCalories - todayTotals.calories;
  const workoutsLast7 = getWorkoutsInLastNDays(workouts, 7);
  const workoutsLast30 = getWorkoutsInLastNDays(workouts, 30);
  const score = calculateLifestyleScore(workouts, dailyLogs, weightEntries, user);
  const { grade, color } = getScoreGrade(score);

  const latestWeight = weightEntries.length > 0
    ? [...weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : user.weight;

  // Last 7 days calorie data
  const calorieTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = dailyLogs.find((l) => l.date === dateStr);
    return {
      date: formatShortDate(dateStr),
      calories: getDailyTotals(log).calories || 0,
      target: user.targetCalories,
    };
  });

  // Last 7 days workout frequency
  const workoutFreq = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hasWorkout = workouts.some((w) => w.date === dateStr && w.completed);
    return { date: formatShortDate(dateStr), worked: hasWorkout ? 1 : 0, dateStr };
  });

  const recommendations = generateRecommendations(user, workouts, dailyLogs, weightEntries);
  const topRecs = recommendations.slice(0, 3);

  const macroData = [
    { name: 'Protein', value: todayTotals.protein, target: user.targetProtein, color: '#7c3aed', unit: 'g' },
    { name: 'Carbs', value: todayTotals.carbs, target: user.targetCarbs, color: '#f59e0b', unit: 'g' },
    { name: 'Fat', value: todayTotals.fat, target: user.targetFat, color: '#ef4444', unit: 'g' },
  ];

  const isEmpty = workouts.length === 0 && dailyLogs.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-violet-600/20 rounded-full blur-xl translate-y-1/2" />
        <div className="relative">
          <p className="text-primary-300 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold mt-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-300 mt-1 text-sm">
            {caloriesLeft > 0
              ? `${caloriesLeft} calories remaining today`
              : `You've hit your calorie goal today!`}
          </p>
        </div>
        <div className="relative flex items-end justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-white/70 text-xs">Lifestyle Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{score}</span>
                <span className={`text-lg font-bold ${color}`}>{grade}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-white/70 text-xs">This Week</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{workoutsLast7}</span>
                <span className="text-white/70 text-xs">workouts</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('coaching')}
            className="bg-primary-500 hover:bg-primary-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Brain size={14} /> View Coaching
          </button>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-slate-900 mb-1">Your dashboard awaits data</h3>
          <p className="text-slate-500 text-sm mb-4">Load sample data to see how everything works, or start logging!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadSampleData} className="btn-primary">
              <Zap size={16} /> Load Sample Data
            </button>
            <button onClick={() => setCurrentView('workout')} className="btn-secondary">
              <Dumbbell size={16} /> Log Workout
            </button>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame size={20} className="text-orange-500" />}
          bg="bg-orange-50"
          label="Calories Today"
          value={todayTotals.calories.toLocaleString()}
          sub={`/ ${user.targetCalories.toLocaleString()} target`}
          progress={Math.min(100, (todayTotals.calories / user.targetCalories) * 100)}
          progressColor="bg-orange-400"
        />
        <StatCard
          icon={<Dumbbell size={20} className="text-primary-600" />}
          bg="bg-primary-50"
          label="Workouts Today"
          value={String(todayWorkouts.length)}
          sub={`${workoutsLast30} this month`}
          progress={Math.min(100, (workoutsLast7 / 5) * 100)}
          progressColor="bg-primary-500"
        />
        <StatCard
          icon={<Apple size={20} className="text-violet-600" />}
          bg="bg-violet-50"
          label="Protein Today"
          value={`${Math.round(todayTotals.protein)}g`}
          sub={`/ ${user.targetProtein}g target`}
          progress={Math.min(100, (todayTotals.protein / user.targetProtein) * 100)}
          progressColor="bg-violet-500"
        />
        <StatCard
          icon={<Scale size={20} className="text-blue-600" />}
          bg="bg-blue-50"
          label="Current Weight"
          value={`${latestWeight}kg`}
          sub={`Goal: ${user.goal.replace('_', ' ')}`}
          progress={null}
          progressColor=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie trend chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Calorie Trend</h3>
              <p className="text-slate-500 text-sm">Past 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-primary-500 rounded-full" />
                <span className="text-slate-500">Consumed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-slate-300 rounded-full" />
                <span className="text-slate-500">Target</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={calorieTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(val: number) => [`${val.toLocaleString()} cal`, '']}
              />
              <Area type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} fill="none" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="calories" stroke="#0d9488" strokeWidth={2.5} fill="url(#calGrad)" dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: 'white' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Workout frequency */}
        <div className="card">
          <h3 className="section-title mb-1">Workout Days</h3>
          <p className="text-slate-500 text-sm mb-4">Past 7 days</p>
          <div className="flex gap-2 justify-between mb-4">
            {workoutFreq.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  d.worked ? 'bg-primary-500 shadow-md shadow-primary-200' : 'bg-slate-100'
                }`}>
                  {d.worked ? <Activity size={14} className="text-white" /> : null}
                </div>
                <span className="text-slate-500 text-xs">{d.date.slice(0, 1)}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500 text-xs">Weekly consistency</span>
              <span className="font-bold text-sm text-slate-800">{workoutsLast7}/7</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill bg-primary-500" style={{ width: `${(workoutsLast7 / 7) * 100}%` }} />
            </div>
          </div>
          <button
            onClick={() => setCurrentView('workout')}
            className="btn-primary w-full justify-center mt-4 text-sm"
          >
            <Activity size={16} /> Log Workout
          </button>
        </div>
      </div>

      {/* Macros Today */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="section-title">Today's Macros</h3>
            <p className="text-slate-500 text-sm">Protein, Carbs & Fat breakdown</p>
          </div>
          <button onClick={() => setCurrentView('nutrition')} className="btn-secondary text-sm py-2">
            Log Food
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {macroData.map((m) => (
            <div key={m.name}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-slate-700">{m.name}</span>
                <span className="text-xs text-slate-500">{Math.round(m.value)}/{m.target}{m.unit}</span>
              </div>
              <div className="progress-bar h-3 rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (m.value / m.target) * 100)}%`,
                    backgroundColor: m.color,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {Math.round((m.value / m.target) * 100)}% of goal
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Recommendations */}
      {topRecs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Today's Recommendations</h3>
            <button onClick={() => setCurrentView('coaching')} className="text-primary-600 text-sm font-semibold hover:text-primary-700 transition-colors">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topRecs.map((rec) => {
              const colorMap: Record<string, string> = {
                violet: 'bg-violet-50 border-violet-100 text-violet-700',
                teal: 'bg-primary-50 border-primary-100 text-primary-700',
                amber: 'bg-amber-50 border-amber-100 text-amber-700',
                rose: 'bg-rose-50 border-rose-100 text-rose-700',
                emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
              };
              const cls = colorMap[rec.color] || colorMap.teal;
              const priorityBadge = {
                high: 'bg-rose-100 text-rose-700',
                medium: 'bg-amber-100 text-amber-700',
                low: 'bg-emerald-100 text-emerald-700',
              }[rec.priority];
              return (
                <div key={rec.id} className={`rounded-2xl border p-4 ${cls.split(' ').slice(0, 2).join(' ')} border-opacity-50`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-800">{rec.title}</h4>
                    <span className={`badge flex-shrink-0 ${priorityBadge}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.actionable}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Log Workout', icon: <Dumbbell size={18} />, view: 'workout', color: 'bg-primary-600 text-white hover:bg-primary-700' },
          { label: 'Track Meals', icon: <Apple size={18} />, view: 'nutrition', color: 'bg-violet-600 text-white hover:bg-violet-700' },
          { label: 'View Progress', icon: <TrendingUp size={18} />, view: 'progress', color: 'bg-amber-500 text-white hover:bg-amber-600' },
          { label: 'Get Coaching', icon: <Award size={18} />, view: 'coaching', color: 'bg-emerald-600 text-white hover:bg-emerald-700' },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => setCurrentView(a.view as Parameters<typeof setCurrentView>[0])}
            className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors font-semibold text-sm shadow-sm`}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  sub: string;
  progress: number | null;
  progressColor: string;
}

function StatCard({ icon, bg, label, value, sub, progress, progressColor }: StatCardProps) {
  return (
    <div className="card">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value text-2xl mt-0.5">{value}</p>
      <p className="text-slate-400 text-xs mt-1">{sub}</p>
      {progress !== null && (
        <div className="progress-bar mt-3">
          <div
            className={`progress-fill ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
