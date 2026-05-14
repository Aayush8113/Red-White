const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('movie')
            .sort({ bookedAt: -1 });

        const activeBookings = bookings.filter(b => b.status === 'confirmed' && b.movie);
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
        const totalSpent = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        res.render('bookings', {
            bookings,
            stats: {
                totalBookings: activeBookings.length,
                totalSpent,
                cancelledCount: cancelledBookings.length
            },
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        res.status(500).send('Failed to load bookings.');
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { movieId, showDate, showTime, seats } = req.body;

        // Validate movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) return res.redirect('/dashboard?error=movie_not_found');

        // Validate date is in future
        const bookDate = new Date(showDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookDate < today) return res.redirect('/dashboard?error=past_date');

        const seatCount = parseInt(seats);
        if (seatCount < 1 || seatCount > 10) return res.redirect('/dashboard?error=invalid_seats');

        // Use the movie's own ticket price set by the director
        const pricePerSeat = movie.ticketPrice || 150;
        const totalPrice = seatCount * pricePerSeat;

        await Booking.create({
            movie: movieId,
            user: req.user._id,
            showDate: bookDate,
            showTime,
            seats: seatCount,
            totalPrice
        });

        res.redirect('/bookings?success=booked');
    } catch (err) {
        res.redirect('/dashboard?error=booking_failed');
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'confirmed'
        });

        if (!booking) return res.redirect('/bookings?error=not_found');

        booking.status = 'cancelled';
        await booking.save();

        res.redirect('/bookings?success=cancelled');
    } catch (err) {
        res.redirect('/bookings?error=cancel_failed');
    }
};
