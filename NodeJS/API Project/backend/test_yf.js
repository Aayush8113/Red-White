const yahooFinance = require('yahoo-finance2').default;

async function test() {
  try {
    console.log("Fetching AAPL...");
    const quote = await yahooFinance.quote('AAPL');
    console.log("Price:", quote.regularMarketPrice);
    
    console.log("Fetching trending...");
    const trending = await yahooFinance.trendingSymbols('US', { count: 5 });
    console.log("Trending:", trending.quotes.map(q => q.symbol));
  } catch (err) {
    console.error("Error:", err.message, err.stack);
  }
}
test();
