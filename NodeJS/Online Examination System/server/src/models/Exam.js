const mongoose = require("mongoose");

const examQuestionSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    weightage: { type: Number, default: 1, min: 0 },
    category: { type: String, default: "" }, // used later for analytics (Logic/Math/Speed/etc.)
  },
  { _id: false },
);

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    questions: { type: [examQuestionSchema], default: [] },

    // Exam availability window (optional) + attempt constraints
    startAt: { type: Date, default: null, index: true },
    endAt: { type: Date, default: null, index: true },
    durationSeconds: { type: Number, required: true, min: 60 },
    allowedAttempts: { type: Number, default: 1, min: 1 },

    isPublished: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Targeting
    targetBatches: { type: [String], default: [] }, // e.g. ["Batch-A", "Batch-B"]
    targetStudents: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  },

  { timestamps: true },
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = { Exam };

