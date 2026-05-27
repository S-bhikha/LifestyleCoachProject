import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Activity, Plus, Scale, Trash2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getDailyTotals, getWeightChange } from '../../utils/calculations';
import { WeightEntry } from '../../types';

type TimeRange = '7d' | '30d' | '90d' | 'all';

function uid() { return crypto.randomUUID(); }

function getDateRange(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekKey(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = d.getDay();
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - dayOfWeek);
  return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ProgressDashboard() {
  const { user, workouts, dailyLogs, weightEntries, addWeightEntry, deleteWeightEntry } = useApp();
  if (!user) return null;

  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightForm, setWeightForm] = useState({ weight: '', bodyFat: '', notes: '' });

  const rangeDays = { '7d': 7, '30d': 30, '90d': 90, all: 365 }[timeRange];
  const cutoffDate = getDateRange(rangeDays);

  // --- Calorie trend data ---
  const calorieTrendData = Array.from({ length: Math.min(rangeDays, 30) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.min(rangeDays, 30) - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = dailyLogs.find((l) => l.date === dateStr);
    const t = getDailyTotals(log);
    return {
      date: formatDateShort(dateStr),
      calories: t.calories || null,
      protein: t.protein > 0 ? Math.round(t.protein) : null,
      target: user.targetCalories,
    };
  });

  // --- Workout frequency (weekly bar chart) ---
  const workoutsByWeek: Record<string, number> = {};
  workouts
    .filter((w) => w.completed && w.date >= cutoffDate)
    .forEach((w) => {
      const wk = formatWeekKey(w.date);
      workoutsByWeek[wk] = (workoutsByWeek[wk] || 0) + 1;
    });

  const workoutFreqData = Object.entries(workoutsByWeek)
    .map(([week, count]) => ({ week, count }))
    .slice(-8);

  // --- Weight history ---
  const weightData = weightEntries
    .filter((w) => w.date >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((w) => ({ date: formatDateShort(w.date), weight: w.weight, id: w.id }));

  // --- Macro trend (last 14 days avg) ---
  const last14MacroData = dailyLogs
    .filter((l) => l.date >= getDateRange(14))
    .map((l) => {
      const t = getDailyTotals(l);
      return {
        date: formatDateShort(l.date),
        protein: Math.round(t.protein),
        carbs: Math.round(t.carbs),
        fat: Math.round(t.fat),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // --- Summary stats ---
  const totalWorkouts = workouts.filter((w) => w.completed && w.date >= cutoffDate).length;
  const avgCalories =
    dailyLogs.filter((l) => l.date >= cutoffDate).reduce((s, l) => s + getDailyTotals(l).calories, 0) /
    Math.max(1, dailyLogs.filter((l) => l.date >= cutoffDate).length);

  const weightChange = getWeightChange(weightEntries.filter((w) => w.date >= cutoffDate));

  const totalCardioMin = workouts
    .filter((w) => w.completed && w.date >= cutoffDate)
    .reduce((s, w) => s + w.cardio.reduce((cs, c) => cs + c.duration, 0), 0);

  function saveWeight() {
    if (!weightForm.weight) return;
    const entry: WeightEntry = {
      id: uid(),
      date: new Date().toISOString().split('T')[0],
      weight: Number(weightForm.weight),
      bodyFat: weightForm.bodyFat ? Number(weightForm.bodyFat) : undefined,
      notes: weightForm.notes || undefined,
    };
    addWeightEntry(entry);
    setWeightForm({ weight: '', bodyFat: '', notes: '' });
    setShowWeightModal(false);
  }

  const CustomTooltipStyle = { borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Time range + actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                timeRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowWeightModal(true)} className="btn-primary text-sm py-2">
          <Plus size={15} /> Log Weight
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Workouts', value: String(totalWorkouts), icon: <Activity size={18} className="text-primary-600" />,
            sub: `in ${timeRange === 'all' ? 'all time' : timeRange}`, bg: 'bg-primary-50',
          },
          {
            label: 'Avg Calories', value: avgCalories > 0 ? Math.round(avgCalories).toLocaleString() : '—',
            icon: <span className="text-orange-500 font-bold text-sm">kcal</span>,
            sub: `target: ${user.targetCalories}`, bg: 'bg-orange-50',
          },
          {
            label: 'Weight Change', value: weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange}kg` : '—',
            icon: weightChange !== null && weightChange < 0 ? <TrendingDown size={18} className="text-emerald-600" /> : <TrendingUp size={18} className="text-rose-500" />,
            sub: 'over selected period', bg: weightChange !== null && weightChange < 0 ? 'bg-emerald-50' : 'bg-rose-50',
          },
          {
            label: 'Cardio Time', value: totalCardioMin >= 60 ? `${Math.floor(totalCardioMin / 60)}h ${totalCardioMin % 60}m` : `${totalCardioMin}m`,
            icon: <span className="text-rose-500 font-bold text-sm">❤️</span>,
            sub: 'total cardio logged', bg: 'bg-rose-50',
          },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>{s.icon}</div>
            <p className="text-slate-500 text-xs font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie trend */}
        <div className="card">
          <div className="mb-5">
            <h3 className="section-title">Calorie Intake</h3>
            <p className="text-slate-500 text-sm">Daily calories vs. target</p>
          </div>
          {calorieTrendData.some((d) => d.calories) ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={calorieTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="calGradProg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number, n: string) => [n === 'calories' ? `${v} cal` : `${v} cal target`, n]} />
                <ReferenceLine y={user.targetCalories} stroke="#94a3b8" strokeDasharray="4 4" />
                <Area connectNulls type="monotone" dataKey="calories" stroke="#0d9488" strokeWidth={2} fill="url(#calGradProg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No calorie data for this period" />
          )}
        </div>

        {/* Weight history */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Weight History</h3>
              <p className="text-slate-500 text-sm">Body weight over time</p>
            </div>
            <button onClick={() => setShowWeightModal(true)} className="btn-secondary text-xs py-1.5 px-3">
              <Plus size={13} /> Log
            </button>
          </div>
          {weightData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v} kg`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2.5}
                  dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, fill: '#1d4ed8' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Log at least 2 weight entries to see the chart" />
          )}

          {/* Weight entry list */}
          {weightEntries.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-2 max-h-32 overflow-y-auto">
              {[...weightEntries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 text-sm">
                    <Scale size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="text-slate-500 text-xs w-20 flex-shrink-0">{formatDateShort(entry.date)}</span>
                    <span className="font-bold text-slate-800">{entry.weight} kg</span>
                    {entry.bodyFat && <span className="text-slate-400 text-xs">{entry.bodyFat}% BF</span>}
                    {entry.notes && <span className="text-slate-400 text-xs truncate">{entry.notes}</span>}
                    <button onClick={() => deleteWeightEntry(entry.id)} className="ml-auto p-1 text-slate-300 hover:text-rose-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Workout frequency */}
        <div className="card">
          <div className="mb-5">
            <h3 className="section-title">Workout Frequency</h3>
            <p className="text-slate-500 text-sm">Sessions per week</p>
          </div>
          {workoutFreqData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workoutFreqData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number) => [`${v} sessions`, 'Workouts']} />
                <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]}>
                  {workoutFreqData.map((entry, index) => (
                    <Cell key={index} fill={entry.count >= 3 ? '#0d9488' : entry.count >= 2 ? '#2dd4bf' : '#99f6e4'} />
                  ))}
                </Bar>
                <ReferenceLine y={3} stroke="#94a3b8" strokeDasharray="4 4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No workout data for this period" />
          )}
        </div>

        {/* Macro trend */}
        <div className="card">
          <div className="mb-5">
            <h3 className="section-title">Macro Trend</h3>
            <p className="text-slate-500 text-sm">Protein, carbs & fat (last 14 days)</p>
          </div>
          {last14MacroData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={last14MacroData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={(v: number, n: string) => [`${v}g`, n]} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area connectNulls type="monotone" dataKey="protein" stroke="#7c3aed" strokeWidth={1.5} fill="url(#proGrad)" dot={false} />
                <Area connectNulls type="monotone" dataKey="carbs" stroke="#f59e0b" strokeWidth={1.5} fill="url(#carGrad)" dot={false} />
                <Area connectNulls type="monotone" dataKey="fat" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No macro data for this period" />
          )}
        </div>
      </div>

      {/* Weight Log Modal */}
      {showWeightModal && (
        <div className="modal-overlay" onClick={() => setShowWeightModal(false)}>
          <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-slate-900">Log Weight</h3>
                <button onClick={() => setShowWeightModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Body Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input text-lg font-bold"
                    placeholder={String(user.weight)}
                    value={weightForm.weight}
                    onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="label">Body Fat % (optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="e.g. 18.5"
                    value={weightForm.bodyFat}
                    onChange={(e) => setWeightForm({ ...weightForm, bodyFat: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Notes (optional)</label>
                  <input
                    className="input"
                    placeholder="e.g. Morning, after workout..."
                    value={weightForm.notes}
                    onChange={(e) => setWeightForm({ ...weightForm, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowWeightModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={saveWeight} disabled={!weightForm.weight} className="btn-primary flex-1 justify-center">
                  <Scale size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-slate-400">
      <div className="text-3xl mb-2">📈</div>
      <p className="text-sm text-center">{message}</p>
    </div>
  );
}
