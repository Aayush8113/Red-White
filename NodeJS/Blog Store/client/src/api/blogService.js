import API from './axiosConfig';

export const fetchBlogs = async (category = '', search = '') => {
  let url = '/blogs?';
  if (category) url += `category=${encodeURIComponent(category)}&`;
  if (search) url += `search=${encodeURIComponent(search)}`;
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


export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  

  const response = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const importXmlBlogs = async (xmlData) => {
  const response = await API.post('/blogs/import/xml', { xmlData });
  return response.data;
};

export const importJsonBlogs = async (jsonData) => {
  const response = await API.post('/blogs/import/json', { jsonData });
  return response.data;
};

export const resolveRedirect = async (path) => {
  const response = await API.get(`/blogs/redirect?path=${encodeURIComponent(path)}`);
  return response.data;
};

export const fetchRedirects = async () => {
  const response = await API.get('/blogs/redirects');
  return response.data;
};

export const deleteRedirect = async (id) => {
  const response = await API.delete(`/blogs/redirects/${id}`);
  return response.data;
};