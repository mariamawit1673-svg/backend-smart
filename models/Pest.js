const mongoose = require("mongoose");

const pestSchema = new mongoose.Schema({
  crop: { type: String, required: true, trim: true },
  problem: { type: String, required: true, trim: true },
  symptoms: { type: String, required: true },
  advice: { type: String, required: true },
  organicTreatment: { type: String, default: "" },
  chemicalTreatment: { type: String, default: "" },
  prevention: { type: String, default: "" },
  riskLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
  image: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Pest", pestSchema);
