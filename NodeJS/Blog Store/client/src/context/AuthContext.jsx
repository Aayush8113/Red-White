import { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, updateProfile as updateProfileService } from '../api/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData) => {
    const data = await loginService(userData);
    setUser(data);
  };

  const register = async (userData) => {
    const data = await registerService(userData);
    setUser(data);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const data = await updateProfileService(userData);
    setUser((prevUser) => ({ ...prevUser, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};