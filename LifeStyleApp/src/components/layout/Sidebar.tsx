import { Activity, BarChart3, Brain, Home, Salad, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppView } from '../../types';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, description: 'Overview & stats' },
  { id: 'workout', label: 'Workout', icon: <Activity size={20} />, description: 'Log & track training' },
  { id: 'nutrition', label: 'Nutrition', icon: <Salad size={20} />, description: 'Meals & macros' },
  { id: 'progress', label: 'Progress', icon: <BarChart3 size={20} />, description: 'Charts & history' },
  { id: 'coaching', label: 'Coaching', icon: <Brain size={20} />, description: 'Personalized tips' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { currentView, setCurrentView, user } = useApp();

  function navigate(view: AppView) {
    setCurrentView(view);
    onClose();
  }

  const goalLabels: Record<string, string> = {
    lose_weight: 'Weight Loss',
    gain_muscle: 'Muscle Gain',
    maintain: 'Maintenance',
    improve_endurance: 'Endurance',
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-slate-900 z-50 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">LifeCoach</h1>
                <p className="text-slate-500 text-xs">Wellness Platform</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User card */}
        {user && (
          <div className="mx-4 mt-4 p-4 bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center ring-2 ring-primary-600/30">
                <span className="text-primary-400 font-bold text-sm">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className="text-primary-400 text-xs font-medium">{goalLabels[user.goal]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 py-2 text-slate-600 text-xs font-semibold uppercase tracking-wider">Navigation</p>
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`nav-item w-full text-left ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <span className={active ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-300'}`}>{item.label}</p>
                  <p className={`text-xs truncate ${active ? 'text-primary-200' : 'text-slate-600'}`}>{item.description}</p>
                </div>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary-300 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom stats */}
        {user && (
          <div className="p-4 border-t border-slate-800">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.weight}<span className="text-slate-500 text-xs">kg</span></p>
                <p className="text-slate-600 text-xs">Weight</p>
              </div>
              <div className="text-center border-x border-slate-800">
                <p className="text-white font-bold text-sm">{user.targetCalories}<span className="text-slate-500 text-xs">cal</span></p>
                <p className="text-slate-600 text-xs">Target</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{user.age}<span className="text-slate-500 text-xs">yr</span></p>
                <p className="text-slate-600 text-xs">Age</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
