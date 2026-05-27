import { useState } from 'react';
import { Menu, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import { useApp } from '../../contexts/AppContext';
import Dashboard from '../dashboard/Dashboard';
import WorkoutTracker from '../workout/WorkoutTracker';
import NutritionTracker from '../nutrition/NutritionTracker';
import ProgressDashboard from '../progress/ProgressDashboard';
import CoachingPanel from '../coaching/CoachingPanel';

const viewTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your daily wellness overview' },
  workout: { title: 'Workout Tracker', subtitle: 'Log and track your training sessions' },
  nutrition: { title: 'Nutrition', subtitle: 'Track meals, calories & macros' },
  progress: { title: 'Progress & Analytics', subtitle: 'Charts and trends over time' },
  coaching: { title: 'Personal Coaching', subtitle: 'Tailored recommendations for you' },
};

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function showDateNav(view: string): boolean {
  return view === 'workout' || view === 'nutrition';
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentView, selectedDate, setSelectedDate } = useApp();

  const meta = viewTitles[currentView];

  function changeDate(delta: number) {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d <= today) {
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  }

  function renderView() {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'workout': return <WorkoutTracker />;
      case 'nutrition': return <NutritionTracker />;
      case 'progress': return <ProgressDashboard />;
      case 'coaching': return <CoachingPanel />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex-shrink-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900">{meta.title}</h2>
            <p className="text-xs text-slate-500 hidden sm:block">{meta.subtitle}</p>
          </div>

          {/* Date navigation for workout/nutrition */}
          {showDateNav(currentView) && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <button
                onClick={() => changeDate(-1)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-slate-700 min-w-[80px] text-center">
                {formatDateDisplay(selectedDate)}
              </span>
              <button
                onClick={() => changeDate(1)}
                disabled={selectedDate === new Date().toISOString().split('T')[0]}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
