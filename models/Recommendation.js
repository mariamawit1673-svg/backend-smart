const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    soilType: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    rainfall: {
        type: String,
        default: ""
    },
    temperature: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    irrigationAvailable: {
        type: Boolean,
        default: false
    },
    recommendedCrops: {
        type: [String],
        default: []
    },
    advice: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Recommendation", recommendationSchema);
