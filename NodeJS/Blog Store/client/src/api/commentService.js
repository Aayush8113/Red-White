import API from './axiosConfig';

export const fetchComments = async (blogId) => {
  const response = await API.get(`/comments/${blogId}`);
  return response.data;
};

export const addComment = async (blogId, text) => {
  const response = await API.post(`/comments/${blogId}`, { text });
  return response.data;
};