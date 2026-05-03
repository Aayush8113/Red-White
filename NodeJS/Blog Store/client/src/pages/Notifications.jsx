import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationRead } from '../api/notificationService';
import { AuthContext } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, [user, navigate]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p style={{ color: 'gray', marginTop: '20px' }}>You have no new notifications.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: n.isRead ? '#f9f9f9' : '#e6f2ff', border: '1px solid #ddd', borderRadius: '6px' }}>
              <div>
                <strong>{n.sender?.name || 'Someone'}</strong> {n.message}: <br/>
                <Link to={`/blog/${n.blogId?._id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                  "{n.blogId?.title || 'Deleted Post'}"
                </Link>
                <div style={{ fontSize: '0.8rem', color: 'gray', marginTop: '5px' }}>{new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
              {!n.isRead && (
                <button onClick={() => handleRead(n._id)} style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;