import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Trash2, Activity, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Navigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateBalance, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const [watchlist, setWatchlist] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState(location.state?.symbol || '');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Trading State
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      fetchWatchlist();
      if (searchSymbol) {
        fetchAssetData(searchSymbol);
      }
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlist');
      setWatchlist(res.data.data);
      if (!selectedAsset && !searchSymbol) {
        if (res.data.data.length > 0) {
          fetchAssetData(res.data.data[0].symbol);
        } else {
          // Default to AAPL if completely empty to avoid blank dashboard
          fetchAssetData('AAPL');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssetData = async (symbol) => {
    setLoading(true);
    setError('');
    setTradeMessage({ text: '', type: '' });
    try {
      const quoteRes = await axios.get(`/api/market/quote/${symbol}`);
      setSelectedAsset(quoteRes.data.data);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const period1 = sixMonthsAgo.toISOString().split('T')[0];
      
      const chartRes = await axios.get(`/api/market/chart/${symbol}?from=${period1}&interval=1d`);
      
      const formattedData = chartRes.data.data.quotes.map(q => ({
        date: new Date(q.date).toLocaleDateString(),
        price: q.close
      }));
      setChartData(formattedData);
    } catch (err) {
      setError('Failed to fetch data for ' + symbol);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      fetchAssetData(searchSymbol.trim());
    }
  };

  const handleTrade = async (type) => {
    if (!selectedAsset || tradeQuantity <= 0) return;
    setTradeLoading(true);
    setTradeMessage({ text: '', type: '' });
    try {
      const res = await axios.post(`/api/trade/${type.toLowerCase()}`, {
        symbol: selectedAsset.symbol,
        quantity: Number(tradeQuantity)
      });
      setTradeMessage({ text: res.data.message, type: 'success' });
      updateBalance(res.data.balance);
    } catch (err) {
      setTradeMessage({ text: err.response?.data?.message || 'Trade failed', type: 'error' });
    } finally {
      setTradeLoading(false);
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      await axios.post('/api/watchlist', { symbol });
      fetchWatchlist();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to watchlist');
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      await axios.delete(`/api/watchlist/${symbol}`);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const isSelectedInWatchlist = selectedAsset && watchlist.some(w => w.symbol === selectedAsset.symbol);
  const tradeTotal = selectedAsset ? (selectedAsset.regularMarketPrice * tradeQuantity).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6 max-w-7xl mx-auto">
      {/* Sidebar: Watchlist */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card p-4 glass h-full min-h-[600px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-primary" />
            Watchlist
          </h2>
          {watchlist.length === 0 ? (
            <p className="text-gray-400 text-sm">Your watchlist is empty.</p>
          ) : (
            <div className="space-y-2">
              {watchlist.map((item) => (
                <div 
                  key={item.symbol} 
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${selectedAsset?.symbol === item.symbol ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,240,255,0.2)] border' : 'bg-surface hover:bg-surface-hover border border-gray-100'}`}
                  onClick={() => { setSearchSymbol(item.symbol); fetchAssetData(item.symbol); }}
                >
                  <span className="font-bold tracking-wide">{item.symbol}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                    className="text-gray-500 hover:text-danger transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Chart and Analytics */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search symbol (e.g. AAPL, TSLA, BTC-USD)" 
            className="w-full bg-surface/80 backdrop-blur-xl border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all text-lg font-medium"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
          />
        </form>

        {error && <div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-xl backdrop-blur-md">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : selectedAsset ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Asset Info & Chart */}
            <div className="xl:col-span-2 space-y-6">
              {/* Asset Header */}
              <div className="card p-6 glass relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                  <div>
                    <h1 className="text-4xl font-extrabold flex items-center gap-3 tracking-tight">
                      {selectedAsset.symbol}
                      <span className="text-lg font-normal text-gray-400 bg-white/5 border border-gray-200 px-3 py-1 rounded-full">
                        {selectedAsset.shortName || selectedAsset.longName}
                      </span>
                    </h1>
                    <div className="flex items-end gap-3 mt-3">
                      <span className="text-5xl font-light tracking-tighter">${selectedAsset.regularMarketPrice?.toFixed(2)}</span>
                      <span className={`text-xl font-medium mb-1 ${selectedAsset.regularMarketChange > 0 ? 'text-success' : 'text-danger'}`}>
                        {selectedAsset.regularMarketChange > 0 ? '+' : ''}{selectedAsset.regularMarketChange?.toFixed(2)} ({selectedAsset.regularMarketChangePercent?.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  
                  {!isSelectedInWatchlist && (
                    <button 
                      onClick={() => addToWatchlist(selectedAsset.symbol)}
                      className="bg-surface hover:bg-white/10 border border-white/20 text-gray-900 px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2"
                    >
                      <Plus size={18} /> Watch
                    </button>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="card p-6 glass h-[400px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-300">
                  <Activity size={18} className="text-primary" />
                  Price Action (6M)
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#8b9bb4" tick={{ fill: '#8b9bb4', fontSize: 12 }} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#8b9bb4" tick={{ fill: '#8b9bb4', fontSize: 12 }} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 25, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                      labelStyle={{ color: '#8b9bb4', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#00f0ff" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00f0ff', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column: Trade Panel & Stats */}
            <div className="space-y-6">
              {/* TRADE PANEL */}
              <div className="card p-6 glass border-t-4 border-t-primary">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" />
                  Execute Trade
                </h3>
                
                {tradeMessage.text && (
                  <div className={`p-3 rounded-lg text-sm mb-4 border ${tradeMessage.type === 'success' ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}>
                    {tradeMessage.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(e.target.value)}
                      className="w-full bg-surface border border-gray-200 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:border-primary transition text-xl font-bold"
                    />
                  </div>
                  
                  <div className="bg-surface/50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-400">Estimated Cost</span>
                    <span className="text-2xl font-bold text-gray-900">${Number(tradeTotal).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-400 px-1">
                    <span>Available Cash:</span>
                    <span className="font-medium text-success">${user.balance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => handleTrade('buy')}
                      disabled={tradeLoading}
                      className="bg-success hover:bg-green-400 text-black font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] disabled:opacity-50"
                    >
                      {tradeLoading ? 'Processing...' : 'BUY'}
                    </button>
                    <button 
                      onClick={() => handleTrade('sell')}
                      disabled={tradeLoading}
                      className="bg-danger hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(255,0,85,0.2)] hover:shadow-[0_0_25px_rgba(255,0,85,0.4)] disabled:opacity-50"
                    >
                      {tradeLoading ? 'Processing...' : 'SELL'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 glass">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Prev Close</p>
                  <p className="text-lg font-medium">${selectedAsset.regularMarketPreviousClose?.toFixed(2)}</p>
                </div>
                <div className="card p-4 glass">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Open</p>
                  <p className="text-lg font-medium">${selectedAsset.regularMarketOpen?.toFixed(2)}</p>
                </div>
                <div className="card p-4 glass col-span-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Day's Range</p>
                  <p className="text-lg font-medium">${selectedAsset.regularMarketDayLow?.toFixed(2)} - ${selectedAsset.regularMarketDayHigh?.toFixed(2)}</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="card p-16 glass text-center flex flex-col items-center justify-center border-dashed border-2 border-white/5 min-h-[400px]">
            <DollarSign size={64} className="text-gray-600 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Market Scanner Ready</h3>
            <p className="text-gray-400 max-w-md">Search for any ticker symbol above to stream live pricing, view technical charts, and execute paper trades.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
