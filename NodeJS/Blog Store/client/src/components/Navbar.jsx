import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#333', color: '#fff', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>BlogApp</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            {user.role === 'Administrator' && (
              <Link to="/admin" style={{ color: '#ffc107', textDecoration: 'none', fontWeight: 'bold', marginRight: '10px' }}>Admin Panel</Link>
            )}
            
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/create" style={{ color: '#fff', textDecoration: 'none', border: '1px solid #fff', padding: '5px 10px', borderRadius: '4px' }}>
              + Create Post
            </Link>

            <Link to="/profile" style={{ marginLeft: '10px', color: '#aaa', textDecoration: 'none' }}>| {user.name}</Link>
            
            <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '4px', marginLeft: '10px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none', backgroundColor: '#007bff', padding: '5px 10px', borderRadius: '4px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;