const Movie = require('../models/Movie');
const Review = require('../models/Review');

const MOVIES_PER_PAGE = 12;

exports.getDashboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const totalMovies = await Movie.countDocuments({ addedBy: req.user._id });
        const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE) || 1;
        const skip = (page - 1) * MOVIES_PER_PAGE;

        const movies = await Movie.find({ addedBy: req.user._id })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(MOVIES_PER_PAGE);

        let avgRating = 0;
        if (totalMovies > 0) {
            const allMovies = await Movie.find({ addedBy: req.user._id });
            const totalRating = allMovies.reduce((sum, m) => sum + m.rating, 0);
            avgRating = (totalRating / totalMovies).toFixed(1);
        }

        const directors = [...new Set((await Movie.find({ addedBy: req.user._id })).map(m => m.director))].sort();

        // Recommendations based on favorite genre
        let recommendations = [];
        if (req.user.favoriteGenre) {
            recommendations = await Movie.find({
                genre: req.user.favoriteGenre,
                addedBy: { $ne: req.user._id }
            }).limit(4).sort({ rating: -1 });
        }
        if (recommendations.length < 4) {
            const moreRecs = await Movie.find({
                addedBy: { $ne: req.user._id },
                _id: { $nin: recommendations.map(r => r._id) }
            }).limit(4 - recommendations.length).sort({ rating: -1 });
            recommendations = [...recommendations, ...moreRecs];
        }

        const showToast = req.query.added === '1';
        res.render('dashboard', {
            movies,
            directors,
            recommendations,
            stats: { total: totalMovies, avgRating },
            pagination: { page, totalPages, totalMovies },
            showToast,
            watchlist: req.user.watchlist || []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Dashboard render failed.');
    }
};

exports.getMovieDetail = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('addedBy', 'fullName username imageUrl');
        if (!movie) return res.redirect('/dashboard');

        const reviews = await Review.find({ movie: movie._id })
            .populate('user', 'fullName username imageUrl')
            .sort({ createdAt: -1 });

        const userReview = reviews.find(r => r.user._id.toString() === req.user._id.toString());
        const avgReviewRating = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : null;

        const isInWatchlist = req.user.watchlist && req.user.watchlist.some(
            id => id.toString() === movie._id.toString()
        );

        // Related movies (same genre)
        const related = await Movie.find({
            genre: movie.genre,
            _id: { $ne: movie._id }
        }).limit(4).sort({ rating: -1 });

        res.render('movieDetail', {
            movie,
            reviews,
            userReview,
            avgReviewRating,
            isInWatchlist,
            related
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

exports.addMovie = async (req, res) => {
    try {
        const { 
            title, director, leadActor, description, genre, rating, posterUrl, ticketPrice,
            releaseDate, runtime, language, producer, musicDirector,
            trailerUrl, teaserUrl, backdropUrl,
            ageRating, format, arvrSupport,
            intensity_violence, intensity_profanity, intensity_drugUse
        } = req.body;

        let finalPosterUrl = posterUrl || '';
        if (req.file) {
            finalPosterUrl = '/uploads/posters/' + req.file.filename;
        }
        if (!finalPosterUrl) return res.redirect('/dashboard');

        await Movie.create({
            title, director, leadActor, description, genre, rating,
            ticketPrice: ticketPrice || 150,
            posterUrl: finalPosterUrl,
            releaseDate, runtime, language, producer, musicDirector,
            trailerUrl, teaserUrl, backdropUrl,
            ageRating, format,
            arvrSupport: arvrSupport === 'on',
            intensity: {
                violence: parseInt(intensity_violence) || 0,
                profanity: parseInt(intensity_profanity) || 0,
                drugUse: parseInt(intensity_drugUse) || 0
            },
            addedBy: req.user._id
        });
        res.redirect('/dashboard?added=1');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add movie.');
    }
};


exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findOneAndDelete({ _id: req.params.id, addedBy: req.user._id });
        await Review.deleteMany({ movie: req.params.id });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Failed to delete movie.');
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { 
            title, director, leadActor, description, genre, rating, posterUrl, ticketPrice,
            releaseDate, runtime, language, producer, musicDirector,
            trailerUrl, teaserUrl, backdropUrl,
            ageRating, format, arvrSupport,
            intensity_violence, intensity_profanity, intensity_drugUse
        } = req.body;

        let finalPosterUrl = posterUrl || '';
        if (req.file) {
            finalPosterUrl = '/uploads/posters/' + req.file.filename;
        }

        const updateData = { 
            title, director, leadActor, description, genre, rating, 
            ticketPrice: ticketPrice || 150,
            releaseDate, runtime, language, producer, musicDirector,
            trailerUrl, teaserUrl, backdropUrl,
            ageRating, format,
            arvrSupport: arvrSupport === 'on',
            intensity: {
                violence: parseInt(intensity_violence) || 0,
                profanity: parseInt(intensity_profanity) || 0,
                drugUse: parseInt(intensity_drugUse) || 0
            }
        };
        if (finalPosterUrl) updateData.posterUrl = finalPosterUrl;

        await Movie.findOneAndUpdate(
            { _id: req.params.id, addedBy: req.user._id },
            updateData
        );
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update movie.');
    }
};


// ── Reviews ──
exports.addReview = async (req, res) => {
    try {
        const { rating, text } = req.body;
        await Review.findOneAndUpdate(
            { movie: req.params.id, user: req.user._id },
            { rating, text, createdAt: Date.now() },
            { upsert: true, new: true }
        );
        res.redirect('/movies/' + req.params.id);
    } catch (err) {
        res.redirect('/movies/' + req.params.id);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user._id });
        res.redirect('/movies/' + req.params.id);
    } catch (err) {
        res.redirect('/movies/' + req.params.id);
    }
};

// ── Watchlist ──
exports.toggleWatchlist = async (req, res) => {
    try {
        const movieId = req.params.id;
        const user = req.user;
        const idx = user.watchlist.indexOf(movieId);

        if (idx > -1) {
            user.watchlist.splice(idx, 1);
        } else {
            user.watchlist.push(movieId);
        }
        await user.save();

        // Return JSON for AJAX or redirect
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ inWatchlist: idx === -1 });
        }
        res.redirect('back');
    } catch (err) {
        res.redirect('/dashboard');
    }
};

exports.getWatchlist = async (req, res) => {
    try {
        const user = await req.user.populate('watchlist');
        res.render('watchlist', { watchlistMovies: user.watchlist });
    } catch (err) {
        res.status(500).send('Failed to load watchlist.');
    }
};

// ── Theme Toggle ──
exports.toggleTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        if (theme && (theme === 'dark' || theme === 'light')) {
            req.user.theme = theme;
        } else {
            req.user.theme = req.user.theme === 'dark' ? 'light' : 'dark';
        }
        await req.user.save();
        res.json({ theme: req.user.theme });
    } catch (err) {
        res.json({ theme: req.user.theme || 'dark' });
    }
};