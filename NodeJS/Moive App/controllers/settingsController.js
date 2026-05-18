const User = require('../models/User');
const Movie = require('../models/Movie');

exports.getSettings = async (req, res) => {
    try {
        let stats = { total: 0, avgRating: 0, topGenre: 'None' };

        if (req.user.role === 'admin') {
            // Director Stats: Based on movies they've added
            const movies = await Movie.find({ addedBy: req.user._id });
            if (movies.length > 0) {
                const totalRating = movies.reduce((sum, m) => sum + m.rating, 0);
                stats.total = movies.length;
                stats.avgRating = (totalRating / movies.length).toFixed(1);

                const genreCounts = {};
                movies.forEach(m => {
                    genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
                });
                stats.topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0];
            }
        } else {
            // User Stats: Based on their watchlist and history
            const watchlistCount = req.user.watchlist ? req.user.watchlist.length : 0;
            const historyCount = req.user.watchHistory ? req.user.watchHistory.length : 0;
            
            stats.total = historyCount; // Total movies watched
            stats.avgRating = (watchlistCount > 0) ? (watchlistCount * 0.5).toFixed(1) : '0.0'; // Pseudo-metric for engagement
            stats.topGenre = req.user.favoriteGenre || 'Discovery';
        }

        res.render('settings', {
            user: req.user,
            stats,
            success: req.query.success || null,
            error: req.query.error || null,
        });
    } catch (err) {
        console.error('Settings Error:', err);
        res.status(500).send('Failed to load settings.');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { fullName, bio, favoriteGenre, imageUrl } = req.body;

        // If file uploaded via multer, use that path; otherwise use the URL
        let finalImageUrl = imageUrl ? imageUrl.trim() : '';
        if (req.file) {
            finalImageUrl = '/uploads/avatars/' + req.file.filename;
        }

        await User.findByIdAndUpdate(req.user._id, {
            fullName: fullName.trim(),
            bio: bio.trim(),
            favoriteGenre,
            imageUrl: finalImageUrl || req.user.imageUrl,
        });
        res.redirect('/settings?success=profile');
    } catch (err) {
        res.redirect('/settings?error=profile');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.redirect('/settings?error=mismatch');
        }
        if (newPassword.length < 6) {
            return res.redirect('/settings?error=short');
        }

        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.redirect('/settings?error=wrongpassword');
        }

        user.password = newPassword;
        await user.save();
        res.redirect('/settings?success=password');
    } catch (err) {
        res.redirect('/settings?error=password');
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await Movie.deleteMany({ addedBy: req.user._id });
        await User.findByIdAndDelete(req.user._id);
        res.clearCookie('auth_session');
        res.redirect('/signup');
    } catch (err) {
        res.redirect('/settings?error=delete');
    }
};
