import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/api/market/trending');
        setTrending(res.data.data.slice(0, 6)); // top 6
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Master the Markets with <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Real-Time Data</span>
        </h1>
        <p className="text-xl text-gray-400">
          Track stocks and crypto in one place. Add assets to your watchlist and visualize historical data instantly.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="bg-surface hover:bg-surface-hover text-white px-8 py-3 rounded-full font-medium transition">
            Sign In
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="pt-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((item, idx) => (
              <div key={idx} className="card p-6 glass hover:border-primary/50 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition">{item.symbol}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.regularMarketChangePercent > 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    {item.regularMarketChangePercent > 0 ? '+' : ''}{item.regularMarketChangePercent?.toFixed(2)}%
                  </span>
                </div>
                <div className="text-3xl font-light">
                  ${item.regularMarketPrice?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
