
import React from 'react';
import { ShoppingBag, TrendingDown, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 p-1.5 rounded-lg shadow-lg shadow-orange-200">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            好享省
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-orange-500 transition-colors flex items-center gap-1">
            <TrendingDown size={16} /> 降价监控
          </a>
          <a href="#" className="hover:text-orange-500 transition-colors">领券中心</a>
          <a href="#" className="hover:text-orange-500 transition-colors">今日必买</a>
          <a href="#" className="hover:text-orange-500 transition-colors">社区作业</a>
        </nav>

        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
