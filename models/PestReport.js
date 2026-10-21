const mongoose = require("mongoose");

const pestReportSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  symptoms: { type: String, required: true },
  pestName: { type: String, default: "" },
  treatment: { type: String, default: "" },
  status: { type: String, enum: ["open", "treated", "resolved"], default: "open" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("PestReport", pestReportSchema, "pest_advisories");
