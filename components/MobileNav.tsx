
import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-end z-50 pb-safe">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">首页</span>
      </button>

      <div className="relative mb-2">
        <button 
          onClick={() => onTabChange('search')}
          className={`relative z-10 p-4 rounded-full shadow-2xl transition-all active:scale-90 ${
            activeTab === 'search' 
            ? 'bg-orange-500 text-white shadow-orange-300' 
            : 'bg-white text-gray-400 border border-gray-100'
          }`}
        >
          <Search size={28} strokeWidth={3} />
        </button>
        {activeTab === 'search' && (
          <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
        )}
      </div>

      <button 
        onClick={() => onTabChange('wishlist')}
        className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'wishlist' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <Heart size={24} strokeWidth={activeTab === 'wishlist' ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">心愿单</span>
      </button>

      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className="text-[10px] font-black uppercase tracking-widest">我的</span>
      </button>
    </div>
  );
};

export default MobileNav;
