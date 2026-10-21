const mongoose = require("mongoose");

const farmProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: String,
        default: ""
    },
    farmSize: {
        type: String,
        default: ""
    },
    soilType: {
        type: String,
        default: ""
    },
    preferredCrops: {
        type: String,
        default: ""
    },
    irrigationAvailable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("FarmProfile", farmProfileSchema);
