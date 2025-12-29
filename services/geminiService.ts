
import { GoogleGenAI, Type } from "@google/genai";
import { DealAnalysisResponse, HomeRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeDeal = async (query: string): Promise<DealAnalysisResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `你是省钱专家“好享省”AI。分析以下需求，给出【两个对比方案】：
    1. 方案A（立即购买）：现阶段可行、且目前全网能做到的最低到手价。
    2. 方案B（远期省钱）：基于历史大促（双11、618等）预测的未来可能出现的极致最低价。
    对比两者的差值并给出决策建议。需求：${query}`,
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
              imageUrl: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["name", "originalPrice", "currentPrice", "platform"],
          },
          plans: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["immediate", "future"] },
                label: { type: Type.STRING },
                isActionable: { type: Type.BOOLEAN },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                totalSavings: { type: Type.NUMBER },
                finalPrice: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                coupons: { type: Type.ARRAY, items: { type: Type.STRING } },
                waitTime: { type: Type.STRING },
              },
              required: ["type", "label", "steps", "finalPrice", "totalSavings"],
            }
          },
          pricePrediction: {
            type: Type.OBJECT,
            properties: {
              nextEventName: { type: Type.STRING },
              expectedPrice: { type: Type.NUMBER },
              expectedDrop: { type: Type.NUMBER },
              buyNowOrWait: { type: Type.STRING, enum: ["buy_now", "wait"] },
              reasoning: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["nextEventName", "expectedPrice", "buyNowOrWait", "reasoning", "confidence"]
          },
          decisionAdvice: { type: Type.STRING, description: "对比两个方案后的综合购买建议" },
          similarRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER },
                platform: { type: Type.STRING },
                advantage: { type: Type.STRING },
              }
            }
          },
          priceTrends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                price: { type: Type.NUMBER },
              }
            }
          }
        },
        required: ["productDetails", "plans", "pricePrediction", "decisionAdvice", "similarRecommendations", "priceTrends"],
      },
    },
  });

  try {
    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("解析省钱方案出错，请稍后再试");
  }
};

export const getHomeRecommendations = async (): Promise<HomeRecommendation[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: '请基于当前主流电商平台（京东、天猫、淘宝）的行情，为“好享省”APP首页生成8个近期性价比极高、质量上乘的商品推荐。涵盖时尚、潮流、家电、数码等领域。',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["时尚", "潮流", "家电", "数码", "生活"] },
            price: { type: Type.NUMBER },
            originalPrice: { type: Type.NUMBER },
            platform: { type: Type.STRING, enum: ["京东", "天猫", "淘宝"] },
            reason: { type: Type.STRING },
            imageSeed: { type: Type.STRING }
          },
          required: ["name", "category", "price", "originalPrice", "platform", "reason", "imageSeed"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
};
