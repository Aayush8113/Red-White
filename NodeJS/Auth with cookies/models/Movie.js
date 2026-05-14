const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  leadActor: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  ticketPrice: { type: Number, required: true, min: 1, default: 150 },
  posterUrl: { type: String, required: true },
  
  // Essential Metadata
  releaseDate: { type: Date },
  runtime: { type: Number }, // in minutes
  language: { type: String, default: 'English' },
  producer: { type: String },
  musicDirector: { type: String },
  
  // High-Engagement Assets
  trailerUrl: { type: String },
  teaserUrl: { type: String },
  backdropUrl: { type: String },
  
  // Compliance & UX
  ageRating: { type: String, enum: ['U', 'UA', 'A', 'PG-13', 'R'], default: 'UA' },
  format: { type: String, enum: ['2D', '3D', 'IMAX', '4DX'], default: '2D' },
  
  // Content Intensity (0-10)
  intensity: {
    violence: { type: Number, default: 0 },
    profanity: { type: Number, default: 0 },
    drugUse: { type: Number, default: 0 }
  },
  
  // Future Trends
  arvrSupport: { type: Boolean, default: false },
  
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Movie", movieSchema);
