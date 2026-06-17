import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Trash2, Activity, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlist');
      setWatchlist(res.data.data);
      if (res.data.data.length > 0 && !selectedAsset) {
        fetchAssetData(res.data.data[0].symbol);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssetData = async (symbol) => {
    setLoading(true);
    setError('');
    try {
      // Fetch quote
      const quoteRes = await axios.get(`/api/market/quote/${symbol}`);
      setSelectedAsset(quoteRes.data.data);

      // Fetch 6 months chart data
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const period1 = sixMonthsAgo.toISOString().split('T')[0];
      
      const chartRes = await axios.get(`/api/market/chart/${symbol}?from=${period1}&interval=1d`);
      
      // Format chart data
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
      setSearchSymbol('');
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
      {/* Sidebar: Watchlist */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card p-4 glass">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-primary" />
            Watchlist
          </h2>
          {watchlist.length === 0 ? (
            <p className="text-gray-400 text-sm">Your watchlist is empty. Search for a stock or crypto to add it.</p>
          ) : (
            <div className="space-y-2">
              {watchlist.map((item) => (
                <div 
                  key={item.symbol} 
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${selectedAsset?.symbol === item.symbol ? 'bg-primary/20 border border-primary/50' : 'bg-surface hover:bg-surface-hover border border-white/5'}`}
                  onClick={() => fetchAssetData(item.symbol)}
                >
                  <span className="font-bold">{item.symbol}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                    className="text-gray-500 hover:text-danger"
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
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search symbol (e.g. AAPL, BTC-USD)" 
            className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition text-lg glass"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
          />
        </form>

        {error && <div className="bg-danger/20 text-danger p-4 rounded-xl">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : selectedAsset ? (
          <div className="space-y-6">
            {/* Asset Header */}
            <div className="card p-6 glass flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {selectedAsset.symbol}
                  <span className="text-lg font-normal text-gray-400 bg-surface px-2 py-1 rounded">
                    {selectedAsset.shortName || selectedAsset.longName}
                  </span>
                </h1>
                <div className="flex items-end gap-3 mt-2">
                  <span className="text-4xl font-light">${selectedAsset.regularMarketPrice?.toFixed(2)}</span>
                  <span className={`text-lg font-medium mb-1 ${selectedAsset.regularMarketChange > 0 ? 'text-success' : 'text-danger'}`}>
                    {selectedAsset.regularMarketChange > 0 ? '+' : ''}{selectedAsset.regularMarketChange?.toFixed(2)} ({selectedAsset.regularMarketChangePercent?.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              {!isSelectedInWatchlist && (
                <button 
                  onClick={() => addToWatchlist(selectedAsset.symbol)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <Plus size={18} /> Add to Watchlist
                </button>
              )}
            </div>

            {/* Chart */}
            <div className="card p-6 glass h-[400px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                6 Month Price History
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} minTickGap={30} />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 glass">
                <p className="text-sm text-gray-400 mb-1">Previous Close</p>
                <p className="text-xl font-medium">${selectedAsset.regularMarketPreviousClose?.toFixed(2)}</p>
              </div>
              <div className="card p-4 glass">
                <p className="text-sm text-gray-400 mb-1">Open</p>
                <p className="text-xl font-medium">${selectedAsset.regularMarketOpen?.toFixed(2)}</p>
              </div>
              <div className="card p-4 glass">
                <p className="text-sm text-gray-400 mb-1">Day's Range</p>
                <p className="text-xl font-medium">${selectedAsset.regularMarketDayLow?.toFixed(2)} - ${selectedAsset.regularMarketDayHigh?.toFixed(2)}</p>
              </div>
              <div className="card p-4 glass">
                <p className="text-sm text-gray-400 mb-1">Volume</p>
                <p className="text-xl font-medium">{(selectedAsset.regularMarketVolume / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-12 glass text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10">
            <Activity size={48} className="text-gray-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Asset Selected</h3>
            <p className="text-gray-400">Search for a ticker symbol (like AAPL, TSLA, BTC-USD) or select one from your watchlist to view its data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
