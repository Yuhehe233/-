
import React, { useState, useCallback, useEffect } from 'react';
import { Search, Loader2, TrendingUp, HelpCircle, History, Sparkles, X, Download, Share } from 'lucide-react';
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
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  
  const [recommendations, setRecommendations] = useState<HomeRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(true);

  useEffect(() => {
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
        // 如果是 iOS 且未安装，延迟显示引导
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

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleSearch = useCallback(async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery || query;
    if (!targetQuery.trim()) return;
    if (customQuery) setQuery(customQuery);

    setLoading(true);
    setError(null);
    setResult(null); 
    try {
      const analysis = await analyzeDeal(targetQuery);
      setResult(analysis);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || '查询失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const quickSearches = ['iPhone 16 24期免息', 'SK-II 神仙水 最省凑单', '始祖鸟 beta lt 平替', '飞利浦电动牙刷 最低价'];

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-[#f8fafc]">
      <Header />

      {/* Android 安装引导 */}
      {showAndroidInstall && (
        <div className="fixed top-4 left-4 right-4 z-[100] p-4 bg-orange-600 rounded-2xl shadow-2xl flex items-center justify-between text-white animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Download size={20} /></div>
            <div>
              <p className="font-bold text-sm">安装“好享省”APP</p>
              <p className="text-[10px] text-white/80">获取原生级流畅省钱体验</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAndroidInstall} className="bg-white text-orange-600 px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all">安装</button>
            <button onClick={() => setShowAndroidInstall(false)} className="p-1 opacity-60"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* iOS 安装指引 */}
      {showIosInstall && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] p-5 bg-white border-2 border-orange-500 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
          <button onClick={() => setShowIosInstall(false)} className="absolute top-3 right-3 text-gray-400"><X size={18} /></button>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><Sparkles size={24} /></div>
            <div>
              <h3 className="font-black text-gray-900">添加到桌面</h3>
              <p className="text-gray-500 text-xs mt-1">点击下方 <Share size={14} className="inline mx-1 text-blue-500" /> 图标，选择“<span className="font-bold text-gray-900">添加到主屏幕</span>”。</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-1 h-6 bg-orange-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {!result && (
          <section className="mb-8 pt-4">
            <div className="text-left md:text-center space-y-2 mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                想买什么？<span className="text-orange-500">好享省</span> 帮你算。
              </h1>
              <p className="text-gray-400 text-sm md:text-lg max-w-2xl md:mx-auto font-medium">
                输入商品或链接，AI 秒出极致凑单方案
              </p>
            </div>

            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索商品或粘贴链接..."
                  className="w-full pl-6 pr-16 py-4.5 rounded-[1.5rem] bg-white border-2 border-transparent shadow-xl shadow-gray-200/60 focus:border-orange-400 focus:ring-0 outline-none text-gray-800 transition-all text-lg font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-orange-200"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" strokeWidth={3} />}
                </button>
              </form>

              <div className="mt-5 flex overflow-x-auto pb-2 gap-2 no-scrollbar px-1">
                {quickSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(undefined, tag)}
                    className="whitespace-nowrap px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-[6px] border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500" size={32} />
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-800 tracking-tight">AI 正在极限算账中...</p>
              <p className="text-gray-400 text-xs mt-1 animate-pulse">正在排除先涨后降陷阱</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto p-5 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 flex items-center gap-4 mb-10 shadow-sm">
            <HelpCircle size={28} />
            <div>
              <p className="font-bold">查询出错</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setResult(null)}
              className="absolute -top-12 right-0 p-3 bg-white shadow-md text-gray-400 rounded-full hover:bg-gray-100 active:scale-90 transition-all border border-gray-100"
            >
              <X size={20} />
            </button>
            <SavingsDashboard data={result} />
          </div>
        )}

        {!result && !loading && (
          <>
            <RecommendationSection 
              recommendations={recommendations} 
              loading={recsLoading} 
              onSelect={(name) => handleSearch(undefined, name)}
            />
            
            <div className="mt-14 space-y-6">
               <h3 className="text-xl font-black text-gray-900 px-2 flex items-center gap-2">
                 <TrendingUp className="text-orange-500" /> 
                 今日极致省钱料
               </h3>
               <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
                    <TrendingUp className="absolute right-[-20px] bottom-[-20px] opacity-10 w-48 h-48" />
                    <div className="relative z-10">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase">限时情报</span>
                      <h4 className="font-black text-2xl mt-4 mb-2">天猫国际·美妆直降</h4>
                      <p className="text-white/80 text-sm max-w-[80%]">今日 20:00 欧莱雅专场限时 3 折，叠加平台券可做到历史新低。</p>
                      <button className="mt-6 bg-white text-orange-600 font-bold px-6 py-2 rounded-xl text-sm shadow-xl">立即查价</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><History size={24} /></div>
                      <p className="font-black text-gray-900 text-sm">价格趋势</p>
                      <p className="text-[10px] text-gray-400 mt-1">识破虚假促销</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"><Sparkles size={24} /></div>
                      <p className="font-black text-gray-900 text-sm">极简凑单</p>
                      <p className="text-[10px] text-gray-400 mt-1">一键复制大神作业</p>
                    </div>
                  </div>
               </div>
            </div>
          </>
        )}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
