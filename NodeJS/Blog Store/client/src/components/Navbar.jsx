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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>BlogApp</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>Hello, {user.name}</span>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;