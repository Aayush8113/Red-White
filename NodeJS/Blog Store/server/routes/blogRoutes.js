const express = require('express');
const router = express.Router();
const { getBlogs, createBlog, updateBlog, deleteBlog, toggleLike } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .put(protect, toggleLike);

module.exports = router;