const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  averageBuyPrice: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;
