const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  bio: { type: String, default: '' },
  favoriteGenre: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  joinedAt: { type: Date, default: Date.now },
  imageUrl: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=250&auto=format&fit=crop",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);