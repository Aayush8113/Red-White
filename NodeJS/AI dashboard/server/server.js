import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { router as apiRouter, seedDatabase } from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aetherforgedb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory (fallback)',
    uptime: process.uptime()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Bootstrapping function
const startServer = async () => {
  console.log('Starting AetherForge Server...');
  try {
    // Set a timeout so Mongoose doesn't block server startup indefinitely if MongoDB isn't running
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('SUCCESS: Connected to MongoDB.');
    await seedDatabase();
  } catch (err) {
    console.warn('WARNING: Could not connect to MongoDB. Booting server in In-Memory fallback mode.');
    console.warn('Reason:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`AetherForge Backend running on http://localhost:${PORT}`);
  });
};

startServer();
