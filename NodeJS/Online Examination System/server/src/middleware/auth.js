const { verifyAccessToken } = require("../lib/jwt");
const { User } = require("../models/User");

async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return next(Object.assign(new Error("Missing Authorization Bearer token."), { status: 401 }));

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user) return next(Object.assign(new Error("User not found."), { status: 401 }));

    req.user = user;
    return next();
  } catch (err) {
    return next(Object.assign(new Error("Invalid or expired token."), { status: 401 }));
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return next(Object.assign(new Error("Forbidden."), { status: 403 }));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

