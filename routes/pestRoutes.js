const express = require("express");
const router = express.Router();
const Pest = require("../models/Pest");
const PestReport = require("../models/PestReport");

function getGenAI() {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const key = process.env.GEMINI_API_KEY || "AIzaSyAXF32KOqBEmzirwRCEO_U2-z6_hngEHhk";
    if (key) return new GoogleGenerativeAI(key);
  } catch (e) {}
  return null;
}

const defaultPests = [
  { crop: "Maize", problem: "Fall Armyworm", symptoms: "Window-like leaf damage, holes on leaves, larvae inside the whorl.", advice: "Scout fields weekly and remove affected leaves early.", organicTreatment: "Apply neem oil spray (5ml/L) or Bt biopesticide.", chemicalTreatment: "Use emamectin benzoate or lambda-cyhalothrin at recommended rates.", prevention: "Plant early, use resistant varieties, intercrop with legumes.", riskLevel: "High", image: "" },
  { crop: "Tomato", problem: "Tomato Blight", symptoms: "Dark leaf spots, yellowing leaves, stem lesions, and fruit rot.", advice: "Avoid overhead watering and remove infected leaves promptly.", organicTreatment: "Spray copper-based fungicide or baking soda solution.", chemicalTreatment: "Apply mancozeb or chlorothalonil fungicide every 7-10 days.", prevention: "Rotate crops, use certified seeds, ensure good air circulation.", riskLevel: "High", image: "" },
  { crop: "Beans", problem: "Aphids", symptoms: "Curled leaves, sticky honeydew, weak growth, clusters of small insects.", advice: "Remove heavily infested shoots and encourage natural predators.", organicTreatment: "Spray insecticidal soap or neem oil solution.", chemicalTreatment: "Apply imidacloprid or dimethoate at label rates.", prevention: "Avoid excessive nitrogen, plant companion crops like marigold.", riskLevel: "Medium", image: "" },
  { crop: "Rice", problem: "Rice Blast", symptoms: "Diamond-shaped leaf lesions, neck rot, reduced grain filling.", advice: "Use resistant varieties and avoid excessive nitrogen fertilizer.", organicTreatment: "Apply silicon-based foliar spray.", chemicalTreatment: "Use tricyclazole or isoprothiolane fungicide.", prevention: "Use certified blast-resistant seed, maintain proper water management.", riskLevel: "High", image: "" },
  { crop: "Wheat", problem: "Rust Disease", symptoms: "Orange or brown powdery pustules on leaves and stems.", advice: "Apply fungicide at first sign and remove infected crop debris.", organicTreatment: "Spray sulfur-based fungicide or garlic extract solution.", chemicalTreatment: "Apply propiconazole or tebuconazole.", prevention: "Plant resistant varieties, avoid late planting.", riskLevel: "Medium", image: "" },
  { crop: "Potato", problem: "Late Blight", symptoms: "Water-soaked lesions on leaves, white mold on undersides, tuber rot.", advice: "Use certified seed and ensure good drainage.", organicTreatment: "Apply copper hydroxide or Bordeaux mixture spray.", chemicalTreatment: "Use metalaxyl + mancozeb or cymoxanil-based fungicide.", prevention: "Use certified disease-free seed, hill up plants.", riskLevel: "High", image: "" },
  { crop: "Cabbage", problem: "Diamondback Moth", symptoms: "Small holes in leaves, skeletonized foliage, small green caterpillars.", advice: "Use pheromone traps and rotate insecticide classes.", organicTreatment: "Apply Bt spray or spinosad-based biopesticide.", chemicalTreatment: "Use chlorfenapyr or indoxacarb at recommended rates.", prevention: "Use fine mesh nets, intercrop with aromatic herbs.", riskLevel: "Medium", image: "" },
  { crop: "Mango", problem: "Mango Hopper", symptoms: "Yellowing and drying of inflorescences, honeydew deposits, sooty mold.", advice: "Spray neem-based insecticide at bud burst stage.", organicTreatment: "Apply neem oil (3%) or fish oil rosin soap spray.", chemicalTreatment: "Use imidacloprid or carbaryl at flowering stage.", prevention: "Prune dense canopy, remove weeds.", riskLevel: "Low", image: "" },
];

