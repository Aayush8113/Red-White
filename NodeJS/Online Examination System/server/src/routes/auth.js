const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  contactAdmin,
} = require("../controllers/authController");

const authRouter = express.Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/contact", contactAdmin);           // contact admin form

// Protected routes (must be logged in)
authRouter.post("/change-password", requireAuth, changePassword);

module.exports = { authRouter };
