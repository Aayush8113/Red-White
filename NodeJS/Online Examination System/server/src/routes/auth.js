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

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/contact", contactAdmin);           

authRouter.post("/change-password", requireAuth, changePassword);

module.exports = { authRouter };
