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

// Student starts an attempt; server decides endsAt.
examsRouter.post("/:id/start", requireAuth, requireRole("Student"), startAttempt);
examsRouter.get("/attempts/:attemptId", requireAuth, requireRole("Student"), getAttempt);

// Client reports integrity events; server increments counters and can auto-submit.
examsRouter.post("/attempts/:attemptId/integrity", requireAuth, requireRole("Student"), reportIntegrity);

// Save answer (one at a time)
examsRouter.post("/attempts/:attemptId/answer", requireAuth, requireRole("Student"), saveAnswer);
examsRouter.post("/attempts/:attemptId/submit", requireAuth, requireRole("Student"), submitAttempt);

module.exports = { examsRouter };

