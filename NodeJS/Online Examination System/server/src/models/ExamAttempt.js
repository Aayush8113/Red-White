const mongoose = require("mongoose");

const attemptAnswerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    response: { type: mongoose.Schema.Types.Mixed, default: null },
    isCorrect: { type: Boolean, default: null },
    weightage: { type: Number, default: 1, min: 0 },
    score: { type: Number, default: 0, min: 0 },
    category: { type: String, default: "" },
  },
  { _id: false },
);

const examAttemptSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    attemptNumber: { type: Number, required: true, min: 1 },

    startedAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    submittedAt: { type: Date, default: null, index: true },

    status: { type: String, enum: ["in_progress", "submitted", "expired"], default: "in_progress", index: true },

    integrity: {
      tabSwitches: { type: Number, default: 0, min: 0 },
      blurs: { type: Number, default: 0, min: 0 },
    },

    answers: { type: [attemptAnswerSchema], default: [] },
    totalScore: { type: Number, default: 0, min: 0 },
    maxScore: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

examAttemptSchema.index({ exam: 1, student: 1, attemptNumber: 1 }, { unique: true });

const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);

module.exports = { ExamAttempt };

