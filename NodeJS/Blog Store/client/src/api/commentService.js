import API from './axiosConfig';

export const fetchComments = async (blogId) => {
  const response = await API.get(`/comments/${blogId}`);
  return response.data;
};

export const addComment = async (blogId, text) => {
  const response = await API.post(`/comments/${blogId}`, { text });
  return response.data;
};

export const fetchSystemComments = async () => {
  const response = await API.get('/comments');
  return response.data;
};

export const moderateComment = async (id, action) => {
  const response = await API.put(`/comments/${id}`, { action });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await API.delete(`/comments/${id}`);
  return response.data;
};