import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard'; 
import EditBlog from './pages/EditBlog';     
import AdminDashboard from './pages/AdminDashboard'; 
import CreatorDashboard from './pages/CreatorDashboard';
import RedirectHandler from './pages/RedirectHandler';
import Profile from './pages/Profile'; 
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar /> 
      <div style={{ minHeight: '80vh', backgroundColor: '#fafafa' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/admin" element={<AdminDashboard />} /> 
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<RedirectHandler />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;