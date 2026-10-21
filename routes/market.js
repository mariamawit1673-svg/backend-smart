const express = require("express");
const router = express.Router();
const MarketProduct = require("../models/MarketProduct");
const Order = require("../models/Order");

// Live market reference prices (ETB per kg - Ethiopian market estimates)
const MARKET_PRICES = {
  Maize:     { low: 18, avg: 25, high: 35 },
  Wheat:     { low: 30, avg: 42, high: 55 },
  Teff:      { low: 55, avg: 75, high: 95 },
  Rice:      { low: 40, avg: 55, high: 70 },
  Sorghum:   { low: 15, avg: 22, high: 30 },
  Barley:    { low: 20, avg: 28, high: 38 },
  Tomato:    { low: 8,  avg: 15, high: 25 },
  Onion:     { low: 10, avg: 18, high: 28 },
  Potato:    { low: 12, avg: 20, high: 30 },
  Cabbage:   { low: 5,  avg: 10, high: 18 },
  Beans:     { low: 25, avg: 38, high: 50 },
  Lentils:   { low: 35, avg: 50, high: 65 },
  Chickpea:  { low: 30, avg: 45, high: 60 },
  Coffee:    { low: 120, avg: 180, high: 250 },
  Sesame:    { low: 80, avg: 120, high: 160 },
  Sunflower: { low: 35, avg: 50, high: 70 },
  Banana:    { low: 6,  avg: 12, high: 20 },
  Mango:     { low: 8,  avg: 15, high: 25 },
  Sugarcane: { low: 3,  avg: 6,  high: 10 },
  Cotton:    { low: 25, avg: 40, high: 55 },
};

// Price suggestion based on season + weather
function suggestPrice(name, season, temperature) {
  const key = Object.keys(MARKET_PRICES).find(k => k.toLowerCase() === name.toLowerCase());
  if (!key) return null;
  const base = MARKET_PRICES[key];
  let multiplier = 1.0;
  if (season === "dry") multiplier += 0.15;
  if (temperature === "hot") multiplier += 0.10;
  return {
    suggested: Math.round(base.avg * multiplier),
    low: base.low, avg: base.avg, high: base.high,
    note: season === "dry" ? "Dry season — prices tend to be higher" : "Rainy season — good supply expected",
  };
}

// GET all products
router.get("/", async (req, res) => {
  try {
    const { search, category, userId } = req.query;
    const q = {};
    if (category && category !== "all") q.category = category;
    if (userId) q.userId = userId;
    if (search) q.$or = [
      { name: { $regex: search, $options: "i" } },
      { farmerName: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
    res.json(await MarketProduct.find(q).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET live market prices
router.get("/prices", (req, res) => {
  res.json(MARKET_PRICES);
});

// GET price suggestion
router.get("/suggest-price", (req, res) => {
  const { name, season = "rainy", temperature = "warm" } = req.query;
  if (!name) return res.status(400).json({ error: "name required" });
  const result = suggestPrice(name, season, temperature);
  if (!result) return res.json({ suggested: null, note: "No price data for this crop" });
  res.json(result);
});

// POST add product
router.post("/", async (req, res) => {
  try {
    const product = new MarketProduct(req.body);
    await product.save();
    res.status(201).json({ success: true, message: "Product listed successfully", product });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST add review/rating
router.post("/:id/review", async (req, res) => {
  try {
    const { buyerName, rating, comment } = req.body;
    const product = await MarketProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    product.reviews.push({ buyerName, rating, comment });
    const total = product.reviews.reduce((s, r) => s + r.rating, 0);
    product.avgRating = Math.round((total / product.reviews.length) * 10) / 10;
    await product.save();
    res.json({ success: true, avgRating: product.avgRating });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await MarketProduct.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product removed" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST place order
router.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    await MarketProduct.findByIdAndUpdate(req.body.productId, { $inc: { totalOrders: 1 } });
    res.status(201).json({ success: true, order });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// GET orders for a user
router.get("/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    const q = userId ? { userId } : {};
    res.json(await Order.find(q).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update order status
router.patch("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
