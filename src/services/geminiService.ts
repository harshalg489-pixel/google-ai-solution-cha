import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured in environment secrets.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          signalType: { type: Type.STRING },
          nodes: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          impact: {
            type: Type.OBJECT,
            properties: {
              shipmentsAffected: { type: Type.NUMBER },
              delayWindow: { type: Type.STRING }
            },
            required: ['shipmentsAffected', 'delayWindow']
          },
          description: { type: Type.STRING }
        },
        required: ['id', 'signalType', 'nodes', 'severity', 'confidence', 'impact', 'description']
      }
    },
    forecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          propagationLikelihood: { type: Type.NUMBER },
          causalChain: { type: Type.ARRAY, items: { type: Type.STRING } },
          downstreamEffects: {
            type: Type.OBJECT,
            properties: {
              additionalShipments: { type: Type.NUMBER },
              secondaryDelays: { type: Type.STRING },
              networkCongestionRisk: { type: Type.STRING }
            },
            required: ['additionalShipments', 'secondaryDelays', 'networkCongestionRisk']
          }
        },
        required: ['propagationLikelihood', 'causalChain', 'downstreamEffects']
      }
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Array of recommendation sets, each containing an alertId and its associated options",
      items: {
        type: Type.OBJECT,
        properties: {
          alertId: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                route: { type: Type.STRING },
                timeDelta: { type: Type.STRING },
                costDelta: { type: Type.STRING },
                reliabilityScore: { type: Type.NUMBER },
                riskReduction: { type: Type.NUMBER },
                decision: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ['id', 'name', 'route', 'timeDelta', 'costDelta', 'reliabilityScore', 'riskReduction', 'decision', 'reasoning']
            }
          }
        },
        required: ['alertId', 'options']
      }
    },
    summary: { type: Type.STRING }
  },
  required: ['alerts', 'forecast', 'recommendations', 'summary']
};

export async function analyzeLogistics(shipmentData: any, snapshot: any): Promise<AnalysisResult> {
  const ai = getAiClient();
  
  const prompt = `
    Analyze the following real-time logistics snapshot as LogistiQ, the elite AI logistics intelligence agent.
    
    SHIPMENT DATA
    ${JSON.stringify(shipmentData)}
    
    LIVE FEEDS
    Weather: ${snapshot.weather}
    Port Status: ${snapshot.portStatus}
    Carrier Alerts: ${snapshot.carrierAlerts}
    Geopolitical Events: ${snapshot.geopolitical}
    
    Directives:
    1. DETECT active disruptions.
    2. PREDICT impact (likelihood, duration, volume).
    3. RESPOND with ranked rerouting strategies.
    
    For recommendations, provide 2 alternatives for each High/Critical risk.
    Each recommendation MUST include: time delta, cost delta, reliability score, risk reduction, and decision type (AUTO-EXECUTE or HUMAN APPROVAL REQUIRED).
    
    Format the response as JSON according to the schema provided.
    Ensure recommendations are returned as an array of objects with alertId and options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    const rawData = JSON.parse(response.text);
    
    // Map the array-based recommendations back to the Record format expected by the UI
    const recommendations: Record<string, any[]> = {};
    if (Array.isArray(rawData.recommendations)) {
      rawData.recommendations.forEach((item: any) => {
        recommendations[item.alertId] = item.options;
      });
    }

    return {
      ...rawData,
      recommendations
    } as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
