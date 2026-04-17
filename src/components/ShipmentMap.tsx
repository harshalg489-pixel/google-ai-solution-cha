import { useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { Shipment } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Info, Anchor, Navigation, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ShipmentMapProps {
  shipments: Shipment[];
}

export function ShipmentMap({ shipments }: ShipmentMapProps) {
  const [tooltip, setTooltip] = useState<Shipment | null>(null);

  const statusColors = {
    'In Transit': '#36D399', // accent-safe
    'Delayed': '#FF4D4D',    // accent-crit
    'At Port': '#F9A03F',    // accent-high
    'Pending': '#9499A1',    // text-dim
  };

  return (
    <div className="relative w-full h-[600px] bg-surface rounded border border-border overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-bg/80 backdrop-blur-md p-3 rounded border border-border shadow-2xl">
          <h4 className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2 font-mono italic">Map Legend</h4>
          <div className="space-y-1.5">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-bold text-text-main uppercase tracking-tighter">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ComposableMap
        projectionConfig={{
          scale: 180,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0A0B0D"
                  stroke="#2D3139"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#16181D", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {shipments.map((s) => (
            <Marker 
              key={s.id} 
              coordinates={[s.currentLng, s.currentLat]}
              onMouseEnter={() => setTooltip(s)}
              onMouseLeave={() => setTooltip(null)}
            >
              <g className="cursor-pointer group/marker">
                <circle 
                  r={4} 
                  fill={statusColors[s.status]} 
                  className={cn(
                    "transition-all duration-300",
                    s.status === 'Delayed' && "animate-pulse"
                  )}
                />
                <circle 
                  r={8} 
                  fill={statusColors[s.status]} 
                  fillOpacity={0.2}
                  className="animate-ping"
                />
                {/* Visual anchor for precision */}
                <line 
                  x1="0" y1="0" 
                  x2="0" y2="10" 
                  stroke={statusColors[s.status]} 
                  strokeWidth={1} 
                  strokeDasharray="2 2"
                  className="opacity-0 group-hover/marker:opacity-100 transition-opacity"
                />
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Manual Overlay Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 right-6 w-64 bg-bg/95 backdrop-blur-md border border-accent-high/30 p-4 rounded shadow-2xl z-20"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-accent-high font-mono tracking-widest">{tooltip.id}</span>
                <h5 className="text-[12px] font-bold text-text-main mt-0.5 uppercase tracking-tight">Active In-Network</h5>
              </div>
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: statusColors[tooltip.status],
                  boxShadow: `0 0 8px ${statusColors[tooltip.status]}`
                }} 
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-3 h-3 text-text-dim" />
                <span className="text-[10px] text-text-main font-bold truncate">
                  {tooltip.origin} <span className="text-text-dim opacity-30 text-[8px]">→</span> {tooltip.destination}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-text-dim" />
                  <span className="text-[9px] font-mono text-text-dim">COORD: {tooltip.currentLat.toFixed(2)}, {tooltip.currentLng.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-t border-border">
              <div>
                <p className="text-[8px] font-bold text-text-dim uppercase tracking-tighter">Status</p>
                <p className={cn("text-[10px] font-bold uppercase", 
                  tooltip.status === 'Delayed' ? "text-accent-crit" : "text-accent-safe"
                )}>{tooltip.status}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-text-dim uppercase tracking-tighter">ETA</p>
                <p className="text-[10px] font-bold text-text-main font-mono">{tooltip.eta}</p>
              </div>
            </div>

            {tooltip.status === 'Delayed' && (
              <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-accent-crit/10 border border-accent-crit/20 rounded">
                <AlertTriangle className="w-3 h-3 text-accent-crit" />
                <span className="text-[9px] font-bold text-accent-crit uppercase tracking-tight italic">Reroute Advised</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 text-[9px] font-mono text-text-dim opacity-30 flex items-center gap-2 pointer-events-none uppercase tracking-widest">
        <Anchor className="w-3 h-3" />
        Geospatial Network Grid // v2.5
      </div>
    </div>
  );
}
