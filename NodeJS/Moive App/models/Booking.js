const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    theater: {
        name: { type: String, required: true },
        location: { type: String },
        screen: { type: String }
    },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },
    seats: [{ type: String }], // Array of seat IDs like 'A1', 'A2'
    numberOfSeats: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    isStudent: { type: Boolean, default: false },
    studentIdUrl: { type: String },
    snacks: [{
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number }
    }],
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    },
    ticketId: { type: String, unique: true },
    bookedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function(next) {
    if (!this.ticketId) {
        this.ticketId = 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
