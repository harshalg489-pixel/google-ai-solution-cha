import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Cpu, 
  Command, 
  Zap, 
  Activity, 
  Terminal,
  Server,
  Database,
  Lock,
  Eye,
  Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Settings() {
  const settingsSections = [
    {
      id: 'intelligence',
      title: 'Neural Engine',
      icon: <Cpu className="w-3.5 h-3.5" />,
      items: [
        { label: 'Primary Intelligence', value: 'gemini-3-flash-preview', type: 'status' },
        { label: 'Reasoning Mode', value: 'High Density Inference', type: 'status' },
        { label: 'Autonomous Response', status: true, type: 'toggle' },
        { label: 'Probabilistic Confidence Floor', value: '85%', type: 'range' },
      ]
    },
    {
      id: 'network',
      title: 'Network Operations',
      icon: <Activity className="w-3.5 h-3.5" />,
      items: [
        { label: 'Feed Sync Frequency', value: '500ms', type: 'status' },
        { label: 'Diagnostic Verbosity', value: 'Extended', type: 'select' },
        { label: 'Global Node Encryption', status: true, type: 'toggle' },
        { label: 'Carrier API Tunneling', status: true, type: 'toggle' },
      ]
    },
    {
      id: 'alerts',
      title: 'Disruption Protocols',
      icon: <Bell className="w-3.5 h-3.5" />,
      items: [
        { label: 'Critical Alert Sensitivity', value: 'High', type: 'status' },
        { label: 'Cascading Propagation Depth', value: 'L4', type: 'status' },
        { label: 'SLA Breach Threshold', value: '$10k/hr', type: 'range' },
        { label: 'Automated Rerouting', status: true, type: 'toggle' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column: System Status */}
      <div className="lg:col-span-1 space-y-4">
        <div className="p-4 rounded bg-surface border border-border flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent-high/10 border border-accent-high/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-accent-high" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-main uppercase tracking-widest leading-none">LogistiQ OS</h3>
              <p className="text-[9px] text-text-dim font-mono mt-1">INTERNAL_VERSION // v2.5.0-STABLE</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50">
             <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-dim uppercase tracking-tighter flex items-center gap-1.5"><Server className="w-3 h-3"/> Core Load</span>
                <span className="text-accent-safe font-bold">14.2%</span>
             </div>
             <div className="w-full h-1 bg-bg rounded overflow-hidden">
                <div className="h-full bg-accent-safe w-[14%]" />
             </div>
             <div className="flex justify-between items-center text-[10px] font-mono mt-2">
                <span className="text-text-dim uppercase tracking-tighter flex items-center gap-1.5"><Database className="w-3 h-3"/> Cache Latency</span>
                <span className="text-accent-safe font-bold">1.2ms</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-mono mt-2">
                <span className="text-text-dim uppercase tracking-tighter flex items-center gap-1.5"><Lock className="w-3 h-3"/> Network Integrity</span>
                <span className="text-accent-safe font-bold">VERIFIED</span>
             </div>
          </div>
        </div>

        <div className="p-4 rounded bg-bg border border-border border-dashed">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-3.5 h-3.5 text-text-dim" />
            <h4 className="text-[9px] font-bold text-text-dim uppercase tracking-widest font-mono">Live Logs</h4>
          </div>
          <div className="space-y-1.5 font-mono text-[9px] leading-tight">
            <p className="text-text-dim italic opacity-50">[09:12:44] SYS: HANDSHAKE_SUCCESS with LongBeach_Node</p>
            <p className="text-accent-high">[09:12:47] INT: DETECTED_ANOMALY in SHP1004 corridor</p>
            <p className="text-text-dim">[09:12:51] SYS: CASCADE_SIMULATION_DEPTH_L4_COMPLETE</p>
            <p className="text-accent-safe">[09:12:55] AGT: RESPONSE_STRATEGY_GENERATED_UUID_8821</p>
            <div className="flex items-center gap-1 animate-pulse text-accent-high">
              <span>_</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Right: Settings Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsSections.map((section, idx) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded bg-surface border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="text-accent-high opacity-80">{section.icon}</div>
                <h3 className="text-[10px] font-bold text-text-main uppercase tracking-widest">{section.title}</h3>
              </div>

              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-[10px] text-text-dim font-bold tracking-tight group-hover:text-text-main transition-colors">{item.label}</span>
                    
                    {item.type === 'status' && (
                      <span className="text-[10px] font-mono text-accent-high font-bold">{item.value}</span>
                    )}

                    {item.type === 'toggle' && (
                      <div className={cn(
                        "w-7 h-4 rounded-full relative transition-colors cursor-pointer",
                        item.status ? "bg-accent-high/20 border border-accent-high/50" : "bg-bg border border-border"
                      )}>
                        <div className={cn(
                          "absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all",
                          item.status ? "right-0.5 bg-accent-high" : "left-0.5 bg-text-dim"
                        )} />
                      </div>
                    )}

                    {item.type === 'range' && (
                      <div className="flex items-center gap-2">
                         <div className="w-20 h-1 bg-bg rounded overflow-hidden border border-border">
                            <div className="h-full bg-accent-high/50 w-[85%]" />
                         </div>
                         <span className="text-[10px] font-mono text-text-main">{item.value}</span>
                      </div>
                    )}

                    {item.type === 'select' && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg border border-border text-[9px] font-bold text-text-dim cursor-pointer hover:border-accent-high/50 transition-colors uppercase">
                        {item.value} <Command className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Special Protocol Card */}
          <div className="p-4 rounded bg-surface border border-accent-high/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 opacity-5">
               <ShieldCheck className="w-24 h-24 text-accent-high" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-accent-high uppercase tracking-widest mb-1 flex items-center gap-1.5 font-mono italic">
                 <Zap className="w-3 h-3" /> Hyper-Intelligence Mode
              </h4>
              <p className="text-[10px] text-text-dim leading-relaxed">
                 Enables sub-second rerouting calculations across global multimodal carriers. Priority allocation enabled.
              </p>
            </div>
            <button className="mt-4 w-full py-2 rounded bg-accent-high/10 border border-accent-high/30 text-[10px] font-bold text-accent-high uppercase tracking-tighter hover:bg-accent-high text-white transition-all">
               Activate Protocol Omega
            </button>
          </div>
        </div>

        {/* Network Topology Visualization Placeholder */}
        <div className="p-4 rounded bg-surface border border-border">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2 font-mono">
                 <Server className="w-3.5 h-3.5" /> Edge Node Grid Status
              </h3>
              <span className="text-[9px] font-mono text-accent-safe">UPTIME: 99.999%</span>
           </div>
           <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="h-2 rounded-sm bg-accent-safe/20 border border-accent-safe/30" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-2 rounded-sm bg-accent-med/20 border border-accent-med/30 animate-pulse" />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
