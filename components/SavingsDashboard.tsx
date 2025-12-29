
import React, { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle2, Ticket, TrendingDown, ExternalLink, Zap, 
  Calendar, ArrowRight, AlertCircle, Sparkles, Clock, ShieldCheck
} from 'lucide-react';
import { DealAnalysisResponse, SavingPlan } from '../types';

interface Props {
  data: DealAnalysisResponse;
}

const SavingsDashboard: React.FC<Props> = ({ data }) => {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const currentPlan = data.plans[activePlanIdx];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Product Overview Brief */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
          <img src={`https://picsum.photos/seed/${data.productDetails.name}/100/100`} alt="product" />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 line-clamp-1">{data.productDetails.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">{data.productDetails.platform}</span>
            <span className="text-xs text-gray-400">原价 ¥{data.productDetails.originalPrice}</span>
          </div>
        </div>
      </div>

      {/* Decision Engine: Dual Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.plans.map((plan, idx) => (
          <button
            key={idx}
            onClick={() => setActivePlanIdx(idx)}
            className={`relative p-6 rounded-[2rem] text-left transition-all duration-300 border-2 overflow-hidden ${
              activePlanIdx === idx 
              ? 'border-orange-500 shadow-xl shadow-orange-100 bg-white scale-[1.02] z-10' 
              : 'border-transparent bg-gray-100 opacity-70 scale-95 hover:opacity-100'
            }`}
          >
            {plan.type === 'future' && (
              <div className="absolute top-0 right-0 px-4 py-1 bg-purple-500 text-white text-[10px] font-black rounded-bl-xl">极致预测</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${plan.type === 'immediate' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                {plan.type === 'immediate' ? <Zap size={20} /> : <Clock size={20} />}
              </div>
              {activePlanIdx === idx && (
                <div className="bg-orange-500 rounded-full p-1 text-white animate-bounce">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{plan.label}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900">¥{plan.finalPrice}</span>
              {plan.waitTime && <span className="text-[10px] text-purple-500 font-bold ml-2">({plan.waitTime})</span>}
            </div>
            <div className="mt-2 text-xs font-bold text-green-600">节省 ¥{plan.totalSavings}</div>
          </button>
        ))}
      </div>

      {/* AI Advice Banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-orange-800 text-sm">好享省决策建议</h4>
          <p className="text-orange-700 text-sm leading-relaxed">{data.decisionAdvice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Strategy Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">{currentPlan.label} - 具体操作步骤</h3>
            </div>
            
            <div className="space-y-6">
              {currentPlan.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    {index !== currentPlan.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-100 my-1"></div>
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-gray-700 font-medium">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentPlan.explanation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 italic">“{currentPlan.explanation}”</p>
              </div>
            )}
          </div>

          {/* Similar Products Recommendation */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 ml-2">全网相似/更优选择</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.similarRecommendations.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-200 transition-all flex justify-between items-center group">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-green-600 font-medium">优势: {item.advantage}</p>
                    <span className="text-lg font-black text-orange-600">¥{item.price}</span>
                  </div>
                  <button className="p-3 bg-gray-50 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Data Visualization */}
        <div className="space-y-6">
          {/* Historical Trend */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="text-green-500" size={20} />
              <h3 className="font-bold text-gray-800">真实价格曲线</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.priceTrends}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Area type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Confidence Meter */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-blue-400" size={20} />
              <h3 className="font-bold">预测模型数据</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-400">预测置信度</span>
                <span className="text-xl font-black text-blue-400">{data.pricePrediction.confidence}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${data.pricePrediction.confidence}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                模型参考了过去36个月内 {data.pricePrediction.nextEventName} 的全网折扣数据。
              </p>
            </div>
          </div>

          {/* Floating Action Button within Dashboard */}
          <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-transform active:scale-95">
            <ExternalLink size={18} />
            <span>前往{data.productDetails.platform}下单</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsDashboard;
