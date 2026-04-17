import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  delay?: number;
}

export function StatCard({ title, value, trend, trendUp, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-3.5 rounded bg-surface border border-border group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-text-dim group-hover:text-accent-high transition-colors">
          {icon}
        </div>
        {trend && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${trendUp ? 'bg-accent-safe/10 text-accent-safe' : 'bg-accent-crit/10 text-accent-crit'}`}>
             {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-0.5 font-mono">{title}</p>
        <p className="text-xl font-bold tracking-tighter text-text-main">{value}</p>
      </div>
    </motion.div>
  );
}
