import { AlertTriangle, MapPin, Gauge } from 'lucide-react';
import { RiskAlert } from '../types';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RiskAlertCardProps {
  key?: string | number;
  alert: RiskAlert;
  delay?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export function RiskAlertCard({ alert, delay = 0, onClick, isSelected }: RiskAlertCardProps) {
  const severityBadge = {
    Critical: 'bg-accent-crit/15 text-accent-crit border-accent-crit',
    High: 'bg-accent-high/15 text-accent-high border-accent-high',
    Medium: 'bg-accent-med/15 text-accent-med border-accent-med',
    Low: 'bg-accent-safe/15 text-accent-safe border-accent-safe',
  };

  const severityText = {
    Critical: 'text-accent-crit',
    High: 'text-accent-high',
    Medium: 'text-accent-med',
    Low: 'text-accent-safe',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "p-3 rounded border border-border cursor-pointer relative transition-all",
        isSelected ? "bg-accent-high/5 border-accent-high/30" : "hover:bg-white/2 bg-surface",
        "border-l-2",
        alert.severity === 'Critical' ? "border-l-accent-crit" : 
        alert.severity === 'High' ? "border-l-accent-high" :
        alert.severity === 'Medium' ? "border-l-accent-med" : "border-l-accent-safe"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider", severityBadge[alert.severity])}>
            {alert.severity}
          </span>
          <span className="text-[9px] font-mono text-text-dim uppercase tracking-tighter">CONFIDENCE: {alert.confidence}%</span>
        </div>
      </div>

      <h3 className="font-bold text-sm text-text-main mb-2 truncate max-w-[280px]">{alert.description}</h3>

      <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-2.5 h-2.5 text-text-dim" />
          <span className="text-[9px] font-mono text-text-dim truncate">{alert.nodes}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Gauge className="w-2.5 h-2.5 text-text-dim" />
          <span className="text-[9px] font-mono text-text-dim">{alert.impact.delayWindow}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-text-dim uppercase font-bold tracking-tighter">Impact Volume</span>
          <span className="text-[11px] font-bold text-text-main">{alert.impact.shipmentsAffected} Units</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-text-dim font-mono uppercase">Signal:</span>
          <span className={cn("text-[9px] font-bold uppercase", severityText[alert.severity])}>{alert.signalType}</span>
        </div>
      </div>
    </motion.div>
  );
}
