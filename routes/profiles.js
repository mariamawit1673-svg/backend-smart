const express = require("express");
const FarmProfile = require("../models/FarmProfile");

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const profile = await FarmProfile.findOne({ userId: req.params.userId });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const profile = await FarmProfile.findOneAndUpdate(
            { userId },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );

        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
