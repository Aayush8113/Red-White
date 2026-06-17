const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/watchlist
// @desc    Get user watchlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user.watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/watchlist
// @desc    Add symbol to watchlist
router.post('/', protect, async (req, res) => {
  try {
    const { symbol, type } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already in watchlist
    if (user.watchlist.some(item => item.symbol === symbol.toUpperCase())) {
       return res.status(400).json({ success: false, message: 'Symbol already in watchlist' });
    }

    user.watchlist.push({ symbol: symbol.toUpperCase(), type: type || 'stock' });
    await user.save();

    res.status(201).json({ success: true, data: user.watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/watchlist/:symbol
// @desc    Remove symbol from watchlist
router.delete('/:symbol', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.watchlist = user.watchlist.filter(item => item.symbol !== req.params.symbol.toUpperCase());
    await user.save();

    res.status(200).json({ success: true, data: user.watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
