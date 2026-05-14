const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Middleware to check admin role
exports.requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.redirect('/dashboard');
};

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
        const totalRevenue = (await Booking.find({ status: 'confirmed' }))
            .reduce((sum, b) => sum + b.totalPrice, 0);
        const totalReviews = await Review.countDocuments();

        const users = await User.find().sort({ joinedAt: -1 }).limit(20);
        const recentMovies = await Movie.find().populate('addedBy', 'fullName username').sort({ createdAt: -1 }).limit(10);
        const recentBookings = await Booking.find()
            .populate('movie', 'title')
            .populate('user', 'fullName username')
            .sort({ bookedAt: -1 })
            .limit(10);

        // Genre distribution
        const genrePipeline = await Movie.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.render('admin', {
            stats: { totalUsers, totalMovies, totalBookings, totalRevenue, totalReviews },
            users,
            recentMovies,
            recentBookings,
            genreDistribution: genrePipeline
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Admin dashboard failed.');
    }
};

exports.toggleUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user._id.toString() === req.user._id.toString()) {
            return res.redirect('/admin');
        }
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) return res.redirect('/admin');
        await Movie.deleteMany({ addedBy: req.params.id });
        await Booking.deleteMany({ user: req.params.id });
        await Review.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
};

exports.deleteAnyMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        await Review.deleteMany({ movie: req.params.id });
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
};
