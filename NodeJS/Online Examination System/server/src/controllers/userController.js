const { User } = require("../models/User");
const { httpError } = require("../utils/httpError");

async function listStudents(req, res, next) {
  try {
    const students = await User.find({ role: "Student" }).select("name email batch").lean();
    res.json({ items: students });
  } catch (err) {
    next(err);
  }
}

async function listBatches(req, res, next) {
  try {
    const batches = await User.distinct("batch", { role: "Student", batch: { $ne: "" } });
    res.json({ items: batches });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStudents, listBatches };
