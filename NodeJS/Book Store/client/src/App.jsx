import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Sell from './pages/Sell';
import AdminDashboard from './pages/AdminDashboard';
import EditBook from './pages/EditBook';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/book/:id/edit" element={<EditBook />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
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
