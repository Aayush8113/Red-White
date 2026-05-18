const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const bookingController = require('../controllers/bookingController');
const adminController = require('../controllers/adminController');
const { requireSession } = require('../middleware/authMiddleware');
const { uploadPoster } = require('../middleware/upload');

const screenitController = require('../controllers/screenitController');

// Dashboard with pagination
router.get('/dashboard', requireSession, movieController.getDashboard);

// ScreenIT
router.get('/screenit/browse', requireSession, screenitController.getScreenIT);
router.get('/screenit/create', requireSession, screenitController.getScreenIT); // Same view handles creation form
router.post('/screenit/create', requireSession, screenitController.createScreening);
router.get('/screenit/join/:id', requireSession, screenitController.joinScreening);

// Tickets
router.get('/ticket/:id', requireSession, bookingController.getTicket);

// Movie CRUD
router.post('/movies/add', requireSession, uploadPoster.single('posterFile'), movieController.addMovie);
router.post('/movies/delete/:id', requireSession, movieController.deleteMovie);
router.post('/movies/update/:id', requireSession, uploadPoster.single('posterFile'), movieController.updateMovie);

// Movie Detail Page
router.get('/movies/:id', requireSession, movieController.getMovieDetail);

// Reviews
router.post('/movies/:id/review', requireSession, movieController.addReview);
router.post('/movies/:id/review/:reviewId/delete', requireSession, movieController.deleteReview);

// Watchlist
router.post('/watchlist/toggle/:id', requireSession, movieController.toggleWatchlist);
router.get('/watchlist', requireSession, movieController.getWatchlist);

// Theme toggle
router.post('/toggle-theme', requireSession, movieController.toggleTheme);

// Booking routes
router.get('/bookings', requireSession, bookingController.getBookings);
router.post('/bookings/create', requireSession, bookingController.createBooking);
router.post('/bookings/cancel/:id', requireSession, bookingController.cancelBooking);

// Admin routes
router.get('/admin', requireSession, adminController.requireAdmin, adminController.getAdminDashboard);
router.post('/admin/user/:id/role', requireSession, adminController.requireAdmin, adminController.toggleUserRole);
router.post('/admin/user/:id/delete', requireSession, adminController.requireAdmin, adminController.deleteUser);
router.post('/admin/movie/:id/delete', requireSession, adminController.requireAdmin, adminController.deleteAnyMovie);

module.exports = router;