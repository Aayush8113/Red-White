const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

// Mock data for active screenings since we don't have a model yet
// In a real app, you'd have a ScreenIT model
let mockScreenings = [];

exports.getScreenIT = async (req, res) => {
    try {
        const movies = await Movie.find().limit(500);
        res.render('screenit', {
            user: req.user,
            movies,
            activeScreenings: mockScreenings
        });
    } catch (err) {
        res.status(500).send('ScreenIT load failed.');
    }
};

exports.createScreening = async (req, res) => {
    try {
        const { movieId, theater, showDate, showTime } = req.body;
        const movie = await Movie.findById(movieId);
        
        const newScreening = {
            _id: Math.random().toString(36).substring(7),
            movie,
            theater,
            showDate,
            showTime,
            threshold: 50,
            currentBookings: 1,
            createdBy: req.user._id
        };
        
        mockScreenings.push(newScreening);
        res.redirect('/screenit/browse');
    } catch (err) {
        res.status(500).send('Failed to create screening.');
    }
};

exports.joinScreening = async (req, res) => {
    try {
        const screening = mockScreenings.find(s => s._id === req.params.id);
        if (screening) {
            screening.currentBookings += 1;
            // Reward the referrer (mock logic)
            req.user.rewards.points += 10;
            await req.user.save();
        }
        res.redirect('/screenit/browse');
    } catch (err) {
        res.status(500).send('Failed to join screening.');
    }
};
