import API from './axiosConfig';

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const updateProfile = async (userData) => {
  const response = await API.put('/users/profile', userData);
  const existingUser = JSON.parse(localStorage.getItem('userInfo'));
  const updatedStorage = { ...existingUser, ...response.data };
  localStorage.setItem('userInfo', JSON.stringify(updatedStorage));
  return response.data;
};