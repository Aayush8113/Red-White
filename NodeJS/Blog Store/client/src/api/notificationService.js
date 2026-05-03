import API from './axiosConfig';

export const fetchNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await API.put(`/notifications/${id}/read`);
  return response.data;
};