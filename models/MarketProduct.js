const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  buyerName: { type: String, default: "Anonymous" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const MarketProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, default: "kg" },
  category: { type: String, default: "Grain" },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  farmerName: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, default: "" },
  userId: { type: String, default: null },
  reviews: [reviewSchema],
  avgRating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("MarketProduct", MarketProductSchema);
