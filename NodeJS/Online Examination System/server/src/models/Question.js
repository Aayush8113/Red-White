const mongoose = require("mongoose");

const QUESTION_TYPES = ["mcq", "boolean", "short"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    type: { type: String, enum: QUESTION_TYPES, required: true, index: true },

    // mcq
    options: { type: [optionSchema], default: undefined },

    // boolean
    correctBoolean: { type: Boolean, default: undefined },

    // short answer (normalized matching is done at grading time)
    acceptedAnswers: { type: [String], default: undefined },

    difficulty: { type: String, enum: DIFFICULTY_LEVELS, default: "medium", index: true },
    tags: { type: [String], default: [], index: true },
    weightage: { type: Number, default: 1, min: 0 },
    explanation: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

questionSchema.pre("validate", function validateByType(next) {
  if (this.type === "mcq") {
    if (!Array.isArray(this.options) || this.options.length < 2) {
      return next(Object.assign(new Error("MCQ questions require at least 2 options."), { status: 400 }));
    }
    const correctCount = this.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return next(
        Object.assign(new Error("MCQ questions must have exactly 1 correct option."), { status: 400 }),
      );
    }
    this.correctBoolean = undefined;
    this.acceptedAnswers = undefined;
  }

  if (this.type === "boolean") {
    if (typeof this.correctBoolean !== "boolean") {
      return next(Object.assign(new Error("Boolean questions require correctBoolean."), { status: 400 }));
    }
    this.options = undefined;
    this.acceptedAnswers = undefined;
  }

  if (this.type === "short") {
    if (!Array.isArray(this.acceptedAnswers) || this.acceptedAnswers.length === 0) {
      return next(Object.assign(new Error("Short questions require acceptedAnswers."), { status: 400 }));
    }
    this.options = undefined;
    this.correctBoolean = undefined;
  }

  return next();
});

const Question = mongoose.model("Question", questionSchema);

module.exports = { Question, QUESTION_TYPES, DIFFICULTY_LEVELS };

