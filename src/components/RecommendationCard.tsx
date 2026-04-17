import { CheckCircle2, AlertCircle, TrendingDown, Clock, DollarSign, Shield } from 'lucide-react';
import { RouteOption } from '../types';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RecommendationCardProps {
  key?: string | number;
  option: RouteOption;
  delay?: number;
}

export function RecommendationCard({ option, delay = 0 }: RecommendationCardProps) {
  const isAuto = option.decision === 'AUTO-EXECUTE';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-3.5 rounded bg-surface border border-border flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-text-main text-xs uppercase">{option.name}</h4>
          <p className="text-[9px] font-mono text-text-dim mt-0.5 tracking-tighter truncate max-w-[220px]">{option.route}</p>
        </div>
        <div className={cn(
          "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
          isAuto ? "bg-blue-900/40 text-blue-400" : "bg-text-dim/10 text-text-dim"
        )}>
          {option.decision.replace(' REQUIRED', '')}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 py-2 border-y border-border/30">
        <div className="flex flex-col">
          <span className="text-[8px] text-text-dim uppercase font-bold font-mono">Time</span>
          <span className={cn("text-[10px] font-bold font-mono", option.timeDelta.includes('+') ? "text-accent-crit" : "text-accent-safe")}>
            {option.timeDelta}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-text-dim uppercase font-bold font-mono">Cost</span>
          <span className={cn("text-[10px] font-bold font-mono", option.costDelta.includes('+') ? "text-accent-crit" : "text-accent-safe")}>
            {option.costDelta}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] text-text-dim uppercase font-bold font-mono">Reliability</span>
          <span className="text-[10px] font-bold text-text-main font-mono">{option.reliabilityScore}%</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] text-text-dim uppercase font-bold font-mono">Risk Red.</span>
          <span className="text-[10px] font-bold text-accent-safe font-mono">-{option.riskReduction}%</span>
        </div>
      </div>

      <div className="mt-1">
        <p className="text-[10px] text-text-dim leading-relaxed italic line-clamp-2">"{option.reasoning}"</p>
      </div>

      <button className={cn(
        "w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
        isAuto ? "bg-border text-text-dim cursor-not-allowed" : "bg-accent-crit text-white hover:bg-accent-crit/90"
      )}>
        {isAuto ? 'AUTO-PROCESSING' : 'AUTHORIZE ACTION'}
      </button>
    </motion.div>
  );
}
