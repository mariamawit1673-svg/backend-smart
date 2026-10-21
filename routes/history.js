const express = require("express");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const history = await Recommendation.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
