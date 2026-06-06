const crypto = require("crypto");
const { User } = require("../models/User");
const { signAccessToken } = require("../lib/jwt");
const { httpError } = require("../utils/httpError");
const { sendPasswordResetEmail, sendContactEmail, sendWelcomeEmail } = require("../lib/mailer");
const { env } = require("../config/env");

// ─── register ────────────────────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
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

    // Fire-and-forget welcome email (don't block registration on mail failure)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.warn("Welcome email failed:", err.message)
    );

    const token = signAccessToken({ sub: String(user._id), role: user.role });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// ─── login ───────────────────────────────────────────────────────────────────
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

// ─── forgotPassword ──────────────────────────────────────────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) throw httpError(400, "email is required.");

    const user = await User.findOne({ email: String(email).toLowerCase() });

    // Always respond success — never reveal whether email is registered
    if (!user) {
      return res.json({ message: "If that email is registered, a reset link has been sent." });
    }

    const rawToken = user.generateResetToken();
    await user.save();

    // Dynamic link: uses CLIENT_ORIGIN from .env (first entry if multiple)
    const clientBase = env.CLIENT_ORIGIN.split(",")[0].trim();
    const resetLink = `${clientBase}/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
}

// ─── resetPassword ───────────────────────────────────────────────────────────
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) throw httpError(400, "token and password are required.");
    if (String(password).length < 6) throw httpError(400, "Password must be at least 6 characters.");

    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+passwordHash +resetPasswordToken +resetPasswordExpires");

    if (!user) throw httpError(400, "Reset link is invalid or has expired. Please request a new one.");

    await user.setPassword(String(password));
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (err) {
    next(err);
  }
}

// ─── changePassword (logged-in user) ─────────────────────────────────────────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) throw httpError(400, "currentPassword and newPassword are required.");
    if (String(newPassword).length < 6) throw httpError(400, "New password must be at least 6 characters.");
    if (currentPassword === newPassword) throw httpError(400, "New password must be different from current password.");

    const user = await User.findById(req.user._id).select("+passwordHash");
    if (!user) throw httpError(404, "User not found.");

    const ok = await user.verifyPassword(String(currentPassword));
    if (!ok) throw httpError(401, "Current password is incorrect.");

    await user.setPassword(String(newPassword));
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
}

// ─── contactAdmin ─────────────────────────────────────────────────────────────
async function contactAdmin(req, res, next) {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      throw httpError(400, "name, email, subject and message are required.");
    }

    const adminEmail = env.ADMIN_EMAIL;
    if (!adminEmail) throw httpError(503, "Contact form is not configured. Please ask your administrator to set ADMIN_EMAIL.");

    await sendContactEmail({
      adminEmail,
      senderName: String(name).trim(),
      senderEmail: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    res.json({ message: "Your message has been sent to the administrator." });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, forgotPassword, resetPassword, changePassword, contactAdmin };
