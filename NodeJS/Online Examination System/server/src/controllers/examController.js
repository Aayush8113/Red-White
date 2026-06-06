const { Exam } = require("../models/Exam");
const { ExamAttempt } = require("../models/ExamAttempt");
const { Question } = require("../models/Question");
const { httpError } = require("../utils/httpError");

function normalizeShort(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

async function listExams(req, res, next) {
  try {
    const { role, _id, batch } = req.user;
    let filter = {};

    if (role === "Student") {
      filter = {
        isPublished: true,
        $or: [
          { targetStudents: _id },
          { targetBatches: batch },
          { targetStudents: { $size: 0 }, targetBatches: { $size: 0 } },
        ],
      };
    } else if (role === "Teacher") {
      filter = { createdBy: _id };
    } else if (role === "Admin") {
      filter = {};
    }

    const items = await Exam.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function createExam(req, res, next) {
  try {
    const payload = req.body || {};
    const exam = await Exam.create({ ...payload, createdBy: req.user._id });
    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
}

async function publishExam(req, res, next) {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) throw httpError(404, "Exam not found.");
    exam.isPublished = true;
    await exam.save();
    res.json({ ok: true, exam });
  } catch (err) {
    next(err);
  }
}

async function startAttempt(req, res, next) {
  try {
    const exam = await Exam.findById(req.params.id).lean();
    if (!exam) throw httpError(404, "Exam not found.");
    if (!exam.isPublished) throw httpError(403, "Exam is not published.");

    const now = new Date();
    if (exam.startAt && now < new Date(exam.startAt)) throw httpError(403, "Exam not started yet.");
    if (exam.endAt && now > new Date(exam.endAt)) throw httpError(403, "Exam has ended.");

    const attemptsUsed = await ExamAttempt.countDocuments({ exam: exam._id, student: req.user._id });
    if (attemptsUsed >= exam.allowedAttempts) throw httpError(403, "No attempts remaining.");

    const startedAt = now;
    const endsAt = new Date(now.getTime() + Number(exam.durationSeconds) * 1000);
    const attemptNumber = attemptsUsed + 1;

    const attempt = await ExamAttempt.create({
      exam: exam._id,
      student: req.user._id,
      attemptNumber,
      startedAt,
      endsAt,
      maxScore: exam.questions.reduce((sum, q) => sum + (q.weightage ?? 1), 0),
      answers: exam.questions.map((q) => ({
        question: q.question,
        weightage: q.weightage ?? 1,
        score: 0,
        category: q.category || "",
      })),
    });

    res.status(201).json({ attemptId: attempt._id, endsAt: attempt.endsAt });
  } catch (err) {
    next(err);
  }
}

async function getAttempt(req, res, next) {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId).lean();
    if (!attempt) throw httpError(404, "Attempt not found.");
    if (String(attempt.student) !== String(req.user._id)) throw httpError(403, "Forbidden.");
    const exam = await Exam.findById(attempt.exam).lean();
    res.json({ attempt, exam });
  } catch (err) {
    next(err);
  }
}

async function reportIntegrity(req, res, next) {
  try {
    const { event } = req.body || {};
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) throw httpError(404, "Attempt not found.");
    if (String(attempt.student) !== String(req.user._id)) throw httpError(403, "Forbidden.");
    if (attempt.status !== "in_progress") return res.json({ ok: true, status: attempt.status });

    if (event === "visibilityChange") attempt.integrity.tabSwitches += 1;
    if (event === "blur") attempt.integrity.blurs += 1;

    const shouldAutoSubmit = attempt.integrity.tabSwitches > 3;
    if (shouldAutoSubmit) attempt.status = "submitted";

    await attempt.save();
    res.json({ ok: true, shouldAutoSubmit, integrity: attempt.integrity, status: attempt.status });
  } catch (err) {
    next(err);
  }
}

async function saveAnswer(req, res, next) {
  try {
    const { questionId, response } = req.body || {};
    if (!questionId) throw httpError(400, "questionId is required.");

    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) throw httpError(404, "Attempt not found.");
    if (String(attempt.student) !== String(req.user._id)) throw httpError(403, "Forbidden.");
    if (attempt.status !== "in_progress") throw httpError(409, "Attempt is not in progress.");

    const idx = attempt.answers.findIndex((a) => String(a.question) === String(questionId));
    if (idx === -1) throw httpError(400, "Question not part of this exam.");

    attempt.answers[idx].response = response;
    await attempt.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function submitAttempt(req, res, next) {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) throw httpError(404, "Attempt not found.");
    if (String(attempt.student) !== String(req.user._id)) throw httpError(403, "Forbidden.");

    if (attempt.status !== "in_progress") {
      return res.json({ ok: true, status: attempt.status, totalScore: attempt.totalScore, maxScore: attempt.maxScore });
    }

    const now = new Date();
    if (now > attempt.endsAt) attempt.status = "expired";

    const questions = await Question.find({ _id: { $in: attempt.answers.map((a) => a.question) } }).lean();
    const byId = new Map(questions.map((q) => [String(q._id), q]));

    let total = 0;
    const updatedAnswers = attempt.answers.map((a) => {
      const q = byId.get(String(a.question));
      if (!q) return { ...a.toObject(), isCorrect: false, score: 0 };

      let isCorrect = false;

      if (q.type === "mcq") {
        const selectedIndex = Number(a.response);
        const correctIndex = q.options.findIndex((o) => o.isCorrect);
        isCorrect = Number.isInteger(selectedIndex) && selectedIndex === correctIndex;
      } else if (q.type === "boolean") {
        isCorrect = typeof a.response === "boolean" && a.response === q.correctBoolean;
      } else if (q.type === "short") {
        const resp = normalizeShort(a.response);
        const accepted = (q.acceptedAnswers || []).map(normalizeShort);
        isCorrect = resp.length > 0 && accepted.includes(resp);
      }

      const score = isCorrect ? Number(a.weightage ?? 1) : 0;
      total += score;
      return { ...a.toObject(), isCorrect, score };
    });

    attempt.answers = updatedAnswers;
    attempt.totalScore = total;
    attempt.submittedAt = new Date();
    if (attempt.status === "in_progress") attempt.status = "submitted";

    await attempt.save();
    res.json({ ok: true, status: attempt.status, totalScore: attempt.totalScore, maxScore: attempt.maxScore });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listExams,
  createExam,
  publishExam,
  startAttempt,
  getAttempt,
  reportIntegrity,
  saveAnswer,
  submitAttempt,
};
