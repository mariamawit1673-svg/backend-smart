const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: undefined },
    phone: { type: String, default: undefined },
    password: { type: String, required: true },
    role: { type: String, default: "farmer" }
}, { timestamps: true });

// sparse: true means null values are NOT indexed — allows multiple null emails
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
