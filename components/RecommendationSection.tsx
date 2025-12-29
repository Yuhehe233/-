
import React from 'react';
import { Sparkles, TrendingDown, ChevronRight } from 'lucide-react';
import { HomeRecommendation } from '../types';

interface Props {
  recommendations: HomeRecommendation[];
  loading: boolean;
  onSelect: (name: string) => void;
}

const RecommendationSection: React.FC<Props> = ({ recommendations, loading, onSelect }) => {
  if (loading && recommendations.length === 0) {
    return (
      <div className="mt-12 space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1 rounded-lg">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">猜你喜欢 · 极致好物</h2>
        </div>
        <button className="text-sm font-semibold text-orange-500 flex items-center hover:gap-1 transition-all">
          更多推荐 <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(item.name)}
            className="group cursor-pointer bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-orange-100 transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img 
                src={`https://picsum.photos/seed/${item.imageSeed}/400/400`} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <span className="px-2 py-0.5 bg-white/90 backdrop-blur text-[10px] font-bold text-gray-800 rounded-lg shadow-sm">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 bg-orange-500 text-[10px] font-bold text-white rounded-lg shadow-sm flex items-center gap-1">
                  <TrendingDown size={10} /> {((1 - item.price / item.originalPrice) * 100).toFixed(0)}% OFF
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-black px-1.5 rounded ${
                  item.platform === '京东' ? 'bg-red-100 text-red-600' : 
                  item.platform === '天猫' ? 'bg-red-500 text-white' : 
                  'bg-orange-100 text-orange-600'
                }`}>
                  {item.platform}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
                {item.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-red-600">¥{item.price}</span>
                <span className="text-[10px] text-gray-400 line-through italic">¥{item.originalPrice}</span>
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
