const express = require("express");

const { requireAuth, requireRole } = require("../middleware/auth");
const {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

const questionsRouter = express.Router();

questionsRouter.use(requireAuth, requireRole("Admin"));

questionsRouter.post("/", createQuestion);
questionsRouter.get("/", listQuestions);
questionsRouter.get("/:id", getQuestion);
questionsRouter.patch("/:id", updateQuestion);
questionsRouter.delete("/:id", deleteQuestion);

module.exports = { questionsRouter };
