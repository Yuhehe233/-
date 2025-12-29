
import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">首页</span>
      </button>
      <button 
        onClick={() => onTabChange('search')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <Search size={22} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">省钱搜</span>
      </button>
      <div className="relative -top-6">
        <div className="bg-orange-500 p-4 rounded-full shadow-lg shadow-orange-200 text-white border-4 border-white">
          <Search size={24} />
        </div>
      </div>
      <button 
        onClick={() => onTabChange('wishlist')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'wishlist' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <Heart size={22} strokeWidth={activeTab === 'wishlist' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">心愿单</span>
      </button>
      <button 
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">我的</span>
      </button>
    </div>
  );
};

export default MobileNav;
