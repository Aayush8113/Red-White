const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = await Comment.create({
      text,
      blogId: req.params.blogId,
      user: req.user.id
    });


    if (blog.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: blog.author,
        sender: req.user.id,
        blogId: blog._id,
        type: 'comment',
        message: 'commented on your post'
      });
    }

    const populatedComment = await comment.populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addComment, getComments };