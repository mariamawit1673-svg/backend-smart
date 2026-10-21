const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    soilTypes: {
        type: [String],
        required: true
    },
    seasons: {
        type: [String],
        required: true
    },
    rainfall: {
        type: String,
        default: "medium"
    },
    temperature: {
        type: String,
        default: "warm"
    },
    waterRequirement: {
        type: String,
        default: "medium"
    },
    fertilizerAdvice: {
        type: String,
        default: ""
    },
    pestAdvice: {
        type: String,
        default: ""
    },
    harvestPeriod: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Crop", cropSchema);
