import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          signalType: { type: Type.STRING, enum: ['weather', 'congestion', 'carrier', 'geopolitical', 'anomaly'] },
          nodes: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'] },
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
      type: Type.OBJECT,
      description: "Keyed by alert id"
    },
    summary: { type: Type.STRING }
  },
  required: ['alerts', 'forecast', 'recommendations', 'summary']
};

export async function analyzeLogistics(shipmentData: any, snapshot: any): Promise<AnalysisResult> {
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

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
