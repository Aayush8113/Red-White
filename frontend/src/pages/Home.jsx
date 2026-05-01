import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 py-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Discover Your Next <br />
            <span className="text-gradient">Favorite Story</span>
          </h1>
          <p className="mt-6 text-white/60 text-lg max-w-xl">
            Explore our curated collection of books from world-class authors. 
            From timeless classics to modern bestsellers, find the perfect read for every mood.
          </p>
          <div className="mt-10 flex gap-4">
            <Link to="/shop" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all font-semibold">
              Browse Catalog <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="glass hover:bg-white/10 text-white px-8 py-4 rounded-xl transition-all font-semibold">
              Join Community
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 relative"
        >
          <div className="w-full aspect-[4/5] bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-3xl relative overflow-hidden glass">
             <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" 
                  alt="Featured Book" 
                  className="w-2/3 shadow-2xl rounded-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                />
             </div>
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-slow">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
            </div>
            <div>
              <p className="font-bold">4.9/5 Rating</p>
              <p className="text-sm text-white/40">From 2k+ readers</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Books Placeholder */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-4 rounded-2xl group hover:border-primary-500/50 transition-all">
              <div className="aspect-[3/4] bg-white/5 rounded-xl mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10" />
              </div>
              <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-6 w-16 bg-primary-500/20 rounded" />
                <div className="h-8 w-8 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
