
import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, TrendingUp, HelpCircle, History, Sparkles, X, Download, Share, Heart, User, ShoppingBag, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import SavingsDashboard from './components/SavingsDashboard';
import RecommendationSection from './components/RecommendationSection';
import { analyzeDeal, getHomeRecommendations } from './services/geminiService';
import { DealAnalysisResponse, HomeRecommendation } from './types';

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

  // 初始化逻辑
  useEffect(() => {
    // 读取搜索历史
    const savedHistory = localStorage.getItem('hxs_history');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));

    // PWA 安装逻辑
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                       || (window.navigator as any).standalone;

    if (!isStandalone) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowAndroidInstall(true);
      });

      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isIos && isSafari) {
        setTimeout(() => setShowIosInstall(true), 5000);
      }
    }

    // 加载首页推荐
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

  // 执行搜索
  const handleSearch = useCallback(async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery || query;
    if (!targetQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null); 
    setActiveTab('search'); // 自动跳转到搜索页

    try {
      const analysis = await analyzeDeal(targetQuery);
      setResult(analysis);
      
      // 更新历史记录
      const newHistory = [targetQuery, ...searchHistory.filter(h => h !== targetQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('hxs_history', JSON.stringify(newHistory));
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || '查询失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  }, [query, searchHistory]);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowAndroidInstall(false);
    setDeferredPrompt(null);
  };

  // 渲染不同的视图
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* 搜索入口 */}
            <div className="pt-4">
               <h1 className="text-4xl font-black text-gray-900 leading-tight mb-6">
                想买什么？<br/><span className="text-orange-500">好享省</span> 帮你算。
              </h1>
              <div onClick={() => setActiveTab('search')} className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-200/50 flex items-center gap-3 border border-gray-100 cursor-pointer">
                <Search className="text-gray-400" />
                <span className="text-gray-400 font-medium">输入商品名称，AI 找全网最低价...</span>
              </div>
            </div>

            {/* 精选推荐 */}
            <RecommendationSection 
              recommendations={recommendations} 
              loading={recsLoading} 
              onSelect={(name) => handleSearch(undefined, name)}
            />

            {/* 今日爆料卡片 */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-100">
              <TrendingUp className="absolute right-[-20px] bottom-[-20px] opacity-10 w-48 h-48" />
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">限时情报</span>
              <h4 className="font-black text-2xl mt-4 mb-2">618 提前抢：数码专场</h4>
              <p className="text-white/80 text-sm max-w-[80%] leading-relaxed">iPhone 15 系列今日领券立减 ¥1200，支持 24 期免息。</p>
              <button onClick={() => handleSearch(undefined, 'iPhone 15 优惠')} className="mt-6 bg-white text-orange-600 font-bold px-6 py-2.5 rounded-xl text-sm shadow-xl active:scale-95 transition-all">立即算价</button>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                autoFocus={!result}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索商品或粘贴链接..."
                className="w-full pl-6 pr-16 py-4.5 rounded-[1.5rem] bg-white border-2 border-transparent shadow-xl shadow-gray-200/60 focus:border-orange-400 outline-none text-gray-800 transition-all text-lg font-medium"
              />
              <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 px-5 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" strokeWidth={3} />}
              </button>
            </form>

            {/* 搜索历史 */}
            {!result && !loading && searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchHistory.map(h => (
                  <button key={h} onClick={() => handleSearch(undefined, h)} className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-500 flex items-center gap-1">
                    <History size={12} /> {h}
                  </button>
                ))}
                <button onClick={() => {setSearchHistory([]); localStorage.removeItem('hxs_history');}} className="p-2 text-gray-300"><X size={14}/></button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="font-bold text-gray-500">AI 正在全网搜罗优惠方案...</p>
              </div>
            )}

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2"><HelpCircle size={18}/> {error}</div>}

            {result && !loading && (
              <div className="relative">
                <button onClick={() => setResult(null)} className="absolute -top-12 right-0 p-2 text-gray-400"><X size={20}/></button>
                <SavingsDashboard data={result} />
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 animate-in fade-in">
            <div className="bg-gray-100 p-8 rounded-full text-gray-300"><Heart size={64} /></div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">心愿单空空的</h3>
              <p className="text-gray-400 text-sm mt-1">收藏你心仪的商品，降价时我们会通知你</p>
            </div>
            <button onClick={() => setActiveTab('home')} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl">去逛逛</button>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500"><User size={32} /></div>
              <div>
                <h3 className="text-xl font-black text-gray-900">省钱达人</h3>
                <p className="text-xs text-green-600 font-bold">已累计省下 ¥1,240.50</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100"><p className="text-xs text-gray-400 mb-1">监控中</p><p className="text-2xl font-black text-gray-900">12</p></div>
              <div className="bg-white p-5 rounded-3xl border border-gray-100"><p className="text-xs text-gray-400 mb-1">已省金额</p><p className="text-2xl font-black text-orange-500">¥892</p></div>
            </div>
            <div className="bg-white rounded-3xl divide-y divide-gray-50 border border-gray-100 overflow-hidden">
               {['我的凑单作业', '降价提醒设置', '邀请好友领 50 元', '意见反馈'].map(item => (
                 <div key={item} className="p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                   <span className="font-bold text-gray-700">{item}</span>
                   <ChevronRight size={18} className="text-gray-300" />
                 </div>
               ))}
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-[#f8fafc]">
      <Header />

      {/* 顶部安装引导 (Android) */}
      {showAndroidInstall && (
        <div className="fixed top-4 left-4 right-4 z-[100] p-4 bg-orange-600 rounded-2xl shadow-2xl flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Download size={20} />
            <div className="text-xs font-bold leading-tight">安装“好享省”APP<br/><span className="opacity-70 font-normal">体验更流畅的省钱工具</span></div>
          </div>
          <button onClick={handleAndroidInstall} className="bg-white text-orange-600 px-4 py-1.5 rounded-lg text-xs font-bold">安装</button>
        </div>
      )}

      {/* iOS 安装指引卡片 */}
      {showIosInstall && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] p-6 bg-white border-2 border-orange-500 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10">
          <button onClick={() => setShowIosInstall(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600"><Sparkles size={32} /></div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">添加到主屏幕</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                点击下方 <Share size={18} className="inline mx-1 text-blue-500" /> 图标<br/>选择“<span className="font-bold text-gray-900">添加到主屏幕</span>”
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto px-5 w-full">
        {renderContent()}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
