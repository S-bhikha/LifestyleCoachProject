import { useState } from 'react';
import { Activity, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Gender, Goal, ActivityLevel } from '../../types';
import { calculateTargetCalories, calculateMacroTargets } from '../../utils/calculations';

interface FormData {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  loadSampleData: boolean;
}

const goals: { id: Goal; label: string; desc: string; emoji: string }[] = [
  { id: 'lose_weight', label: 'Lose Weight', desc: 'Burn fat and slim down', emoji: '🔥' },
  { id: 'gain_muscle', label: 'Build Muscle', desc: 'Increase size and strength', emoji: '💪' },
  { id: 'maintain', label: 'Stay Healthy', desc: 'Maintain current physique', emoji: '⚖️' },
  { id: 'improve_endurance', label: 'Boost Endurance', desc: 'Run further, go longer', emoji: '🏃' },
];

const activityLevels: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { id: 'lightly_active', label: 'Lightly Active', desc: '1–2 workouts/week' },
  { id: 'moderately_active', label: 'Moderately Active', desc: '3–4 workouts/week' },
  { id: 'very_active', label: 'Very Active', desc: '5–6 workouts/week' },
  { id: 'extremely_active', label: 'Athlete', desc: 'Physical job + daily training' },
];

export default function Onboarding() {
  const { setUser, loadSampleData } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'gain_muscle',
    activityLevel: 'moderately_active',
    loadSampleData: true,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function validate(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 13 || Number(form.age) > 120) {
      errs.age = 'Enter a valid age (13–120)';
    }
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) < 30) {
      errs.weight = 'Enter a valid weight (kg)';
    }
    if (!form.height || isNaN(Number(form.height)) || Number(form.height) < 100) {
      errs.height = 'Enter a valid height (cm)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validate()) return;
    setStep((s) => s + 1);
  }

  function handleSubmit() {
    const weight = Number(form.weight);
    const targetCalories = calculateTargetCalories({
      weight,
      height: Number(form.height),
      age: Number(form.age),
      gender: form.gender,
      goal: form.goal,
      activityLevel: form.activityLevel,
    } as Parameters<typeof calculateTargetCalories>[0]);

    const macros = calculateMacroTargets(targetCalories, form.goal);

    const user = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      age: Number(form.age),
      weight,
      height: Number(form.height),
      gender: form.gender,
      goal: form.goal,
      activityLevel: form.activityLevel,
      targetCalories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFat: macros.fat,
      createdAt: new Date().toISOString(),
    };

    setUser(user);

    if (form.loadSampleData) {
      setTimeout(() => loadSampleData(), 50);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-2xl shadow-primary-600/40 mb-4">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">LifeCoach</h1>
          <p className="text-slate-400 mt-1">Your personal wellness coach</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-primary-400 w-8' : 'bg-slate-700 w-4'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in">
          {/* Step 1 - Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome! Let's get started</h2>
              <p className="text-slate-500 mb-6">Tell us a bit about yourself</p>

              <div className="space-y-4">
                <div>
                  <label className="label">Your Name</label>
                  <input
                    className={`input ${errors.name ? 'border-rose-400 focus:ring-rose-400' : ''}`}
                    placeholder="e.g. Alex Johnson"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label">Age</label>
                    <input
                      className={`input ${errors.age ? 'border-rose-400' : ''}`}
                      type="number"
                      placeholder="25"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                    {errors.age && <p className="text-rose-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="label">Weight (kg)</label>
                    <input
                      className={`input ${errors.weight ? 'border-rose-400' : ''}`}
                      type="number"
                      placeholder="75"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                    {errors.weight && <p className="text-rose-500 text-xs mt-1">{errors.weight}</p>}
                  </div>
                  <div>
                    <label className="label">Height (cm)</label>
                    <input
                      className={`input ${errors.height ? 'border-rose-400' : ''}`}
                      type="number"
                      placeholder="175"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                    />
                    {errors.height && <p className="text-rose-500 text-xs mt-1">{errors.height}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['male', 'female', 'other'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`py-2.5 rounded-xl text-sm font-semibold capitalize border-2 transition-all duration-200 ${
                          form.gender === g
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Goal */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">What's your primary goal?</h2>
              <p className="text-slate-500 mb-6">This shapes your calorie and macro targets</p>

              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setForm({ ...form, goal: g.id })}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 ${
                      form.goal === g.id
                        ? 'border-primary-500 bg-primary-50 shadow-sm shadow-primary-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{g.emoji}</span>
                    <p className={`font-bold text-sm ${form.goal === g.id ? 'text-primary-700' : 'text-slate-800'}`}>
                      {g.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
                    {form.goal === g.id && (
                      <div className="mt-2 flex items-center gap-1 text-primary-600">
                        <Check size={12} />
                        <span className="text-xs font-semibold">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="label">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setForm({ ...form, activityLevel: a.id })}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                        form.activityLevel === a.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                          form.activityLevel === a.id ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{a.label}</p>
                        <p className="text-xs text-slate-500">{a.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Ready */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h2>
              <p className="text-slate-500 mb-6">Your personalized coaching plan is ready</p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-3">
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Goal', value: goals.find((g) => g.id === form.goal)?.label },
                  { label: 'Activity Level', value: activityLevels.find((a) => a.id === form.activityLevel)?.label },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">{item.label}</span>
                    <span className="font-semibold text-slate-800 text-sm">{item.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setForm({ ...form, loadSampleData: !form.loadSampleData })}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 mb-2 ${
                  form.loadSampleData ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                    form.loadSampleData ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                  }`}
                >
                  {form.loadSampleData && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Load sample data</p>
                  <p className="text-xs text-slate-500">See the app populated with 30 days of example data</p>
                </div>
              </button>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1 justify-center">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary flex-1 justify-center">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
                Start My Journey <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
