import API from './axiosConfig';

export const fetchBlogs = async (category = '') => {
  const response = await API.get(`/blogs${category ? `?category=${category}` : ''}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await API.post('/blogs', blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await API.put(`/blogs/${id}`, blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await API.delete(`/blogs/${id}`);
  return response.data;
};