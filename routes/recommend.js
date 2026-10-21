const express = require("express");
const Crop = require("../models/Crop");
const Recommendation = require("../models/Recommendation");
const defaultCrops = require("../data/defaultCrops");

const router = express.Router();

async function ensureDefaultCrops() {
    const count = await Crop.countDocuments();

    if (count === 0) {
        await Crop.insertMany(defaultCrops);
    }
}

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

router.post("/", async (req, res) => {
    try {
        const {
            userId,
            soilType,
            season,
            rainfall = "",
            temperature = "",
            location = "",
            irrigationAvailable = false
        } = req.body;

        if (!soilType || !season) {
            return res.status(400).json({
                message: "soilType and season are required"
            });
        }

        await ensureDefaultCrops();

        const normalizedSoil = normalize(soilType);
        const normalizedSeason = normalize(season);
        const normalizedRainfall = normalize(rainfall);
        const normalizedTemperature = normalize(temperature);

        const crops = await Crop.find({
            soilTypes: normalizedSoil,
            seasons: normalizedSeason
        }).sort({ name: 1 });

        const scoredCrops = crops.map((crop) => {
            let score = 2;

            if (normalizedRainfall && normalize(crop.rainfall) === normalizedRainfall) {
                score += 1;
            }

            if (normalizedTemperature && normalize(crop.temperature) === normalizedTemperature) {
                score += 1;
            }

            if (irrigationAvailable && normalize(crop.waterRequirement) === "high") {
                score += 1;
            }

            return { crop, score };
        }).sort((a, b) => b.score - a.score || a.crop.name.localeCompare(b.crop.name));

        const recommendedCrops = scoredCrops.map((item) => item.crop.name);
        const advice = scoredCrops.slice(0, 3).map((item) => {
            const crop = item.crop;
            return `${crop.name}: ${crop.description || "Suitable crop for the selected conditions"} ${crop.fertilizerAdvice ? `Fertilizer: ${crop.fertilizerAdvice}` : ""}`;
        });

        const savedRecommendation = await Recommendation.create({
            userId: userId || undefined,
            soilType: normalizedSoil,
            season: normalizedSeason,
            rainfall: normalizedRainfall,
            temperature: normalizedTemperature,
            location,
            irrigationAvailable,
            recommendedCrops: recommendedCrops.length ? recommendedCrops : ["No exact match"],
            advice: advice.length ? advice : ["Try another soil type, season, or add more crop records."]
        });

        res.json({
            recommendedCrops: savedRecommendation.recommendedCrops,
            advice: savedRecommendation.advice,
            message: recommendedCrops.length ? "Recommended crops found." : "Try another soil type or season.",
            recommendation: savedRecommendation
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
