const Blog = require('../models/Blog');
const Notification = require('../models/Notification');

const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' }; 
    
    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, category, coverImage } = req.body;
    
    const newBlog = await Blog.create({
      title,
      content,
      category,
      coverImage,
      author: req.user._id
    });
    
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(401).json({ message: 'User not authorized to update this blog' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'Administrator') {
      return res.status(401).json({ message: 'User not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user.id;
    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
      
      if (blog.author.toString() !== userId) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          blogId: blog._id,
          type: 'like',
          message: 'liked your post'
        });
      }
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, toggleLike };