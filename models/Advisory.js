const mongoose = require("mongoose");

const advisorySchema = new mongoose.Schema({
  crop: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["fertilizer", "irrigation", "pest control", "harvesting", "soil management", "general"],
    default: "general",
  },
  advice: { type: String, required: true },
  status: { type: String, enum: ["completed", "pending", "ignored"], default: "pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Advisory", advisorySchema);
