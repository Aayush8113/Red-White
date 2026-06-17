const express = require('express');
const router = express.Router();
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// @route   GET /api/market/quote/:symbol
// @desc    Get real-time quote for a stock or crypto
router.get('/quote/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const quote = await yahooFinance.quote(symbol);
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quote', error: error.message });
  }
});

// @route   GET /api/market/chart/:symbol
// @desc    Get historical chart data
router.get('/chart/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const period1 = req.query.from || '2020-01-01'; // Default start
    const queryOptions = { period1: period1, interval: req.query.interval || '1d' };
    const result = await yahooFinance.chart(symbol, queryOptions);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chart data', error: error.message });
  }
});

// @route   GET /api/market/trending
// @desc    Get trending symbols
router.get('/trending', async (req, res) => {
  try {
    const queryOptions = { count: 10, lang: 'en-US' };
    const result = await yahooFinance.trendingSymbols('US', queryOptions);
    res.json({ success: true, data: result.quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending', error: error.message });
  }
});

module.exports = router;
