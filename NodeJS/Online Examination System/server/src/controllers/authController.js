const crypto = require("crypto");
const { User } = require("../models/User");
const { signAccessToken } = require("../lib/jwt");
const { httpError } = require("../utils/httpError");
const { sendPasswordResetEmail } = require("../lib/mailer");
const { env } = require("../config/env");

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) throw httpError(400, "name, email, password are required.");

    const existing = await User.findOne({ email: String(email).toLowerCase() }).lean();
    if (existing) throw httpError(409, "Email already in use.");

    const user = new User({
      name: String(name),
      email: String(email).toLowerCase(),
      role: "Student",
      passwordHash: "placeholder",
    });
    await user.setPassword(String(password));
    await user.save();

    const token = signAccessToken({ sub: String(user._id), role: user.role });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw httpError(400, "email and password are required.");

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash");
    if (!user) throw httpError(401, "Invalid credentials.");

    const ok = await user.verifyPassword(String(password));
    if (!ok) throw httpError(401, "Invalid credentials.");

    const token = signAccessToken({ sub: String(user._id), role: user.role });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) throw httpError(400, "email is required.");

    const user = await User.findOne({ email: String(email).toLowerCase() });

    // Always respond success to avoid revealing if an email is registered
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const rawToken = user.generateResetToken();
    await user.save();

    // Build reset link pointing at the client app
    const clientBase = env.CLIENT_ORIGIN.split(",")[0].trim();
    const resetLink = `${clientBase}/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) throw httpError(400, "token and password are required.");
    if (String(password).length < 6) throw httpError(400, "Password must be at least 6 characters.");

    // Hash the incoming token to compare against the stored hash
    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+passwordHash +resetPasswordToken +resetPasswordExpires");

    if (!user) throw httpError(400, "Reset token is invalid or has expired.");

    await user.setPassword(String(password));
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, forgotPassword, resetPassword };


