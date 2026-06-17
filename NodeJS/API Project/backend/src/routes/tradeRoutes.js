const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');
const yahooFinance = require('yahoo-finance2').default;

// @route   GET /api/trade/portfolio
// @desc    Get user's portfolio and balance
router.get('/portfolio', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    const holdings = await Portfolio.find({ user: req.user._id, quantity: { $gt: 0 } });
    
    // Optional: Fetch live prices for current holdings to calculate live total
    res.json({ success: true, data: { balance: user.balance, holdings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/trade/buy
// @desc    Execute a BUY order
router.post('/buy', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || quantity <= 0) return res.status(400).json({ success: false, message: 'Invalid quantity or symbol' });

    // 1. Fetch exact live price
    const quote = await yahooFinance.quote(symbol.toUpperCase());
    if (!quote || !quote.regularMarketPrice) return res.status(400).json({ success: false, message: 'Could not fetch price for symbol' });
    
    const price = quote.regularMarketPrice;
    const totalCost = price * quantity;

    // 2. Check balance
    const user = await User.findById(req.user._id);
    if (user.balance < totalCost) {
      return res.status(400).json({ success: false, message: 'Insufficient funds' });
    }

    // 3. Deduct balance
    user.balance -= totalCost;
    await user.save();

    // 4. Update Portfolio
    let portfolioItem = await Portfolio.findOne({ user: user._id, symbol: symbol.toUpperCase() });
    if (portfolioItem) {
      // Calculate new average buy price
      const totalValueBefore = portfolioItem.quantity * portfolioItem.averageBuyPrice;
      portfolioItem.quantity += quantity;
      portfolioItem.averageBuyPrice = (totalValueBefore + totalCost) / portfolioItem.quantity;
      await portfolioItem.save();
    } else {
      portfolioItem = await Portfolio.create({
        user: user._id,
        symbol: symbol.toUpperCase(),
        quantity,
        averageBuyPrice: price
      });
    }

    // 5. Log Transaction
    await Transaction.create({
      user: user._id,
      symbol: symbol.toUpperCase(),
      type: 'BUY',
      quantity,
      price,
      totalAmount: totalCost
    });

    res.json({ success: true, message: `Successfully bought ${quantity} shares of ${symbol.toUpperCase()}`, balance: user.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/trade/sell
// @desc    Execute a SELL order
router.post('/sell', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || quantity <= 0) return res.status(400).json({ success: false, message: 'Invalid quantity or symbol' });

    // 1. Check Portfolio
    const portfolioItem = await Portfolio.findOne({ user: req.user._id, symbol: symbol.toUpperCase() });
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity owned' });
    }

    // 2. Fetch exact live price
    const quote = await yahooFinance.quote(symbol.toUpperCase());
    if (!quote || !quote.regularMarketPrice) return res.status(400).json({ success: false, message: 'Could not fetch price for symbol' });
    
    const price = quote.regularMarketPrice;
    const totalReturn = price * quantity;

    // 3. Add to balance
    const user = await User.findById(req.user._id);
    user.balance += totalReturn;
    await user.save();

    // 4. Deduct from Portfolio
    portfolioItem.quantity -= quantity;
    await portfolioItem.save();

    // 5. Log Transaction
    await Transaction.create({
      user: user._id,
      symbol: symbol.toUpperCase(),
      type: 'SELL',
      quantity,
      price,
      totalAmount: totalReturn
    });

    res.json({ success: true, message: `Successfully sold ${quantity} shares of ${symbol.toUpperCase()}`, balance: user.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/trade/transactions
// @desc    Get user's transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
