import { useState, useEffect } from 'react';
import { Activity, AlertOctagon, Package, DollarSign, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { RiskAlertCard } from './RiskAlertCard';
import { RecommendationCard } from './RecommendationCard';
import { ForecastPanel } from './ForecastPanel';
import { AnalysisResult, RiskAlert } from '../types';
import { MOCK_SHIPMENTS, RAW_SNAPSHOT } from '../constants';
import { analyzeLogistics } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  activeSection: string;
}

export function Dashboard({ activeSection = 'dashboard' }: DashboardProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeLogistics(MOCK_SHIPMENTS, RAW_SNAPSHOT);
      setAnalysis(result);
      if (result.alerts.length > 0) {
        setSelectedAlertId(result.alerts[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis();
  }, []);

  const totalValue = MOCK_SHIPMENTS.reduce((sum, s) => sum + s.value, 0);
  const totalVolume = MOCK_SHIPMENTS.reduce((sum, s) => sum + s.volume, 0);

  const selectedRecommendations = (selectedAlertId && analysis?.recommendations) 
    ? analysis.recommendations[selectedAlertId] 
    : [];

  const isRisksMode = activeSection === 'risks';
  const isForecastMode = activeSection === 'forecast';

  return (
    <div className="space-y-4 pb-8">
      {/* Dynamic Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isForecastMode ? (
          <>
            <StatCard title="Prop. Confidence" value="94.2%" trend="Stable" trendUp icon={<Zap className="w-4 h-4" />} />
            <StatCard title="Cascade Depth" value="L4" icon={<Activity className="w-4 h-4" />} delay={0.05} />
            <StatCard title="Secondary Risk" value="High" icon={<AlertCircle className="w-4 h-4" />} delay={0.1} />
            <StatCard title="Nodes Affected" value="12" icon={<Package className="w-4 h-4" />} delay={0.15} />
          </>
        ) : isRisksMode ? (
          <>
            <StatCard title="Severe Alerts" value={analysis?.alerts.filter(a => a.severity === 'Critical').length || 0} icon={<AlertOctagon className="w-4 h-4 text-accent-crit" />} />
            <StatCard title="Signal Strength" value="Elite" icon={<Zap className="w-4 h-4 text-accent-high" />} delay={0.05} />
            <StatCard title="Active Scans" value="142/s" icon={<Activity className="w-4 h-4" />} delay={0.1} />
            <StatCard title="Intelligence Sync" value="Live" icon={<RefreshCw className="w-4 h-4 text-accent-safe" />} delay={0.15} />
          </>
        ) : (
          <>
            <StatCard title="Active Units" value={MOCK_SHIPMENTS.length} trend="+12" icon={<Package className="w-4 h-4" />} />
            <StatCard title="Total Volume" value={`${totalVolume} TEU`} trend="+4" icon={<Activity className="w-4 h-4" />} delay={0.05} />
            <StatCard title="Network Value" value={`$${(totalValue / 1000000).toFixed(2)}M`} icon={<DollarSign className="w-4 h-4" />} delay={0.1} />
            <StatCard 
              title="Risk Alerts" 
              value={analysis?.alerts.length || 0} 
              trend={analysis?.alerts.filter(a => a.severity === 'Critical').length.toString()} 
              icon={<AlertOctagon className={cn("w-4 h-4", analysis?.alerts.length ? 'text-accent-high' : 'text-text-dim')} />} 
              delay={0.15} 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Risk Intelligence Column (Conditional width) */}
        <div className={cn(
          "space-y-3 transition-all duration-500",
          isRisksMode ? "lg:col-span-12" : isForecastMode ? "lg:col-span-3" : "lg:col-span-4"
        )}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2 font-mono">
              <Zap className="w-3 h-3 text-accent-high" /> 
              {isRisksMode ? 'Global Signal Intelligence Terminal' : 'Signal Feeds'}
            </h3>
            <button 
              onClick={performAnalysis}
              className="p-1 rounded bg-surface border border-border text-text-dim hover:text-accent-high transition-all disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className={cn(
            "space-y-2 overflow-y-auto pr-1 custom-scrollbar transition-all",
            isRisksMode ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 space-y-0" : "max-h-[600px]"
          )}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded bg-surface border border-border animate-pulse" />
              ))
            ) : analysis?.alerts.map((alert, i) => (
              <RiskAlertCard 
                key={alert.id} 
                alert={alert} 
                delay={i * 0.05} 
                isSelected={selectedAlertId === alert.id}
                onClick={() => setSelectedAlertId(alert.id)}
              />
            ))}
          </div>
        </div>

        {/* Forecast & Recommendations Column (Conditional appearance) */}
        {!isRisksMode && (
          <div className={cn(
            "flex flex-col gap-4 transition-all duration-500",
            isForecastMode ? "lg:col-span-9" : "lg:col-span-8"
          )}>
            {/* Executive Summary (Only in Dashboard) */}
            {!isForecastMode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded bg-surface border border-border flex flex-col gap-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[9px] font-bold text-text-dim uppercase tracking-widest font-mono">
                    🧠 Executive Summary
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-accent-crit uppercase tracking-tight">Immediate Exposure Risk: High</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded bg-accent-crit/10 border border-accent-crit/20 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-accent-crit" />
                  </div>
                  <p className="text-[12px] text-text-main leading-relaxed font-medium">
                    {loading ? 'Synthesizing global network data...' : analysis?.summary}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Forecast & Recommendations Grid */}
            <div className={cn(
              "grid grid-cols-1 gap-4 flex-1",
              isForecastMode ? "md:grid-cols-1" : "md:grid-cols-2"
            )}>
              <div className="space-y-3">
                 <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest font-mono italic">
                   {isForecastMode ? '🚀 Advanced Network Propagation Simulation' : '🔮 Cascade Forecast'}
                 </h3>
                 {loading ? (
                   <div className="h-40 rounded bg-surface border border-border animate-pulse" />
                 ) : (
                  <div className={cn(isForecastMode && "grid grid-cols-1 lg:grid-cols-2 gap-4")}>
                    <ForecastPanel forecasts={analysis?.forecast || []} />
                  </div>
                 )}
              </div>

              {!isForecastMode && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest font-mono">🔁 Response Options</h3>
                  <div className="space-y-2">
                    {loading ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-40 rounded bg-surface border border-border animate-pulse" />
                      ))
                    ) : Array.isArray(selectedRecommendations) && selectedRecommendations.length > 0 ? (
                      selectedRecommendations.map((opt: any, i: number) => (
                        <RecommendationCard key={i} option={opt} delay={i * 0.05} />
                      ))
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center border border-dashed border-border rounded text-text-dim/30">
                        <p className="text-[10px] font-mono uppercase">Select disruption for counter-measures</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* In Forecast Mode, maybe add a timeline or simulation details */}
            {isForecastMode && (
              <div className="p-4 rounded border border-border bg-surface/30 border-dashed">
                 <h4 className="text-[9px] font-bold text-text-dim uppercase tracking-widest mb-2 font-mono italic">Propagation Simulation Log</h4>
                 <div className="space-y-1 font-mono text-[9px] text-text-dim opacity-60">
                    <p>[09:22:15] Initiating 48-hour network impact scan...</p>
                    <p>[09:22:15] identified secondary congestion points at Hamburg (DE) and Rotterdam (NL)</p>
                    <p>[09:22:16] Calculating volume rerouting coefficients for SHP-1002...</p>
                    <p>[09:22:17] Simulation complexity L4 reached. Convergence achieved.</p>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
