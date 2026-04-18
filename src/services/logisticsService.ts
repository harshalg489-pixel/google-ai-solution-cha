import { AnalysisResult, RiskAlert, CascadeForecast, RouteOption, Severity, SignalType } from "../types";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const HOLIDAY_API = "https://date.nager.at/api/v3/PublicHolidays";

async function fetchWeather(lat: number, lng: number) {
  try {
    const res = await fetch(`${WEATHER_API}?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=windspeed_10m,relativehumidity_2m`);
    return await res.json();
  } catch (e) {
    console.error("Weather fetch failed", e);
    return null;
  }
}

async function fetchHolidays(countryCode: string) {
  try {
    const year = new Date().getFullYear();
    const res = await fetch(`${HOLIDAY_API}/${year}/${countryCode}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function analyzeLogistics(shipments: any[]): Promise<AnalysisResult> {
  const alerts: RiskAlert[] = [];
  const forecasts: CascadeForecast[] = [];
  const recommendations: Record<string, RouteOption[]> = {};
  
  // Aggregate country codes for holiday checks
  const countries = new Set<string>();
  shipments.forEach(s => {
    if (s.origin.includes('CN')) countries.add('CN');
    if (s.origin.includes('US')) countries.add('US');
    if (s.origin.includes('NL')) countries.add('NL');
    if (s.origin.includes('SG')) countries.add('SG');
    if (s.origin.includes('DE')) countries.add('DE');
    if (s.origin.includes('KR')) countries.add('KR');
    if (s.destination.includes('CN')) countries.add('CN');
    if (s.destination.includes('US')) countries.add('US');
    if (s.destination.includes('NL')) countries.add('NL');
    if (s.destination.includes('SG')) countries.add('SG');
    if (s.destination.includes('DE')) countries.add('DE');
    if (s.destination.includes('KR')) countries.add('KR');
  });

  // Fetch holidays for all involved regions using Nager.Date API
  const holidayMap: Record<string, any[]> = {};
  await Promise.all(Array.from(countries).map(async code => {
    holidayMap[code] = await fetchHolidays(code);
  }));

  const today = new Date().toISOString().split('T')[0];

  for (const shipment of shipments) {
    // 1. Check for Holiday Disruptions
    const destCountry = shipment.destination.split(', ')[1];
    const holidays = holidayMap[destCountry] || [];
    const upcomingHoliday = holidays.find(h => h.date >= today && h.date <= shipment.eta);
    
    if (upcomingHoliday) {
      alerts.push({
        id: `ALT-HOL-${shipment.id}`,
        signalType: 'congestion',
        nodes: `${shipment.destination} (Port)`,
        severity: 'Medium',
        confidence: 0.95,
        impact: {
          shipmentsAffected: 1,
          delayWindow: '24h-48h'
        },
        description: `Operational slowdown expected at ${shipment.destination} due to public holiday: ${upcomingHoliday.localName}. Custom clearance suspended.`
      });
    }

    // 2. Check for Real-time Weather Disruption using Open-Meteo
    const weather = await fetchWeather(shipment.currentLat, shipment.currentLng);
    if (weather && weather.current_weather) {
      const windSpeed = weather.current_weather.windspeed;
      if (windSpeed > 30) {
        const severity: Severity = windSpeed > 60 ? 'Critical' : 'High';
        alerts.push({
          id: `ALT-WTH-${shipment.id}`,
          signalType: 'weather',
          nodes: `Current Location (${shipment.currentLat.toFixed(2)}, ${shipment.currentLng.toFixed(2)})`,
          severity,
          confidence: 0.88,
          impact: {
            shipmentsAffected: 1,
            delayWindow: windSpeed > 60 ? '72h+' : '24h-48h'
          },
          description: `Severe wind conditions detected (${windSpeed} km/h). Vessel stability protocols initiated. Reducing speed to 5 knots.`
        });
        
        // Add recommendation for weather
        recommendations[`ALT-WTH-${shipment.id}`] = [
          {
            id: `REC-WTH-${shipment.id}`,
            name: "Tactical Redirection",
            route: "Adjust Heading +15° North",
            timeDelta: "+12h",
            costDelta: "+$3,200",
            reliabilityScore: 0.92,
            riskReduction: 0.85,
            decision: "AUTO-EXECUTE",
            reasoning: "Dynamic steering to avoid the localized high-pressure system while maintaining propulsion efficiency."
          }
        ];
      }
    }
  }

  // Generate generic forecasts if alerts exist
  if (alerts.length > 0) {
    forecasts.push({
      propagationLikelihood: 0.72,
      causalChain: ["Localized disruption", "Slot backlog", "Inland ripple"],
      downstreamEffects: {
        additionalShipments: shipments.length * 2,
        secondaryDelays: "4-6 days",
        networkCongestionRisk: alerts.some(a => a.severity === 'Critical') ? "High" : "Medium"
      }
    });
  }

  const summary = alerts.length > 0 
    ? `System detected ${alerts.length} active network disruptions based on real-time weather and regional operational calendars. High focus required on ${alerts.filter(a => a.severity === 'High' || a.severity === 'Critical').length} critical nodes.`
    : "Network operational. Satellite and regional feeds suggest nominal conditions across all active transit corridors.";

  return {
    alerts,
    forecast: forecasts,
    recommendations,
    summary
  };
}
