const express = require("express");

const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listExams,
  createExam,
  publishExam,
  startAttempt,
  getAttempt,
  reportIntegrity,
  saveAnswer,
  submitAttempt,
} = require("../controllers/examController");

const examsRouter = express.Router();

examsRouter.get("/", requireAuth, listExams);
examsRouter.post("/", requireAuth, requireRole("Admin", "Teacher"), createExam);
examsRouter.post("/:id/publish", requireAuth, requireRole("Admin", "Teacher"), publishExam);
examsRouter.post("/:id/start", requireAuth, requireRole("Student"), startAttempt);
examsRouter.get("/attempts/:attemptId", requireAuth, requireRole("Student"), getAttempt);
examsRouter.post("/attempts/:attemptId/integrity", requireAuth, requireRole("Student"), reportIntegrity);
examsRouter.post("/attempts/:attemptId/answer", requireAuth, requireRole("Student"), saveAnswer);
examsRouter.post("/attempts/:attemptId/submit", requireAuth, requireRole("Student"), submitAttempt);

module.exports = { examsRouter };
