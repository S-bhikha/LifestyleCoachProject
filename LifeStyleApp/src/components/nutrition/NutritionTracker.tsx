import { useState } from 'react';
import { Apple, ChevronDown, ChevronUp, Minus, Plus, Search, Trash2, Utensils, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../contexts/AppContext';
import { MealType, FoodItem, LoggedFood } from '../../types';
import { foodDatabase, foodCategories } from '../../data/foodDatabase';
import { getDailyTotals, calculateNutritionFromFood } from '../../utils/calculations';

const mealConfig: { type: MealType; label: string; emoji: string; color: string }[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🌅', color: 'bg-amber-50 border-amber-100' },
  { type: 'lunch', label: 'Lunch', emoji: '☀️', color: 'bg-green-50 border-green-100' },
  { type: 'dinner', label: 'Dinner', emoji: '🌙', color: 'bg-blue-50 border-blue-100' },
  { type: 'snack', label: 'Snacks', emoji: '🍎', color: 'bg-purple-50 border-purple-100' },
];

const macroColors = { protein: '#7c3aed', carbs: '#f59e0b', fat: '#ef4444' };

function uid() { return crypto.randomUUID(); }

export default function NutritionTracker() {
  const { user, selectedDate, getDailyLog, addFoodToMeal, removeFoodFromMeal } = useApp();
  if (!user) return null;

  const dailyLog = getDailyLog(selectedDate);
  const totals = getDailyTotals(dailyLog);

  const [showFoodModal, setShowFoodModal] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const [foodSearch, setFoodSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('');
  const [expandedMeal, setExpandedMeal] = useState<MealType | null>('breakfast');

  const caloriePercent = Math.min(100, Math.round((totals.calories / user.targetCalories) * 100));
  const caloriesLeft = user.targetCalories - totals.calories;

  const pieData = [
    { name: 'Protein', value: Math.round(totals.protein * 4), color: macroColors.protein },
    { name: 'Carbs', value: Math.round(totals.carbs * 4), color: macroColors.carbs },
    { name: 'Fat', value: Math.round(totals.fat * 9), color: macroColors.fat },
  ].filter((d) => d.value > 0);

  const filteredFoods = foodDatabase.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchCat = categoryFilter === 'All' || f.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function openModal(mealType: MealType) {
    setActiveMeal(mealType);
    setFoodSearch('');
    setCategoryFilter('All');
    setSelectedFood(null);
    setQuantity('');
    setShowFoodModal(true);
  }

  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setQuantity(String(food.servingGrams));
  }

  function addFood() {
    if (!selectedFood || !quantity) return;
    const q = Number(quantity);
    if (q <= 0) return;

    const nutrition = calculateNutritionFromFood(
      { calories: selectedFood.calories, protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat, fiber: selectedFood.fiber, servingGrams: 100 },
      q
    );

    const logged: LoggedFood = {
      id: uid(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      quantity: q,
      ...nutrition,
    };

    addFoodToMeal(selectedDate, activeMeal, logged);
    setSelectedFood(null);
    setQuantity('');
    setFoodSearch('');
    setShowFoodModal(false);
  }

  function handleRemoveFood(mealId: string, foodId: string) {
    removeFoodFromMeal(selectedDate, mealId, foodId);
  }

  const previewNutrition = selectedFood && quantity
    ? calculateNutritionFromFood(
        { calories: selectedFood.calories, protein: selectedFood.protein, carbs: selectedFood.carbs, fat: selectedFood.fat, fiber: selectedFood.fiber, servingGrams: 100 },
        Number(quantity) || 0
      )
    : null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Daily summary */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Calorie ring / progress */}
          <div>
            <h3 className="section-title mb-4">Daily Overview</h3>
            <div className="flex items-center gap-4">
              {/* Circular indicator */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={caloriePercent > 100 ? '#ef4444' : '#0d9488'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(100, caloriePercent) * 2.51327} 251.327`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">{caloriePercent}%</span>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totals.calories.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">calories consumed</p>
                </div>
                <div className={`text-sm font-semibold ${caloriesLeft >= 0 ? 'text-primary-600' : 'text-rose-500'}`}>
                  {caloriesLeft >= 0 ? `${caloriesLeft} remaining` : `${Math.abs(caloriesLeft)} over target`}
                </div>
                <p className="text-xs text-slate-400">Target: {user.targetCalories.toLocaleString()} cal</p>
              </div>
            </div>

            {/* Macro bars */}
            <div className="mt-4 space-y-2.5">
              {[
                { label: 'Protein', value: totals.protein, target: user.targetProtein, color: 'bg-violet-500' },
                { label: 'Carbs', value: totals.carbs, target: user.targetCarbs, color: 'bg-amber-400' },
                { label: 'Fat', value: totals.fat, target: user.targetFat, color: 'bg-rose-400' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{m.label}</span>
                    <span className="text-slate-500">{Math.round(m.value)}g / {m.target}g</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${m.color}`}
                      style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Macro pie chart */}
          <div>
            <h3 className="section-title mb-4">Calorie Breakdown</h3>
            {pieData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v} cal`, '']} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {[
                    { label: 'Protein', color: macroColors.protein, g: Math.round(totals.protein), cal: Math.round(totals.protein * 4) },
                    { label: 'Carbs', color: macroColors.carbs, g: Math.round(totals.carbs), cal: Math.round(totals.carbs * 4) },
                    { label: 'Fat', color: macroColors.fat, g: Math.round(totals.fat), cal: Math.round(totals.fat * 9) },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{m.label}</p>
                        <p className="text-xs text-slate-400">{m.g}g · {m.cal} cal</p>
                      </div>
                    </div>
                  ))}
                  {totals.fiber > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Fiber</p>
                        <p className="text-xs text-slate-400">{Math.round(totals.fiber)}g</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                <Apple size={32} className="opacity-30 mb-2" />
                <p className="text-sm">No food logged yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal sections */}
      {mealConfig.map((meal) => {
        const mealLog = dailyLog?.meals.find((m) => m.type === meal.type);
        const mealFoods = mealLog?.foods ?? [];
        const mealCalories = mealFoods.reduce((s, f) => s + f.calories, 0);
        const isExpanded = expandedMeal === meal.type;

        return (
          <div key={meal.type} className={`card border ${meal.color}`}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setExpandedMeal(isExpanded ? null : meal.type)}
            >
              <span className="text-xl">{meal.emoji}</span>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{meal.label}</h4>
                <p className="text-xs text-slate-500">
                  {mealFoods.length > 0 ? `${mealFoods.length} foods · ${Math.round(mealCalories)} cal` : 'Nothing logged'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openModal(meal.type); }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Plus size={13} /> Add Food
              </button>
              {isExpanded ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {mealFoods.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">
                    <p className="text-sm">No foods logged for {meal.label.toLowerCase()}</p>
                    <button onClick={() => openModal(meal.type)} className="text-primary-600 text-sm font-semibold mt-1 hover:underline">
                      Add your first food →
                    </button>
                  </div>
                ) : (
                  mealFoods.map((food) => (
                    <div key={food.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">{food.name}</p>
                        <p className="text-xs text-slate-500">{food.quantity}g · {food.calories} cal</p>
                      </div>
                      <div className="flex gap-3 text-xs text-slate-500 hidden sm:flex">
                        <span className="text-violet-600 font-medium">{Math.round(food.protein)}g P</span>
                        <span className="text-amber-500 font-medium">{Math.round(food.carbs)}g C</span>
                        <span className="text-rose-500 font-medium">{Math.round(food.fat)}g F</span>
                      </div>
                      <button
                        onClick={() => mealLog && handleRemoveFood(mealLog.id, food.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
                {mealFoods.length > 0 && (
                  <div className="flex justify-between text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 font-semibold">
                    <span>Total</span>
                    <span className="flex gap-3">
                      <span className="text-violet-600">{Math.round(mealFoods.reduce((s, f) => s + f.protein, 0))}g P</span>
                      <span className="text-amber-500">{Math.round(mealFoods.reduce((s, f) => s + f.carbs, 0))}g C</span>
                      <span className="text-rose-500">{Math.round(mealFoods.reduce((s, f) => s + f.fat, 0))}g F</span>
                      <span className="text-slate-700">{Math.round(mealCalories)} cal</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Food search modal */}
      {showFoodModal && (
        <div className="modal-overlay" onClick={() => setShowFoodModal(false)}>
          <div className="modal-content max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900">
                  Add Food to {mealConfig.find((m) => m.type === activeMeal)?.label}
                </h3>
                <button onClick={() => setShowFoodModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  placeholder="Search foods..."
                  value={foodSearch}
                  onChange={(e) => { setFoodSearch(e.target.value); setSelectedFood(null); }}
                  autoFocus
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {foodCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      categoryFilter === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex">
              {/* Food list */}
              <div className={`${selectedFood ? 'hidden sm:block sm:w-1/2 border-r border-slate-100' : 'w-full'} max-h-80 overflow-y-auto p-3 space-y-1`}>
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => selectFood(food)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      selectedFood?.id === food.id ? 'bg-primary-50 border-2 border-primary-300' : 'hover:bg-slate-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 truncate">{food.name}</p>
                      <p className="text-xs text-slate-500">{food.serving} · {food.calories} cal</p>
                    </div>
                    <div className="text-xs text-right hidden sm:block">
                      <p className="text-violet-600">{food.protein}g P</p>
                      <p className="text-amber-500">{food.carbs}g C</p>
                    </div>
                  </button>
                ))}
                {filteredFoods.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">No foods found</p>
                )}
              </div>

              {/* Food detail / quantity */}
              {selectedFood && (
                <div className="w-full sm:w-1/2 p-4 flex flex-col">
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="sm:hidden mb-3 flex items-center gap-1 text-primary-600 text-sm font-semibold"
                  >
                    ← Back to search
                  </button>
                  <h4 className="font-bold text-slate-900 mb-1">{selectedFood.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{selectedFood.category} · {selectedFood.serving}</p>

                  <label className="label">Quantity (grams)</label>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setQuantity((q) => String(Math.max(1, Number(q) - 10)))}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      className="input text-center font-bold text-lg"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity((q) => String(Number(q) + 10))}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {previewNutrition && (
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Calories</span>
                        <span className="font-bold text-slate-900">{previewNutrition.calories}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Protein</span><span className="text-violet-600 font-semibold">{previewNutrition.protein}g</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Carbs</span><span className="text-amber-500 font-semibold">{previewNutrition.carbs}g</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Fat</span><span className="text-rose-500 font-semibold">{previewNutrition.fat}g</span>
                      </div>
                      {previewNutrition.fiber > 0 && (
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Fiber</span><span className="text-emerald-600 font-semibold">{previewNutrition.fiber}g</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={addFood}
                    disabled={!quantity || Number(quantity) <= 0}
                    className="btn-primary justify-center mt-auto"
                  >
                    <Utensils size={16} /> Add to {mealConfig.find((m) => m.type === activeMeal)?.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
