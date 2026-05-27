import { useState } from 'react';
import {
  Activity, ChevronDown, ChevronUp, Clock, Dumbbell, Plus, Save, Trash2, X, Check, Heart, Filter,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { WorkoutSession, LoggedExercise, ExerciseSet, CardioLog, MuscleGroup } from '../../types';
import { exerciseDatabase, muscleGroups, cardioTypes, workoutTemplates } from '../../data/exerciseDatabase';

type WorkoutView = 'list' | 'create' | 'view';

interface WorkoutForm {
  name: string;
  exercises: LoggedExercise[];
  cardio: CardioLog[];
  notes: string;
  duration: string;
}

const defaultForm: WorkoutForm = {
  name: '',
  exercises: [],
  cardio: [],
  notes: '',
  duration: '',
};

function uid() { return crypto.randomUUID(); }

function makeDefaultSet(): ExerciseSet {
  return { id: uid(), reps: 10, weight: 0, completed: false };
}

export default function WorkoutTracker() {
  const { workouts, addWorkout, deleteWorkout, selectedDate } = useApp();
  const [view, setView] = useState<WorkoutView>('list');
  const [form, setForm] = useState<WorkoutForm>(defaultForm);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showCardioModal, setShowCardioModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [cardioForm, setCardioForm] = useState({ type: 'Running', duration: '', distance: '', calories: '', heartRate: '', notes: '' });

  const dateWorkouts = workouts.filter((w) => w.date === selectedDate);

  function startWorkout(templateName?: string) {
    setForm({ ...defaultForm, name: templateName ?? '' });
    setView('create');
  }

  function saveWorkout() {
    if (!form.name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    const session: WorkoutSession = {
      id: uid(),
      date: selectedDate,
      name: form.name,
      exercises: form.exercises,
      cardio: form.cardio,
      totalDuration: form.duration ? Number(form.duration) : undefined,
      notes: form.notes || undefined,
      completed: true,
    };
    addWorkout(session);
    setView('list');
    setForm(defaultForm);
  }

  function addExercise(exercise: typeof exerciseDatabase[0]) {
    const logged: LoggedExercise = {
      id: uid(),
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: [makeDefaultSet(), makeDefaultSet(), makeDefaultSet()],
    };
    setForm((f) => ({ ...f, exercises: [...f.exercises, logged] }));
    setExpandedExercise(logged.id);
    setShowExerciseModal(false);
  }

  function removeExercise(id: string) {
    setForm((f) => ({ ...f, exercises: f.exercises.filter((e) => e.id !== id) }));
  }

  function addSet(exerciseId: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId ? { ...e, sets: [...e.sets, makeDefaultSet()] } : e
      ),
    }));
  }

  function removeSet(exerciseId: string, setId: string) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e
      ),
    }));
  }

  function updateSet(exerciseId: string, setId: string, field: keyof ExerciseSet, value: string | boolean) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s) =>
                s.id === setId ? { ...s, [field]: typeof value === 'boolean' ? value : Number(value) || value } : s
              ),
            }
          : e
      ),
    }));
  }

  function addCardio() {
    if (!cardioForm.duration) return;
    const log: CardioLog = {
      id: uid(),
      type: cardioForm.type,
      duration: Number(cardioForm.duration),
      distance: cardioForm.distance ? Number(cardioForm.distance) : undefined,
      calories: cardioForm.calories ? Number(cardioForm.calories) : undefined,
      avgHeartRate: cardioForm.heartRate ? Number(cardioForm.heartRate) : undefined,
      notes: cardioForm.notes || undefined,
    };
    setForm((f) => ({ ...f, cardio: [...f.cardio, log] }));
    setCardioForm({ type: 'Running', duration: '', distance: '', calories: '', heartRate: '', notes: '' });
    setShowCardioModal(false);
  }

  const filteredExercises = exerciseDatabase.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchGroup = muscleFilter === 'all' || e.muscleGroup === muscleFilter;
    return matchSearch && matchGroup;
  });

  const muscleGroupColors: Record<MuscleGroup, string> = {
    chest: 'bg-red-100 text-red-700',
    back: 'bg-blue-100 text-blue-700',
    shoulders: 'bg-amber-100 text-amber-700',
    arms: 'bg-orange-100 text-orange-700',
    legs: 'bg-green-100 text-green-700',
    core: 'bg-purple-100 text-purple-700',
    full_body: 'bg-pink-100 text-pink-700',
  };

  if (view === 'create') {
    return (
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="btn-secondary py-2 px-3">
            <X size={16} />
          </button>
          <div className="flex-1">
            <input
              className="input text-lg font-bold py-3"
              placeholder="Workout name (e.g. Push Day)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <button onClick={saveWorkout} className="btn-primary">
            <Save size={16} /> Save
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Duration (min)</label>
            <div className="relative">
              <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                className="input pl-8"
                placeholder="60"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <input
              className="input"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Exercises */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Dumbbell size={18} className="text-primary-600" /> Exercises
            </h3>
            <button onClick={() => setShowExerciseModal(true)} className="btn-primary text-sm py-2">
              <Plus size={15} /> Add Exercise
            </button>
          </div>

          {form.exercises.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Dumbbell size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No exercises added yet</p>
              <p className="text-xs mt-1">Click "Add Exercise" to get started</p>
            </div>
          )}

          <div className="space-y-3">
            {form.exercises.map((ex, exIdx) => {
              const isExpanded = expandedExercise === ex.id;
              const completedSets = ex.sets.filter((s) => s.completed).length;
              return (
                <div key={ex.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold text-xs">{exIdx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{ex.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`badge text-xs py-0.5 ${muscleGroupColors[ex.muscleGroup]}`}>
                          {ex.muscleGroup.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">{completedSets}/{ex.sets.length} sets done</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeExercise(ex.id); }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-3 bg-slate-50 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 font-semibold px-1 mb-1">
                        <span>Set</span><span>Reps</span><span>Weight (kg)</span>
                      </div>
                      {ex.sets.map((set, si) => (
                        <div key={set.id} className="grid grid-cols-3 gap-2 items-center">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateSet(ex.id, set.id, 'completed', !set.completed)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                set.completed ? 'bg-primary-500 border-primary-500' : 'border-slate-300 hover:border-primary-400'
                              }`}
                            >
                              {set.completed && <Check size={12} className="text-white" />}
                            </button>
                            <span className="text-slate-600 font-medium text-sm">{si + 1}</span>
                          </div>
                          <input
                            type="number"
                            className="input py-2 text-sm text-center"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                            placeholder="10"
                          />
                          <div className="flex gap-1">
                            <input
                              type="number"
                              className="input py-2 text-sm text-center flex-1"
                              value={set.weight || ''}
                              onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                              placeholder="0"
                            />
                            {ex.sets.length > 1 && (
                              <button
                                onClick={() => removeSet(ex.id, set.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addSet(ex.id)}
                        className="w-full text-primary-600 text-sm font-semibold py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus size={14} /> Add Set
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cardio */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Heart size={18} className="text-rose-500" /> Cardio
            </h3>
            <button onClick={() => setShowCardioModal(true)} className="btn-secondary text-sm py-2">
              <Plus size={15} /> Add Cardio
            </button>
          </div>

          {form.cardio.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No cardio logged</p>
          ) : (
            <div className="space-y-2">
              {form.cardio.map((c) => (
                <div key={c.id} className="flex items-center gap-3 bg-rose-50 rounded-xl p-3">
                  <Heart size={16} className="text-rose-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{c.type}</p>
                    <p className="text-xs text-slate-500">
                      {c.duration}min
                      {c.distance ? ` · ${c.distance}km` : ''}
                      {c.calories ? ` · ${c.calories} cal` : ''}
                      {c.avgHeartRate ? ` · ${c.avgHeartRate} bpm` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setForm((f) => ({ ...f, cardio: f.cardio.filter((x) => x.id !== c.id) }))}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercise modal */}
        {showExerciseModal && (
          <div className="modal-overlay" onClick={() => setShowExerciseModal(false)}>
            <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">Add Exercise</h3>
                  <button onClick={() => setShowExerciseModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <X size={18} />
                  </button>
                </div>
                <input
                  className="input"
                  placeholder="Search exercises..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {muscleGroups.map((mg) => (
                    <button
                      key={mg.id}
                      onClick={() => setMuscleFilter(mg.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        muscleFilter === mg.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mg.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 max-h-72 overflow-y-auto space-y-1">
                {filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors text-left"
                  >
                    <div className={`badge text-xs ${muscleGroupColors[ex.muscleGroup]}`}>
                      {ex.muscleGroup.replace('_', ' ')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800">{ex.name}</p>
                      {ex.equipment && <p className="text-xs text-slate-400">{ex.equipment}</p>}
                    </div>
                    <Plus size={16} className="text-slate-300" />
                  </button>
                ))}
                {filteredExercises.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">No exercises found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cardio modal */}
        {showCardioModal && (
          <div className="modal-overlay" onClick={() => setShowCardioModal(false)}>
            <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900">Log Cardio</h3>
                  <button onClick={() => setShowCardioModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">Type</label>
                    <select
                      className="input"
                      value={cardioForm.type}
                      onChange={(e) => setCardioForm({ ...cardioForm, type: e.target.value })}
                    >
                      {cardioTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Duration (min) *</label>
                      <input type="number" className="input" placeholder="30" value={cardioForm.duration}
                        onChange={(e) => setCardioForm({ ...cardioForm, duration: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Distance (km)</label>
                      <input type="number" className="input" placeholder="5.0" value={cardioForm.distance}
                        onChange={(e) => setCardioForm({ ...cardioForm, distance: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Calories burned</label>
                      <input type="number" className="input" placeholder="300" value={cardioForm.calories}
                        onChange={(e) => setCardioForm({ ...cardioForm, calories: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">Avg heart rate</label>
                      <input type="number" className="input" placeholder="145" value={cardioForm.heartRate}
                        onChange={(e) => setCardioForm({ ...cardioForm, heartRate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <input className="input" placeholder="Optional..." value={cardioForm.notes}
                      onChange={(e) => setCardioForm({ ...cardioForm, notes: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowCardioModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                  <button onClick={addCardio} disabled={!cardioForm.duration} className="btn-primary flex-1 justify-center">
                    Add Cardio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Workout templates */}
      <div className="card">
        <h3 className="section-title mb-3">Start a Workout</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {workoutTemplates.slice(0, 4).map((t) => (
            <button
              key={t.name}
              onClick={() => startWorkout(t.name)}
              className="p-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-xl text-left transition-all duration-200"
            >
              <p className="font-semibold text-sm text-slate-800">{t.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>
        <button onClick={() => startWorkout()} className="btn-primary w-full justify-center">
          <Plus size={16} /> Custom Workout
        </button>
      </div>

      {/* Today's workouts */}
      <div>
        <h3 className="section-title mb-3 flex items-center gap-2">
          <Activity size={18} className="text-primary-600" />
          Workouts on This Day
          <span className="text-slate-400 text-sm font-normal">({dateWorkouts.length})</span>
        </h3>

        {dateWorkouts.length === 0 ? (
          <div className="card text-center py-10 text-slate-400">
            <Dumbbell size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-slate-600">No workouts logged</p>
            <p className="text-sm mt-1">Start a workout above to track your session</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dateWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} onDelete={() => deleteWorkout(w.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent workouts */}
      {workouts.filter((w) => w.date !== selectedDate).length > 0 && (
        <div>
          <h3 className="section-title mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {workouts
              .filter((w) => w.date !== selectedDate)
              .slice(0, 5)
              .map((w) => (
                <div key={w.id} className="card py-3 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{w.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(w.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}
                      {w.exercises.length} exercises
                      {w.totalDuration ? ` · ${w.totalDuration}min` : ''}
                    </p>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-700">Done</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutCard({ workout, onDelete }: { workout: WorkoutSession; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.length, 0);
  const completedSets = workout.exercises.reduce((s, e) => s + e.sets.filter((set) => set.completed).length, 0);

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Dumbbell size={20} className="text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-800">{workout.name}</h4>
            <span className="badge bg-emerald-100 text-emerald-700">Completed</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
            {workout.exercises.length > 0 && <span>{workout.exercises.length} exercises · {totalSets} sets ({completedSets} done)</span>}
            {workout.cardio.length > 0 && <span>{workout.cardio.length} cardio</span>}
            {workout.totalDuration && <span><Clock size={11} className="inline" /> {workout.totalDuration}min</span>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          {workout.exercises.map((ex) => (
            <div key={ex.id} className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-slate-800">{ex.name}</span>
              </div>
              <div className="space-y-1">
                {ex.sets.map((set, i) => (
                  <div key={set.id} className="flex items-center gap-3 text-xs text-slate-600">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center ${set.completed ? 'bg-primary-500 text-white' : 'bg-slate-200'}`}>
                      {set.completed ? <Check size={10} /> : <span>{i + 1}</span>}
                    </span>
                    <span>{set.reps} reps</span>
                    {set.weight > 0 && <span>@ {set.weight}kg</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {workout.cardio.map((c) => (
            <div key={c.id} className="bg-rose-50 rounded-xl p-3 flex items-center gap-3">
              <Heart size={16} className="text-rose-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-slate-800">{c.type}</p>
                <p className="text-xs text-slate-500">
                  {c.duration}min{c.distance ? ` · ${c.distance}km` : ''}{c.calories ? ` · ${c.calories}cal` : ''}
                  {c.avgHeartRate ? ` · ${c.avgHeartRate}bpm` : ''}
                </p>
              </div>
            </div>
          ))}
          {workout.notes && (
            <p className="text-xs text-slate-500 italic bg-slate-50 rounded-lg p-3">{workout.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
