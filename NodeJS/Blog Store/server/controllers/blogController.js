const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    
    const blogs = await Blog.find(filter).populate('author', 'name email');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = await Blog.create({
      title,
      content,
      category,
      author: req.user.id 
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

module.exports = { getBlogs, createBlog };