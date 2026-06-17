const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routers
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/market', require('./src/routes/marketRoutes'));
app.use('/api/watchlist', require('./src/routes/watchlistRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Market Analytics API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
