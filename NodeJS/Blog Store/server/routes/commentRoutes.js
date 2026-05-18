const express = require('express');
const router = express.Router();
const { addComment, getComments, getAllComments, moderateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// System-wide comments routes (Admin/moderation)
router.route('/')
  .get(protect, getAllComments);

router.route('/:id')
  .put(protect, moderateComment)
  .delete(protect, deleteComment);

// Blog-specific comments
router.route('/:blogId')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;