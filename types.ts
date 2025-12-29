
export interface Product {
  name: string;
  originalPrice: number;
  currentPrice: number;
  platform: string;
  imageUrl: string;
  description: string;
}

export interface SavingPlan {
  type: 'immediate' | 'future';
  label: string; // 例如: "现阶段最佳可行" 或 "远期极致省钱"
  isActionable: boolean;
  steps: string[];
  totalSavings: number;
  finalPrice: number;
  explanation: string;
  coupons: string[];
  waitTime?: string; // 只有未来方案有，例如: "需等待约 45 天"
}

export interface PricePrediction {
  nextEventName: string;
  expectedPrice: number;
  expectedDrop: number;
  buyNowOrWait: 'buy_now' | 'wait';
  reasoning: string;
  confidence: number;
}

export interface DealAnalysisResponse {
  productDetails: Product;
  plans: SavingPlan[]; // 包含两个方案：立即购买和远期等待
  similarRecommendations: SimilarProduct[];
  priceTrends: { date: string; price: number }[];
  pricePrediction: PricePrediction;
  decisionAdvice: string; // AI 给出的对比建议
}

export interface SimilarProduct {
  name: string;
  price: number;
  platform: string;
  advantage: string;
  link?: string;
}

export interface HomeRecommendation {
  name: string;
  category: '时尚' | '潮流' | '家电' | '数码' | '生活';
  price: number;
  originalPrice: number;
  platform: '京东' | '天猫' | '淘宝';
  reason: string;
  imageSeed: string;
}
