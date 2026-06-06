const { User } = require("../models/User");
const { signAccessToken } = require("../lib/jwt");
const { httpError } = require("../utils/httpError");

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

module.exports = { register, login };

