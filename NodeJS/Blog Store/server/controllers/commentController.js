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

const getAllComments = async (req, res) => {
  try {
    if (req.user.role !== 'Administrator') {
      return res.status(403).json({ message: 'Access denied. Administrators only.' });
    }

    const comments = await Comment.find({})
      .populate('user', 'name email')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const moderateComment = async (req, res) => {
  try {
    const { action } = req.body; 
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    const blog = await Blog.findById(comment.blogId);
    const isBlogAuthor = blog && blog.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'Administrator';

    if (!isAdmin && !isBlogAuthor) {
      return res.status(401).json({ message: 'User not authorized to moderate this comment.' });
    }

    if (action === 'flag') {
      comment.flagged = true;
    } else if (action === 'unflag' || action === 'approve') {
      comment.flagged = false;
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    const blog = await Blog.findById(comment.blogId);
    const isCommentOwner = comment.user.toString() === req.user.id;
    const isBlogAuthor = blog && blog.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'Administrator';

    if (!isCommentOwner && !isBlogAuthor && !isAdmin) {
      return res.status(401).json({ message: 'User not authorized to delete this comment.' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment successfully removed.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addComment, getComments, getAllComments, moderateComment, deleteComment };