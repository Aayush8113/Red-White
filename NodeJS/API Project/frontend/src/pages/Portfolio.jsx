import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const { user } = useContext(AuthContext);
  const [holdings, setHoldings] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('/api/trade/portfolio');
      const fetchedHoldings = res.data.data.holdings;
      setHoldings(fetchedHoldings);
      
      // Fetch live prices for all holdings
      const livePrices = {};
      for (let item of fetchedHoldings) {
        try {
          const quoteRes = await axios.get(`/api/market/quote/${item.symbol}`);
          livePrices[item.symbol] = quoteRes.data.data.regularMarketPrice;
        } catch (e) {
          console.error('Error fetching live price for', item.symbol);
        }
      }
      setLiveData(livePrices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // Calculate Totals
  let totalInvestment = 0;
  let currentPortfolioValue = 0;

  holdings.forEach(item => {
    totalInvestment += (item.quantity * item.averageBuyPrice);
    if (liveData[item.symbol]) {
      currentPortfolioValue += (item.quantity * liveData[item.symbol]);
    } else {
      currentPortfolioValue += (item.quantity * item.averageBuyPrice); // Fallback
    }
  });

  const totalNetWorth = (user?.balance || 0) + currentPortfolioValue;
  const totalProfitLoss = currentPortfolioValue - totalInvestment;
  const totalProfitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">My Portfolio</h1>
      </div>

      {/* Net Worth Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card glass p-6 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="text-gray-400 font-medium mb-1 relative z-10">Total Net Worth</h3>
          <p className="text-4xl font-bold text-gray-900 relative z-10">${totalNetWorth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        
        <div className="card glass p-6">
          <h3 className="text-gray-400 font-medium mb-1">Available Cash</h3>
          <p className="text-3xl font-medium text-gray-900">${(user?.balance || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>

        <div className="card glass p-6">
          <h3 className="text-gray-400 font-medium mb-1">Total Return</h3>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-medium ${totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
            <p className={`text-lg mb-1 ${totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
              ({totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card glass p-6">
        <h2 className="text-xl font-bold mb-6">Current Assets</h2>
        
        {holdings.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-4">You don't own any assets yet.</p>
            <Link to="/dashboard" className="bg-primary hover:bg-primary-dark text-gray-900 px-6 py-2 rounded-lg transition font-medium">
              Go to Market Dashboard
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="pb-3 pl-2 font-medium">Asset</th>
                  <th className="pb-3 font-medium text-right">Quantity</th>
                  <th className="pb-3 font-medium text-right">Avg Price</th>
                  <th className="pb-3 font-medium text-right">Live Price</th>
                  <th className="pb-3 font-medium text-right">Total Value</th>
                  <th className="pb-3 font-medium text-right pr-2">Return</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => {
                  const currentPrice = liveData[item.symbol] || item.averageBuyPrice;
                  const currentValue = item.quantity * currentPrice;
                  const investment = item.quantity * item.averageBuyPrice;
                  const pl = currentValue - investment;
                  const plPercent = (pl / investment) * 100;
                  
                  return (
                    <tr key={item.symbol} className="border-b border-white/5 hover:bg-white/5 transition group">
                      <td className="py-4 pl-2 font-bold text-lg">
                        <Link to="/dashboard" state={{ symbol: item.symbol }} className="hover:text-primary transition">{item.symbol}</Link>
                      </td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">${item.averageBuyPrice.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium">${currentPrice.toFixed(2)}</td>
                      <td className="py-4 text-right font-bold">${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className={`py-4 text-right pr-2 font-medium flex items-center justify-end gap-1 ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {pl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {pl >= 0 ? '+' : ''}${pl.toFixed(2)} ({plPercent.toFixed(2)}%)
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
