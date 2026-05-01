import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary-500/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<div className="pt-32 text-center text-4xl">Profile Page Coming Soon</div>} />
            </Routes>
          </main>
          
          <footer className="mt-24 py-12 border-t border-white/5 text-center text-white/20 text-sm">
            &copy; 2026 BookStore Application. Built with MERN Stack & Tailwind CSS.
          </footer>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
