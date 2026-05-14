const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

// One review per user per movie
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
