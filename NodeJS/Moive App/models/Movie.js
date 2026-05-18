const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  leadActor: { type: String, required: true },
  cast: [{ type: String }],
  crew: {
    producer: { type: String },
    musicDirector: { type: String },
    cinematographer: { type: String },
    editor: { type: String }
  },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  criticalRating: { type: Number, default: 0 },
  userRating: { type: Number, default: 0 },
  ticketPrice: { type: Number, required: true, min: 1, default: 150 },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String },
  
  // Essential Metadata
  releaseDate: { type: Date },
  runtime: { type: Number }, // in minutes
  language: { type: String, default: 'English' },
  languagesAvailable: [{ type: String }],
  subtitles: [{ type: String }],
  
  // High-Engagement Assets
  trailerUrl: { type: String },
  teaserUrl: { type: String },
  
  // Streaming Info
  streamingPlatforms: [{
    name: { type: String },
    url: { type: String },
    logo: { type: String }
  }],
  
  // Compliance & UX
  ageRating: { type: String, enum: ['U', 'UA', 'A', 'PG-13', 'R'], default: 'UA' },
  format: { type: String, enum: ['2D', '3D', 'IMAX', '4DX'], default: '2D' },
  
  // Content Intensity (0-10)
  intensity: {
    violence: { type: Number, default: 0 },
    profanity: { type: Number, default: 0 },
    drugUse: { type: Number, default: 0 }
  },
  
  // ScreenIT Features
  isScreenIT: { type: Boolean, default: false },
  bookingThreshold: { type: Number, default: 50 },
  currentBookings: { type: Number, default: 0 },
  
  // Future Trends
  arvrSupport: { type: Boolean, default: false },
  
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movie", movieSchema);
