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
        const { movieId, showDate, showTime, seatCount, theater, isStudent, seats } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) return res.redirect('/dashboard?error=movie_not_found');

        const bookDate = new Date(showDate);
        const pricePerSeat = movie.ticketPrice || 150;
        let totalPrice = parseInt(seatCount) * pricePerSeat;

        // Student discount (10% off)
        if (isStudent === 'true') {
            totalPrice = totalPrice * 0.9;
        }

        // Mock seat selection if not provided
        const seatArray = seats ? seats.split(',') : Array.from({ length: seatCount }, (_, i) => `A${i + 1}`);

        const booking = await Booking.create({
            movie: movieId,
            user: req.user._id,
            theater: {
                name: theater || 'Neo Multiplex',
                screen: 'Screen 01',
                location: 'Downtown Hub'
            },
            showDate: bookDate,
            showTime,
            numberOfSeats: parseInt(seatCount),
            seats: seatArray,
            totalPrice,
            isStudent: isStudent === 'true'
        });

        res.redirect(`/ticket/${booking._id}`);
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard?error=booking_failed');
    }
};

exports.getTicket = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('movie');
        if (!booking || booking.user.toString() !== req.user._id.toString()) {
            return res.redirect('/bookings');
        }
        res.render('ticket', { booking, user: req.user });
    } catch (err) {
        res.redirect('/bookings');
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

