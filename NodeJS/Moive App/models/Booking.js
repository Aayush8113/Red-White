const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showDate: { type: Date, required: true },
    showTime: {
        type: String,
        required: true,
        enum: ['10:00 AM', '1:30 PM', '4:00 PM', '6:30 PM', '9:30 PM']
    },
    seats: { type: Number, required: true, min: 1, max: 10 },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
