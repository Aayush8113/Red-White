const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:blogId')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;