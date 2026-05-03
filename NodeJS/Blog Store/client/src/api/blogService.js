import API from './axiosConfig';

export const fetchBlogs = async (category = '') => {
  const url = category ? `/blogs?category=${category}` : '/blogs';
  const response = await API.get(url);
  return response.data;
};

export const fetchBlogById = async (id) => {
  const response = await API.get(`/blogs/${id}`);
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


export const likeBlog = async (id) => {
  const response = await API.put(`/blogs/${id}/like`);
  return response.data;
};