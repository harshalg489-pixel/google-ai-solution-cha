export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type SignalType = 'weather' | 'congestion' | 'carrier' | 'geopolitical' | 'anomaly';

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delayed' | 'At Port' | 'Pending';
  eta: string;
  volume: number;
  value: number;
  currentLat: number;
  currentLng: number;
}

export interface RiskAlert {
  id: string;
  signalType: SignalType;
  nodes: string; // origin -> transit -> destination
  severity: Severity;
  confidence: number;
  impact: {
    shipmentsAffected: number;
    delayWindow: string; // X–X hours/days
  };
  description: string;
}

export interface CascadeForecast {
  propagationLikelihood: number;
  causalChain: string[];
  downstreamEffects: {
    additionalShipments: number;
    secondaryDelays: string;
    networkCongestionRisk: string;
  };
}

export interface RouteOption {
  id: string;
  name: string;
  route: string;
  timeDelta: string; // +/- X hours
  costDelta: string; // +/- X%
  reliabilityScore: number;
  riskReduction: number;
  decision: 'AUTO-EXECUTE' | 'HUMAN APPROVAL REQUIRED';
  reasoning: string;
}

export interface AnalysisResult {
  alerts: RiskAlert[];
  forecast: CascadeForecast[];
  recommendations: Record<string, RouteOption[]>; // Keyed by alert id or shipment id
  summary: string;
}
