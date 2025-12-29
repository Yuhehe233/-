
import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, TrendingUp, HelpCircle, History, Sparkles, X, Download, Share, Heart, User, ShoppingBag, ChevronRight } from 'lucide-react';
import Header from './components/Header.tsx';
import MobileNav from './components/MobileNav.tsx';
import SavingsDashboard from './components/SavingsDashboard.tsx';
import RecommendationSection from './components/RecommendationSection.tsx';
import { analyzeDeal, getHomeRecommendations } from './services/geminiService.ts';
import { DealAnalysisResponse, HomeRecommendation } from './types.ts';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DealAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  
  const [recommendations, setRecommendations] = useState<HomeRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem('hxs_history');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                       || (window.navigator as any).standalone;

    if (!isStandalone) {
      window.addEventListener('beforeinstallprompt', (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowAndroidInstall(true);
      });

      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setTimeout(() => setShowIosInstall(true), 5000);
      }
    }

    const fetchRecs = async () => {
      try {
        const data = await getHomeRecommendations();
        setRecommendations(data);
      } catch (e) {
        console.error("Failed to load recs", e);
      } finally {
        setRecsLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleSearch = useCallback(async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery || query;
    if (!targetQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null); 
    setActiveTab('search');

    try {
      const analysis = await analyzeDeal(targetQuery);
      setResult(analysis);
      
      const newHistory = [targetQuery, ...searchHistory.filter(h => h !== targetQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('hxs_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setError('查询失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  }, [query, searchHistory]);

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="space-y-10">
            <div className="pt-4">
               <h1 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                想买什么？<br/><span className="text-orange-500">好享省</span> 帮你算。
              </h1>
              <div onClick={() => setActiveTab('search')} className="bg-white p-4 rounded-3xl shadow-xl flex items-center gap-3 border border-gray-100 cursor-pointer active:scale-95 transition-transform">
                <Search className="text-gray-400" />
                <span className="text-gray-400 font-medium">输入商品名称，AI 找全网最低价...</span>
              </div>
            </div>
            <RecommendationSection recommendations={recommendations} loading={recsLoading} onSelect={(name) => handleSearch(undefined, name)} />
          </div>
        );
      case 'search':
        return (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索商品或粘贴链接..."
                className="w-full pl-6 pr-16 py-4.5 rounded-[1.5rem] bg-white border-2 border-transparent shadow-xl focus:border-orange-400 outline-none"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-5 bg-orange-500 text-white font-bold rounded-2xl active:scale-95 transition-transform">
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
              </button>
            </form>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="font-bold text-gray-400">AI 正在努力计算省钱方案...</p>
              </div>
            )}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}
            {result && <SavingsDashboard data={result} />}
          </div>
        );
      case 'profile':
        return <div className="p-10 text-center font-bold text-gray-400">个人中心正在加速建设中...</div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-[#f8fafc]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-5 w-full">
        {renderContent()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
