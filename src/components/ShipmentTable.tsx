import { Shipment } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ShipmentTableProps {
  shipments: Shipment[];
}

export function ShipmentTable({ shipments }: ShipmentTableProps) {
  const statusStyles = {
    'In Transit': 'text-accent-safe/80',
    'Delayed': 'text-accent-crit/80',
    'At Port': 'text-accent-high/80',
    'Pending': 'text-text-dim/80',
  };

  return (
    <div className="rounded bg-surface border border-border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-bg uppercase font-mono text-[9px] font-bold text-text-dim tracking-widest italic">
          <tr>
            <th className="px-4 py-3 border-b border-border">UID</th>
            <th className="px-4 py-3 border-b border-border">CORRIDOR</th>
            <th className="px-4 py-3 border-b border-border">STATUS</th>
            <th className="px-4 py-3 border-b border-border">ETA</th>
            <th className="px-4 py-3 border-b border-border text-right">VOL</th>
            <th className="px-4 py-3 border-b border-border text-right">VALUE</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {shipments.map((s) => (
            <tr key={s.id} className="hover:bg-white/2 transition-colors group cursor-pointer border-b border-border/20 last:border-0 text-[11px]">
              <td className="px-4 py-2 font-bold text-accent-high">{s.id}</td>
              <td className="px-4 py-2">
                <span className="text-text-main font-bold">{s.origin}</span>
                <span className="text-text-dim mx-2 opacity-30">→</span>
                <span className="text-text-dim">{s.destination}</span>
              </td>
              <td className="px-4 py-2 font-bold uppercase text-[10px]">
                <span className={statusStyles[s.status]}>{s.status}</span>
              </td>
              <td className="px-4 py-2 text-text-dim">{s.eta}</td>
              <td className="px-4 py-2 text-right text-text-main">{s.volume}</td>
              <td className="px-4 py-2 text-right font-bold text-accent-safe/70">
                ${(s.value / 1000).toLocaleString()}K
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
