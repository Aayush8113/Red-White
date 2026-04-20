require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists (prevents crash on fresh installs)
fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Setup views & static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Connected to MongoDB'))
  .catch(err => console.error('DB connection failed:', err));

// Routes
app.get('/', (req, res) => res.redirect('/todos'));
app.use('/todos', require('./routes/todoRoutes')); // Inline import for cleaner code

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});