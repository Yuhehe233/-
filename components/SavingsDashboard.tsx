
import React, { useState } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  CheckCircle2, Ticket, TrendingDown, ExternalLink, Zap, 
  Calendar, ArrowRight, AlertCircle, Sparkles, Clock, ShieldCheck, Share2, Copy
} from 'lucide-react';
import { DealAnalysisResponse, SavingPlan } from '../types.ts';

interface Props {
  data: DealAnalysisResponse;
}

const SavingsDashboard: React.FC<Props> = ({ data }) => {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const currentPlan = data.plans[activePlanIdx];

  const handleShare = () => {
    const text = `我在【好享省】找到了 ${data.productDetails.name} 的极致省钱方案！到手价仅 ¥${currentPlan.finalPrice}，快来看看 AI 怎么算的：${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: '好享省作业', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          <img 
            src={`https://picsum.photos/seed/${data.productDetails.name}/200/200`} 
            alt="product" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-md">{data.productDetails.platform}</span>
            <span className="text-[10px] text-gray-400 font-medium">全网比价中...</span>
          </div>
          <h2 className="font-black text-gray-900 line-clamp-1 text-lg">{data.productDetails.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 line-through">原价 ¥{data.productDetails.originalPrice}</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">立省 ¥{data.productDetails.originalPrice - data.productDetails.currentPrice}</span>
          </div>
        </div>
        <button onClick={handleShare} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-orange-500 transition-colors shrink-0">
          {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Share2 size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.plans.map((plan, idx) => (
          <button
            key={idx}
            onClick={() => setActivePlanIdx(idx)}
            className={`relative p-6 rounded-[2.5rem] text-left transition-all duration-300 border-2 overflow-hidden ${
              activePlanIdx === idx 
              ? 'border-orange-500 shadow-2xl shadow-orange-100 bg-white scale-[1.02] z-10' 
              : 'border-transparent bg-white/50 opacity-60 scale-95 hover:opacity-100'
            }`}
          >
            {plan.type === 'future' && (
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-black rounded-bl-2xl shadow-lg">极致预测</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${plan.type === 'immediate' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                {plan.type === 'immediate' ? <Zap size={24} strokeWidth={2.5} /> : <Clock size={24} strokeWidth={2.5} />}
              </div>
              {activePlanIdx === idx && (
                <div className="bg-orange-500 rounded-full p-1.5 text-white shadow-lg animate-pulse">
                  <CheckCircle2 size={16} strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{plan.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">¥</span>
              <span className="text-4xl font-black text-gray-900 tracking-tight">{plan.finalPrice}</span>
              {plan.waitTime && <span className="text-[10px] text-purple-600 font-bold ml-2 bg-purple-50 px-2 py-0.5 rounded-full">{plan.waitTime}</span>}
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingDown size={14} /> 较原价降 {((1 - plan.finalPrice / data.productDetails.originalPrice) * 100).toFixed(1)}%
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
        <div className="bg-orange-500 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-orange-200">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="font-black text-orange-900 text-sm mb-1 italic tracking-wide">AI 省钱顾问 · 深度建议</h4>
          <p className="text-orange-800 text-sm leading-relaxed font-medium">{data.decisionAdvice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">手把手省钱教程</h3>
            </div>
            
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-50 border-l border-dashed border-gray-200"></div>
              {currentPlan.steps.map((step, index) => (
                <div key={index} className="flex gap-6 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xl shadow-gray-200">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-800 font-bold text-lg leading-tight mb-2">{step}</p>
                    {currentPlan.coupons?.[index] && (
                      <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-black border border-red-100">
                        <Ticket size={12} /> {currentPlan.coupons[index]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentPlan.explanation && (
              <div className="mt-12 p-6 bg-gray-50 rounded-[2rem] border border-gray-200 border-dashed relative">
                <div className="absolute -top-3 left-6 bg-gray-50 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">原理说明</div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">“{currentPlan.explanation}”</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-xl text-green-600"><TrendingDown size={18} /></div>
                <h3 className="font-black text-gray-900 text-sm">价格监控中</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400">近 3 个月</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.priceTrends}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#f97316" strokeWidth={3} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl text-white relative overflow-hidden">
             <Sparkles className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><ShieldCheck size={20} /></div>
              <h3 className="font-black text-sm tracking-wide">大数据置信度</h3>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">模型准确率</span>
                <span className="text-3xl font-black text-blue-400">{data.pricePrediction.confidence}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000" 
                  style={{ width: `${data.pricePrediction.confidence}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                实时抓取全网历史大促成交价，结合 {data.pricePrediction.nextEventName} 历史均值得出。
              </p>
            </div>
          </div>

          <button className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl shadow-2xl shadow-orange-200 flex items-center justify-center gap-3 transition-all active:scale-95 group">
            <ExternalLink size={20} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span className="text-lg">前往{data.productDetails.platform}下单</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsDashboard;
