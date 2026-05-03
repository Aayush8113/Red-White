import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard'; 
import EditBlog from './pages/EditBlog';   

function App() {
  return (
    <Router>
      <Navbar /> 
      <div style={{ minHeight: '80vh', backgroundColor: '#fafafa', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/edit/:id" element={<EditBlog />} />    
        </Routes>
      </div>
    </Router>
  );
}

export default App;