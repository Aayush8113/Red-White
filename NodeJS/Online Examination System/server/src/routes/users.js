const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { listStudents, listBatches } = require("../controllers/userController");

const usersRouter = express.Router();

usersRouter.get("/students", requireAuth, requireRole("Admin", "Teacher"), listStudents);
usersRouter.get("/batches", requireAuth, requireRole("Admin", "Teacher"), listBatches);

module.exports = { usersRouter };
