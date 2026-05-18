const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  favoriteGenre: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // admin = Director
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  
  // Tracking & Sync
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  watchHistory: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    watchedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 } // Percentage
  }],
  
  // Rewards & Social
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  rewards: {
    points: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }
  },
  
  // Security
  parentalPin: { type: String }, // PIN for mature content
  
  joinedAt: { type: Date, default: Date.now },
  imageUrl: {
    type: String,
    default: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=250&auto=format&fit=crop",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  // Generate referral code if not exists
  if (!this.referralCode) {
    this.referralCode = 'SCREENIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);