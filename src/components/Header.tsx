import { useState, useRef, useEffect } from 'react';
import { Bell, Search, AlertTriangle, Info, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  activeSection: string;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Port Congestion Spike', detail: 'Shanghai Port dwell time > 72h', time: '2m ago' },
  { id: 2, type: 'warning', title: 'Weather Warning', detail: 'Tropical Storm Nexus trajectory shift', time: '15m ago' },
  { id: 3, type: 'info', title: 'System Batch Complete', detail: 'Asset list synchronized with v2.5', time: '1h ago' },
];

export function Header({ activeSection }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const titles: Record<string, string> = {
    dashboard: 'Logistics Overview',
    shipments: 'Real-time Shipment Monitor',
    risks: 'Disruption Intelligence',
    forecast: 'Cascade Impact Forecast',
    settings: 'System Configuration',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-bg px-6 flex items-center justify-between z-30 relative">
      <div className="flex items-center gap-3">
        <span className="text-text-dim font-mono text-[10px] uppercase tracking-widest opacity-50">{activeSection}</span>
        <h2 className="text-sm font-bold tracking-tight text-white uppercase">{titles[activeSection]}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 text-text-dim absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-accent-high transition-colors" />
          <input 
            type="text" 
            placeholder="Search network symbols..."
            className="bg-surface border border-border rounded px-9 py-1 text-[11px] focus:outline-none focus:border-border/50 focus:ring-1 focus:ring-accent-high/20 w-56 transition-all font-mono"
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-1.5 text-text-dim hover:text-white transition-all rounded hover:bg-white/5",
              showNotifications && "text-accent-high bg-white/10"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-high rounded-full border border-bg shadow-[0_0_8px_rgba(249,160,63,0.5)]" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 bg-bg/95 backdrop-blur-md border border-border rounded shadow-2xl z-40 overflow-hidden"
              >
                <div className="p-3 border-b border-border bg-surface/50 flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest font-mono italic">Operational Alerts</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-text-dim hover:text-white"><X className="w-3 h-3"/></button>
                </div>
                
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="p-3 border-b border-border/50 hover:bg-white/2 cursor-pointer transition-colors group">
                      <div className="flex gap-3">
                        <div className={cn(
                          "mt-0.5 p-1 rounded-sm border shrink-0",
                          n.type === 'critical' ? "bg-accent-crit/10 border-accent-crit/30 text-accent-crit" : 
                          n.type === 'warning' ? "bg-accent-high/10 border-accent-high/30 text-accent-high" :
                          "bg-accent-safe/10 border-accent-safe/30 text-accent-safe"
                        )}>
                          {n.type === 'critical' ? <AlertTriangle className="w-3 h-3" /> : 
                           n.type === 'warning' ? <Zap className="w-3 h-3" /> : 
                           <Info className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[11px] font-bold text-text-main group-hover:text-accent-high transition-colors">{n.title}</span>
                            <span className="text-[8px] font-mono text-text-dim">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-text-dim leading-tight">{n.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2 bg-surface text-[9px] font-bold text-text-dim uppercase tracking-widest hover:text-white transition-colors">
                  Clear All Directives
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-[11px] font-bold text-text-main">HARSHAL G.</p>
            <p className="text-[9px] text-text-dim font-mono uppercase">ID: SC_7</p>
          </div>
          <div className="w-7 h-7 rounded border border-border overflow-hidden ring-1 ring-border group-hover:ring-accent-high transition-all">
            <img 
              src="https://picsum.photos/seed/harshal/28/28" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
