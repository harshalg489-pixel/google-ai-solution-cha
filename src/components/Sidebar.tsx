import { 
  LayoutDashboard, 
  AlertTriangle, 
  Activity, 
  Settings,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'shipments', label: 'Monitor', icon: Activity },
  { id: 'risks', label: 'Intelligence', icon: AlertTriangle },
  { id: 'forecast', label: 'Forecast', icon: TrendingDown },
  { id: 'settings', label: 'Config', icon: Settings },
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="w-56 bg-surface border-r border-border flex flex-col pt-6">
      <div className="px-5 mb-8 flex items-center gap-2">
        <h1 className="text-lg font-black tracking-widest text-white">LOGISTI<span className="text-accent-high">Q</span></h1>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[11px] font-bold transition-all group uppercase tracking-wider",
                isActive 
                  ? "bg-white/5 text-accent-high" 
                  : "text-text-dim hover:text-text-main hover:bg-white/2"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-accent-high" : "text-text-dim/50 group-hover:text-text-dim")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="px-3 py-2 rounded border border-accent-safe/30 bg-accent-safe/5">
          <p className="text-[9px] font-bold text-accent-safe/60 uppercase tracking-widest mb-1 font-mono">Status: Active</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-safe shadow-[0_0_8px_rgba(54,211,153,0.5)]" />
            <span className="text-[10px] font-mono text-accent-safe">CONFIDENCE: 98.4%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
