const express = require('express');
const {
    getBooks,
    getBookById,
    deleteBook,
    createBook,
    updateBook,
    createBookReview,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id/reviews').post(protect, createBookReview);
router
    .route('/:id')
    .get(getBookById)
    .delete(protect, admin, deleteBook)
    .put(protect, admin, updateBook);

module.exports = router;
