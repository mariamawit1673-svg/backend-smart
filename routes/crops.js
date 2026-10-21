const express = require("express");
const Crop = require("../models/Crop");
const defaultCrops = require("../data/defaultCrops");

const router = express.Router();

async function ensureDefaultCrops() {
    const count = await Crop.countDocuments();

    if (count === 0) {
        await Crop.insertMany(defaultCrops);
    }
}

router.get("/", async (req, res) => {
    try {
        await ensureDefaultCrops();
        const crops = await Crop.find().sort({ name: 1 });
        res.json(crops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const crop = new Crop(req.body);
        await crop.save();
        res.status(201).json(crop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }

        res.json(crop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const crop = await Crop.findByIdAndDelete(req.params.id);

        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }

        res.json({ message: "Crop deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