async function seedPests() {
  try {
    const count = await Pest.countDocuments();
    if (count === 0) { await Pest.insertMany(defaultPests); console.log("Pest knowledge base seeded."); }
  } catch (err) { console.log("Seeding error:", err.message); }
}
const mongoose = require("mongoose");
if (mongoose.connection.readyState === 1) { seedPests(); }
else { mongoose.connection.once("open", seedPests); }

router.post("/diagnose", async (req, res) => {
  try {
    const { crop, symptoms } = req.body;
    if (!crop || !symptoms) return res.status(400).json({ error: "crop and symptoms are required" });

    const cropRegex = new RegExp("^" + crop + "$", "i");
    const candidates = await Pest.find({ crop: { $regex: cropRegex } });
    const words = symptoms.toLowerCase().split(/\s+/);
    const score = (p) => words.filter((w) => w.length > 3 && p.symptoms.toLowerCase().includes(w)).length;
    let best = null, bestScore = -1;
    const pool = candidates.length ? candidates : await Pest.find({});
    for (const p of pool) { const s = score(p); if (s > bestScore) { bestScore = s; best = p; } }

    if (best && bestScore > 0) {
      return res.json({ crop: best.crop, problem: best.problem, symptoms: best.symptoms, advice: best.advice, organicTreatment: best.organicTreatment || "", chemicalTreatment: best.chemicalTreatment || "", prevention: best.prevention || "", riskLevel: best.riskLevel, source: "database" });
    }

    const genAI = getGenAI();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Expert agricultural advisor. Crop: " + crop + ". Symptoms: " + symptoms + ". Respond ONLY with JSON: {\"problem\":\"name\",\"symptoms\":\"desc\",\"advice\":\"advice\",\"organicTreatment\":\"organic\",\"chemicalTreatment\":\"chemical\",\"prevention\":\"prevention\",\"riskLevel\":\"High or Medium or Low\"}";
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const m = text.match(/\{[\s\S]*\}/);
        if (m) {
          const d = JSON.parse(m[0]);
          return res.json({ crop, problem: d.problem || "Unknown", symptoms: d.symptoms || symptoms, advice: d.advice || "", organicTreatment: Array.isArray(d.organicTreatment) ? d.organicTreatment.join(" ") : (d.organicTreatment || ""), chemicalTreatment: Array.isArray(d.chemicalTreatment) ? d.chemicalTreatment.join(" ") : (d.chemicalTreatment || ""), prevention: Array.isArray(d.prevention) ? d.prevention.join(" ") : (d.prevention || ""), riskLevel: ["High","Medium","Low"].includes(d.riskLevel) ? d.riskLevel : "Medium", source: "ai" });
        }
      } catch (aiErr) { console.log("Gemini error:", aiErr.message); }
    }

    if (best) return res.json({ crop: best.crop, problem: best.problem, symptoms: best.symptoms, advice: best.advice, organicTreatment: best.organicTreatment || "", chemicalTreatment: best.chemicalTreatment || "", prevention: best.prevention || "", riskLevel: best.riskLevel, source: "database" });
    res.json(null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/reports", async (req, res) => {
  try {
    const { userId } = req.query;
    res.json(await PestReport.find(userId ? { userId } : {}).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/reports", async (req, res) => {
  try { const r = new PestReport(req.body); await r.save(); res.status(201).json(r); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch("/reports/:id/status", async (req, res) => {
  try {
    const r = await PestReport.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!r) return res.status(404).json({ error: "Not found" });
    res.json(r);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get("/", async (req, res) => {
  try {
    const { search, crop } = req.query;
    const q = {};
    if (crop && crop !== "all") q.crop = { $regex: new RegExp("^" + crop + "$", "i") };
    if (search) q.$or = [{ problem: { $regex: search, $options: "i" } }, { crop: { $regex: search, $options: "i" } }];
    res.json(await Pest.find(q));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try { const p = new Pest(req.body); await p.save(); res.status(201).json(p); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.get("/risk/:crop", async (req, res) => {
  try {
    const { crop } = req.params;
    const t = Math.round(22 + Math.random() * 16);
    const h = Math.round(45 + Math.random() * 50);
    res.json({ crop, temperature: t, humidity: h, riskLevel: t >= 30 && h >= 70 ? "High" : t >= 25 || h >= 60 ? "Medium" : "Low" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
