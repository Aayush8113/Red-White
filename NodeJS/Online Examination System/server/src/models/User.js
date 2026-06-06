const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const USER_ROLES = ["Admin", "Teacher", "Student"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "Student", index: true },
    batch: { type: String, trim: true, default: "", index: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.methods.setPassword = async function setPassword(plain) {
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(plain, salt);
};

userSchema.methods.verifyPassword = async function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

/** Generates a secure random reset token, stores its hash on the doc, returns the raw token. */
userSchema.methods.generateResetToken = function generateResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  // Store hashed version so raw token isn't usable if DB is leaked
  this.resetPasswordToken = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return raw;
};

const User = mongoose.model("User", userSchema);

module.exports = { User, USER_ROLES };


