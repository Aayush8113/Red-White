const { Question } = require("../models/Question");
const { httpError } = require("../utils/httpError");

async function createQuestion(req, res, next) {
  try {
    const payload = req.body || {};
    const q = await Question.create({ ...payload, createdBy: req.user.id || req.user._id });
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
}

async function listQuestions(req, res, next) {
  try {
    const { type, difficulty, tag, active } = req.query || {};
    const filter = {};
    if (type) filter.type = String(type);
    if (difficulty) filter.difficulty = String(difficulty);
    if (tag) filter.tags = String(tag);
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const items = await Question.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

async function getQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id).lean();
    if (!q) throw httpError(404, "Question not found.");
    res.json(q);
  } catch (err) {
    next(err);
  }
}

async function updateQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) throw httpError(404, "Question not found.");
    Object.assign(q, req.body || {});
    await q.save();
    res.json(q);
  } catch (err) {
    next(err);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) throw httpError(404, "Question not found.");
    q.isActive = false;
    await q.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createQuestion, listQuestions, getQuestion, updateQuestion, deleteQuestion };

