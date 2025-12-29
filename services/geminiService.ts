
import { GoogleGenAI, Type } from "@google/genai";
import { DealAnalysisResponse, HomeRecommendation } from "../types.ts";

const getApiKey = () => {
  return (typeof process !== 'undefined' && process.env?.API_KEY) || (window as any).process?.env?.API_KEY || "";
};

export const analyzeDeal = async (query: string): Promise<DealAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `你是省钱专家“好享省”AI。详细分析该产品的全网省钱方案、当前价、历史低价、凑单建议、预测未来大促价等信息。需求：${query}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productDetails: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              originalPrice: { type: Type.NUMBER },
              currentPrice: { type: Type.NUMBER },
              platform: { type: Type.STRING },
            },
            required: ["name", "originalPrice", "currentPrice", "platform"],
          },
          plans: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                label: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                finalPrice: { type: Type.NUMBER },
                totalSavings: { type: Type.NUMBER },
              },
              required: ["type", "label", "steps", "finalPrice", "totalSavings"],
            }
          },
          pricePrediction: {
            type: Type.OBJECT,
            properties: {
              nextEventName: { type: Type.STRING },
              expectedPrice: { type: Type.NUMBER },
              buyNowOrWait: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["nextEventName", "expectedPrice", "confidence"]
          },
          decisionAdvice: { type: Type.STRING },
          priceTrends: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, price: { type: Type.NUMBER } } } },
          similarRecommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.NUMBER }, platform: { type: Type.STRING } } } }
        },
        required: ["productDetails", "plans", "pricePrediction", "decisionAdvice", "priceTrends", "similarRecommendations"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const getHomeRecommendations = async (): Promise<HomeRecommendation[]> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: '生成8个近期性价比极高的潮流数码、时尚、家电类商品推荐。',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER },
            originalPrice: { type: Type.NUMBER },
            platform: { type: Type.STRING },
            reason: { type: Type.STRING },
            imageSeed: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
