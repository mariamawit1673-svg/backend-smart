const express = require("express");
const router = express.Router();
const Advisory = require("../models/Advisory");

// Seed sample data if empty
const seeds = [
  { crop: "Maize", type: "pest control", advice: "Apply neem-based pesticide to control fall armyworm. Scout fields weekly.", status: "completed" },
  { crop: "Tomato", type: "irrigation", advice: "Irrigate every 3 days during dry season. Avoid waterlogging to prevent root rot.", status: "pending" },
  { crop: "Beans", type: "fertilizer", advice: "Apply DAP fertilizer at planting. Top-dress with CAN at 4 weeks.", status: "completed" },
  { crop: "Rice", type: "pest control", advice: "Monitor for rice blast. Apply fungicide if diamond-shaped lesions appear.", status: "ignored" },
  { crop: "Wheat", type: "soil management", advice: "Test soil pH before planting. Lime if pH is below 5.5.", status: "pending" },
  { crop: "Potato", type: "harvesting", advice: "Harvest when 70% of foliage has died back. Cure tubers for 2 weeks before storage.", status: "completed" },
  { crop: "Maize", type: "fertilizer", advice: "Top-dress with urea at knee-height stage for improved grain yield.", status: "pending" },
  { crop: "Cabbage", type: "pest control", advice: "Use pheromone traps for diamondback moth. Apply Bt spray if larvae exceed threshold.", status: "completed" },
];

async function seedAdvisories() {
  try {
    const count = await Advisory.countDocuments();
    if (count === 0) { await Advisory.insertMany(seeds); console.log("Advisory records seeded."); }
  } catch (err) { console.log("Advisory seeding error:", err.message); }
}
const mongoose = require("mongoose");
if (mongoose.connection.readyState === 1) { seedAdvisories(); }
else { mongoose.connection.once("open", seedAdvisories); }

// GET /api/advisory?crop=&type=&status=&search=&from=&to=
router.get("/", async (req, res) => {
  try {
    const { crop, type, status, search, from, to } = req.query;
    const query = {};

    if (crop && crop !== "all") query.crop = { $regex: new RegExp(`^${crop}$`, "i") };
    if (type && type !== "all") query.type = type;
    if (status && status !== "all") query.status = status;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    if (search) {
      query.$or = [
        { advice: { $regex: search, $options: "i" } },
        { crop: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const records = await Advisory.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/advisory
router.post("/", async (req, res) => {
  try {
    const record = new Advisory(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/advisory/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const record = await Advisory.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
