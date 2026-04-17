import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ShipmentTable } from './components/ShipmentTable';
import { ShipmentMap } from './components/ShipmentMap';
import { Settings } from './components/Settings';
import { MOCK_SHIPMENTS } from './constants';
import { LayoutGrid, Map as MapIcon, Share2, Plus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [shipmentView, setShipmentView] = useState<'table' | 'map'>('table');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard activeSection={activeSection} />;
      case 'shipments':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded bg-surface border border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase text-text-main font-mono italic">
                  Fleet Monitor // {MOCK_SHIPMENTS.length} Assets
                </h3>
                <p className="text-[11px] text-text-dim mt-0.5 tracking-tight uppercase select-none">Global network status: Continuous tracking active</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-bg border border-border rounded mr-4">
                  <button 
                    onClick={() => setShipmentView('table')}
                    className={cn(
                      "p-1.5 rounded transition-all",
                      shipmentView === 'table' ? "bg-surface text-accent-high shadow-lg" : "text-text-dim hover:text-text-main"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setShipmentView('map')}
                    className={cn(
                      "p-1.5 rounded transition-all",
                      shipmentView === 'map' ? "bg-surface text-accent-high shadow-lg" : "text-text-dim hover:text-text-main"
                    )}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button className="px-3 py-1.5 rounded border border-border text-[10px] font-bold text-text-dim hover:text-text-main hover:bg-white/2 transition-all flex items-center gap-1.5 uppercase tracking-wider">
                  <Share2 className="w-3 h-3" /> Export
                </button>
                <button className="px-3 py-1.5 rounded bg-accent-high text-black text-[10px] font-bold hover:bg-accent-high/90 transition-all flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="w-3 h-3 stroke-[3]" /> Add Unit
                </button>
              </div>
            </div>
            
            {shipmentView === 'table' ? (
              <ShipmentTable shipments={MOCK_SHIPMENTS} />
            ) : (
              <ShipmentMap shipments={MOCK_SHIPMENTS} />
            )}
          </div>
        );
      case 'risks':
      case 'forecast':
        return <Dashboard activeSection={activeSection} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard activeSection={activeSection} />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Layout>
  );
}

