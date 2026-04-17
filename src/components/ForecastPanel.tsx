import { CascadeForecast } from '../types';
import { motion } from 'motion/react';
import { Network, ArrowRight } from 'lucide-react';

interface ForecastPanelProps {
  forecasts: CascadeForecast[];
}

export function ForecastPanel({ forecasts }: ForecastPanelProps) {
  if (!forecasts?.length) return (
    <div className="h-40 flex flex-col items-center justify-center border border-border bg-surface/50 rounded gap-2">
      <Network className="w-6 h-6 text-border" />
      <p className="text-text-dim text-[10px] font-mono lowercase tracking-wider">No propagation signals</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {forecasts.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-4 rounded bg-surface border border-border group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
               <h4 className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-3 font-mono">Causal Chain</h4>
               <div className="flex flex-wrap items-center gap-2">
                 {f.causalChain.map((step, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                     <div className="px-2 py-0.5 rounded-sm bg-border/40 text-[10px] font-bold text-text-main border border-border/50">
                       {step}
                     </div>
                     {idx < f.causalChain.length - 1 && (
                       <ArrowRight className="w-2.5 h-2.5 text-text-dim/50" />
                     )}
                   </div>
                 ))}
               </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-1 font-mono">Likelihood</span>
               <span className="text-xl font-bold tracking-tighter text-accent-high font-mono">{f.propagationLikelihood}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/20">
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase tracking-tighter mb-0.5">Secondary Vol.</p>
              <p className="text-[11px] font-bold text-text-main font-mono">+{f.downstreamEffects.additionalShipments}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase tracking-tighter mb-0.5">Prop. Delay</p>
              <p className="text-[11px] font-bold text-text-main font-mono">{f.downstreamEffects.secondaryDelays}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-text-dim uppercase tracking-tighter mb-0.5">Network Risk</p>
              <p className={`text-[11px] font-bold ${f.downstreamEffects.networkCongestionRisk.toLowerCase().includes('high') ? 'text-accent-crit' : 'text-accent-high'}`}>
                {f.downstreamEffects.networkCongestionRisk}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
