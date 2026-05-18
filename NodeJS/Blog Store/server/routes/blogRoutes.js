const express = require('express');
const router = express.Router();
const { 
  getBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  toggleLike,
  importXmlBlogs,
  importJsonBlogs,
  resolveRedirect,
  getRedirects,
  deleteRedirect
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Redirect routes
router.route('/redirect')
  .get(resolveRedirect);

router.route('/redirects')
  .get(protect, getRedirects);

router.route('/redirects/:id')
  .delete(protect, deleteRedirect);

// Import routes
router.route('/import/xml')
  .post(protect, importXmlBlogs);

router.route('/import/json')
  .post(protect, importJsonBlogs);

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .put(protect, toggleLike);

module.exports = router;