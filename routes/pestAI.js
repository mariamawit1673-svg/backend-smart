const express = require("express");
const router = express.Router();

// Large built-in pest database covering many crops
const PEST_DB = {
  maize:      [
    { problem: "Fall Armyworm", symptoms: "Window-like leaf damage, holes on leaves, larvae inside the whorl, frass visible.", advice: "Scout fields weekly. Remove and destroy affected plants early.", organicTreatment: "Apply neem oil spray (5ml/L) or Bt (Bacillus thuringiensis) biopesticide.", chemicalTreatment: "Use emamectin benzoate or lambda-cyhalothrin at recommended rates.", prevention: "Plant early, use resistant varieties, intercrop with legumes.", riskLevel: "High" },
    { problem: "Maize Streak Virus", symptoms: "Yellow streaks along leaf veins, stunted growth, poor cob formation.", advice: "Remove infected plants immediately to prevent spread.", organicTreatment: "No direct organic cure; control leafhopper vectors with neem spray.", chemicalTreatment: "Apply imidacloprid to control leafhopper vectors.", prevention: "Use resistant varieties, plant early, control weeds.", riskLevel: "High" },
    { problem: "Stalk Borer", symptoms: "Dead heart in young plants, holes in stems, frass at entry points.", advice: "Apply sand mixed with soil into the whorl at early infestation.", organicTreatment: "Apply Bt granules into the whorl.", chemicalTreatment: "Use carbofuran granules or chlorpyrifos spray.", prevention: "Early planting, destroy crop residues after harvest.", riskLevel: "Medium" },
    { problem: "Aphids", symptoms: "Clusters of small insects on leaves, sticky honeydew, sooty mold, yellowing.", advice: "Encourage natural predators like ladybirds.", organicTreatment: "Spray insecticidal soap or neem oil solution.", chemicalTreatment: "Apply dimethoate or pirimicarb at label rates.", prevention: "Avoid excessive nitrogen fertilizer, use reflective mulches.", riskLevel: "Low" },
  ],
  tomato:     [
    { problem: "Tomato Blight (Late Blight)", symptoms: "Dark water-soaked leaf spots, white mold on undersides, stem lesions, fruit rot.", advice: "Avoid overhead watering, remove infected leaves promptly.", organicTreatment: "Spray copper-based fungicide or baking soda solution (1 tbsp/L).", chemicalTreatment: "Apply mancozeb or chlorothalonil fungicide every 7-10 days.", prevention: "Rotate crops, use certified seeds, ensure good air circulation.", riskLevel: "High" },
    { problem: "Tomato Leaf Miner", symptoms: "Winding white tunnels on leaves, premature leaf drop, reduced yield.", advice: "Remove and destroy heavily mined leaves.", organicTreatment: "Apply neem oil or spinosad-based spray.", chemicalTreatment: "Use abamectin or cyromazine at label rates.", prevention: "Use yellow sticky traps, remove crop debris.", riskLevel: "Medium" },
    { problem: "Whitefly", symptoms: "Tiny white insects under leaves, yellowing, sticky honeydew, sooty mold.", advice: "Use yellow sticky traps and introduce natural enemies.", organicTreatment: "Spray insecticidal soap or neem oil.", chemicalTreatment: "Apply imidacloprid or thiamethoxam.", prevention: "Use reflective mulch, avoid planting near infested crops.", riskLevel: "Medium" },
    { problem: "Fusarium Wilt", symptoms: "Yellowing of lower leaves, wilting despite adequate water, brown vascular tissue.", advice: "Remove and destroy infected plants, do not compost.", organicTreatment: "Apply Trichoderma-based biocontrol to soil.", chemicalTreatment: "Drench soil with carbendazim or thiophanate-methyl.", prevention: "Use resistant varieties, practice crop rotation.", riskLevel: "High" },
  ],
  onion:      [
    { problem: "Onion Thrips", symptoms: "Silver-white streaks on leaves, distorted growth, stunted bulbs, tiny insects visible.", advice: "Monitor with blue sticky traps, remove heavily infested leaves.", organicTreatment: "Spray neem oil (3%) or spinosad solution.", chemicalTreatment: "Apply imidacloprid or lambda-cyhalothrin.", prevention: "Avoid dense planting, remove crop debris, use reflective mulch.", riskLevel: "High" },
    { problem: "Purple Blotch", symptoms: "Small white lesions with purple centers on leaves, yellowing, premature death.", advice: "Avoid overhead irrigation, improve air circulation.", organicTreatment: "Spray copper oxychloride or garlic extract.", chemicalTreatment: "Apply iprodione or mancozeb fungicide.", prevention: "Use certified seed, rotate crops, avoid wounding plants.", riskLevel: "Medium" },
    { problem: "Downy Mildew", symptoms: "Pale green to yellow patches on leaves, violet-gray mold on undersides, leaf collapse.", advice: "Apply fungicide at first sign, avoid wet foliage.", organicTreatment: "Spray Bordeaux mixture or copper-based fungicide.", chemicalTreatment: "Use metalaxyl + mancozeb or cymoxanil.", prevention: "Plant in well-drained soil, avoid overhead watering.", riskLevel: "High" },
    { problem: "Onion Fly (Maggot)", symptoms: "Wilting seedlings, yellowing, soft rotting bulbs, small white maggots in bulb.", advice: "Destroy infested plants, avoid planting in previously infested soil.", organicTreatment: "Apply diatomaceous earth around base of plants.", chemicalTreatment: "Use chlorpyrifos soil drench at planting.", prevention: "Rotate crops, use row covers, remove crop debris.", riskLevel: "Medium" },
  ],
  banana:     [
    { problem: "Panama Disease (Fusarium Wilt)", symptoms: "Yellowing of older leaves, wilting, brown streaks in pseudostem, plant collapse.", advice: "Remove and destroy infected plants, disinfect tools.", organicTreatment: "Apply Trichoderma harzianum to soil.", chemicalTreatment: "No effective chemical cure; focus on prevention.", prevention: "Use resistant varieties (Cavendish), avoid infected planting material.", riskLevel: "High" },
    { problem: "Black Sigatoka", symptoms: "Dark streaks on leaves expanding to large black lesions, premature leaf death.", advice: "Remove infected leaves, improve air circulation.", organicTreatment: "Spray neem oil or copper-based fungicide.", chemicalTreatment: "Apply propiconazole or trifloxystrobin fungicide.", prevention: "Use resistant varieties, maintain proper spacing.", riskLevel: "High" },
    { problem: "Banana Weevil", symptoms: "Wilting, yellowing, tunnels in corm, plant toppling over.", advice: "Use pheromone traps, remove and destroy infested corms.", organicTreatment: "Apply Beauveria bassiana bioinsecticide to soil.", chemicalTreatment: "Use chlorpyrifos or carbofuran around corm.", prevention: "Use clean planting material, remove crop debris.", riskLevel: "Medium" },
    { problem: "Bunchy Top Virus", symptoms: "Stunted growth, narrow upright leaves, dark green streaks on leaf veins.", advice: "Remove and destroy infected plants immediately.", organicTreatment: "Control aphid vectors with neem oil spray.", chemicalTreatment: "Apply imidacloprid to control aphid vectors.", prevention: "Use virus-free planting material, control aphids.", riskLevel: "High" },
  ],
  sugarcane:  [
    { problem: "Sugarcane Borer", symptoms: "Dead hearts in young shoots, holes in stalks, frass, reduced juice quality.", advice: "Release Trichogramma parasitoids, remove infested shoots.", organicTreatment: "Apply Bt spray or Trichogramma egg parasitoids.", chemicalTreatment: "Use chlorpyrifos or carbofuran granules.", prevention: "Use resistant varieties, destroy crop residues.", riskLevel: "High" },
    { problem: "Woolly Aphid", symptoms: "White woolly masses on roots and lower stem, stunted growth, yellowing.", advice: "Drench soil with insecticide, remove heavily infested plants.", organicTreatment: "Apply neem cake to soil, spray neem oil.", chemicalTreatment: "Use imidacloprid or thiamethoxam soil drench.", prevention: "Use clean planting material, avoid waterlogging.", riskLevel: "Medium" },
    { problem: "Red Rot", symptoms: "Red discoloration inside stalk, sour smell, wilting, stalk collapse.", advice: "Remove and destroy infected stalks, disinfect cutting tools.", organicTreatment: "Treat setts with Trichoderma before planting.", chemicalTreatment: "Soak setts in carbendazim solution before planting.", prevention: "Use resistant varieties, avoid waterlogging.", riskLevel: "High" },
    { problem: "Smut Disease", symptoms: "Black whip-like structure emerging from growing point, stunted growth.", advice: "Remove and destroy smutted shoots before spore release.", organicTreatment: "Hot water treatment of setts (50°C for 2 hours).", chemicalTreatment: "Treat setts with carboxin or thiram fungicide.", prevention: "Use disease-free planting material, resistant varieties.", riskLevel: "Medium" },
  ],
  rice:       [
    { problem: "Rice Blast", symptoms: "Diamond-shaped leaf lesions with gray centers, neck rot, reduced grain filling.", advice: "Use resistant varieties, avoid excessive nitrogen.", organicTreatment: "Apply silicon-based foliar spray.", chemicalTreatment: "Use tricyclazole or isoprothiolane fungicide.", prevention: "Use certified blast-resistant seed, maintain proper water management.", riskLevel: "High" },
    { problem: "Brown Planthopper", symptoms: "Circular yellowing patches (hopperburn), wilting, honeydew deposits.", advice: "Drain fields periodically, avoid excessive nitrogen.", organicTreatment: "Spray neem oil or release natural predators.", chemicalTreatment: "Apply buprofezin or imidacloprid.", prevention: "Use resistant varieties, avoid dense planting.", riskLevel: "High" },
    { problem: "Sheath Blight", symptoms: "Oval lesions on leaf sheaths, white mycelium, lodging of plants.", advice: "Reduce plant density, drain fields to reduce humidity.", organicTreatment: "Apply Trichoderma-based biocontrol.", chemicalTreatment: "Use validamycin or hexaconazole fungicide.", prevention: "Avoid dense planting, balanced fertilization.", riskLevel: "Medium" },
    { problem: "Stem Borer", symptoms: "Dead hearts in vegetative stage, white ears at heading, holes in stems.", advice: "Remove and destroy infested tillers.", organicTreatment: "Apply Bt granules or release Trichogramma.", chemicalTreatment: "Use carbofuran granules or chlorpyrifos.", prevention: "Early planting, destroy stubble after harvest.", riskLevel: "Medium" },
  ],
  wheat:      [
    { problem: "Rust Disease (Yellow/Brown)", symptoms: "Orange or yellow powdery pustules on leaves and stems, premature leaf death.", advice: "Apply fungicide at first sign, remove infected debris.", organicTreatment: "Spray sulfur-based fungicide or garlic extract.", chemicalTreatment: "Apply propiconazole or tebuconazole.", prevention: "Plant resistant varieties, avoid late planting.", riskLevel: "High" },
    { problem: "Powdery Mildew", symptoms: "White powdery coating on leaves and stems, yellowing, reduced grain fill.", advice: "Improve air circulation, avoid excessive nitrogen.", organicTreatment: "Spray potassium bicarbonate or neem oil.", chemicalTreatment: "Apply triadimefon or myclobutanil fungicide.", prevention: "Use resistant varieties, balanced fertilization.", riskLevel: "Medium" },
    { problem: "Aphids", symptoms: "Clusters on leaves and ears, sticky honeydew, sooty mold, yellowing.", advice: "Encourage natural predators, monitor regularly.", organicTreatment: "Spray insecticidal soap or neem oil.", chemicalTreatment: "Apply dimethoate or pirimicarb.", prevention: "Avoid late planting, use resistant varieties.", riskLevel: "Medium" },
    { problem: "Loose Smut", symptoms: "Grain replaced by black powdery mass, infected heads visible at heading.", advice: "Remove and destroy infected heads before spore release.", organicTreatment: "Hot water seed treatment (47°C for 2 hours).", chemicalTreatment: "Treat seed with carboxin or tebuconazole.", prevention: "Use certified disease-free seed.", riskLevel: "Medium" },
  ],
  potato:     [
    { problem: "Late Blight", symptoms: "Water-soaked lesions on leaves, white mold on undersides, tuber rot.", advice: "Use certified seed, ensure good drainage.", organicTreatment: "Apply copper hydroxide or Bordeaux mixture.", chemicalTreatment: "Use metalaxyl + mancozeb or cymoxanil-based fungicide.", prevention: "Use certified disease-free seed, hill up plants.", riskLevel: "High" },
    { problem: "Colorado Potato Beetle", symptoms: "Defoliation, orange egg clusters under leaves, yellow-black striped beetles.", advice: "Hand-pick beetles and egg masses, rotate crops.", organicTreatment: "Apply Bt tenebrionis or spinosad spray.", chemicalTreatment: "Use imidacloprid or spinosad insecticide.", prevention: "Rotate crops, use row covers, destroy crop debris.", riskLevel: "High" },
    { problem: "Common Scab", symptoms: "Rough corky lesions on tuber surface, reduced marketability.", advice: "Maintain soil pH below 5.5, avoid fresh manure.", organicTreatment: "Apply sulfur to lower soil pH.", chemicalTreatment: "Treat seed with thiabendazole or fludioxonil.", prevention: "Use resistant varieties, maintain soil moisture.", riskLevel: "Low" },
    { problem: "Aphids / Virus Vectors", symptoms: "Curled leaves, mosaic patterns, stunted growth, spread of viruses.", advice: "Remove infected plants, use reflective mulch.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or thiamethoxam.", prevention: "Use certified virus-free seed, control aphids early.", riskLevel: "Medium" },
  ],
  beans:      [
    { problem: "Aphids", symptoms: "Curled leaves, sticky honeydew, weak growth, clusters of small insects.", advice: "Remove heavily infested shoots, encourage natural predators.", organicTreatment: "Spray insecticidal soap or neem oil.", chemicalTreatment: "Apply imidacloprid or dimethoate.", prevention: "Avoid excessive nitrogen, plant companion crops like marigold.", riskLevel: "Medium" },
    { problem: "Bean Rust", symptoms: "Reddish-brown pustules on leaves, yellowing, premature defoliation.", advice: "Remove infected leaves, improve air circulation.", organicTreatment: "Spray sulfur-based fungicide.", chemicalTreatment: "Apply mancozeb or tebuconazole.", prevention: "Use resistant varieties, avoid overhead irrigation.", riskLevel: "Medium" },
    { problem: "Bean Fly", symptoms: "Wilting seedlings, swollen stem base, maggots inside stem.", advice: "Replant if severely affected, use seed dressing.", organicTreatment: "Apply neem cake to soil at planting.", chemicalTreatment: "Treat seed with imidacloprid or thiamethoxam.", prevention: "Early planting, use resistant varieties.", riskLevel: "High" },
    { problem: "Angular Leaf Spot", symptoms: "Angular brown lesions on leaves, water-soaked spots, defoliation.", advice: "Avoid overhead irrigation, remove infected debris.", organicTreatment: "Spray copper-based fungicide.", chemicalTreatment: "Apply mancozeb or chlorothalonil.", prevention: "Use certified seed, rotate crops.", riskLevel: "Medium" },
  ],
  cabbage:    [
    { problem: "Diamondback Moth", symptoms: "Small holes in leaves, skeletonized foliage, small green caterpillars.", advice: "Use pheromone traps, rotate insecticide classes.", organicTreatment: "Apply Bt spray or spinosad biopesticide.", chemicalTreatment: "Use chlorfenapyr or indoxacarb.", prevention: "Use fine mesh nets, intercrop with aromatic herbs.", riskLevel: "Medium" },
    { problem: "Cabbage Aphid", symptoms: "Dense gray-green colonies on leaves, curling, honeydew, sooty mold.", advice: "Encourage parasitic wasps, remove infested leaves.", organicTreatment: "Spray insecticidal soap or neem oil.", chemicalTreatment: "Apply pirimicarb or imidacloprid.", prevention: "Avoid dense planting, use reflective mulch.", riskLevel: "Medium" },
    { problem: "Black Rot", symptoms: "V-shaped yellow lesions from leaf margins, blackened veins, wilting.", advice: "Remove infected plants, disinfect tools.", organicTreatment: "Spray copper-based bactericide.", chemicalTreatment: "Apply copper hydroxide or streptomycin.", prevention: "Use certified seed, rotate crops, avoid overhead irrigation.", riskLevel: "High" },
    { problem: "Clubroot", symptoms: "Wilting in warm weather, swollen distorted roots, stunted growth.", advice: "Lime soil to raise pH above 7, remove infected plants.", organicTreatment: "Apply lime to raise soil pH.", chemicalTreatment: "Drench soil with fluazinam or cyazofamid.", prevention: "Rotate crops, improve drainage, use resistant varieties.", riskLevel: "High" },
  ],
  mango:      [
    { problem: "Mango Hopper", symptoms: "Yellowing and drying of inflorescences, honeydew deposits, sooty mold.", advice: "Spray neem-based insecticide at bud burst stage.", organicTreatment: "Apply neem oil (3%) or fish oil rosin soap.", chemicalTreatment: "Use imidacloprid or carbaryl at flowering.", prevention: "Prune dense canopy, remove weeds.", riskLevel: "High" },
    { problem: "Anthracnose", symptoms: "Dark irregular spots on leaves and fruit, fruit rot, blossom blight.", advice: "Remove infected plant parts, avoid wetting foliage.", organicTreatment: "Spray copper oxychloride or neem oil.", chemicalTreatment: "Apply mancozeb or carbendazim fungicide.", prevention: "Prune for air circulation, use disease-free planting material.", riskLevel: "High" },
    { problem: "Mango Mealybug", symptoms: "White cottony masses on shoots and fruit, honeydew, sooty mold, fruit drop.", advice: "Apply sticky bands on trunk to prevent crawlers.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or chlorpyrifos.", prevention: "Remove weeds, apply sticky bands, destroy egg masses.", riskLevel: "Medium" },
    { problem: "Powdery Mildew", symptoms: "White powdery coating on young leaves and flowers, flower drop, poor fruit set.", advice: "Apply fungicide at bud burst and flowering.", organicTreatment: "Spray sulfur dust or potassium bicarbonate.", chemicalTreatment: "Apply hexaconazole or dinocap fungicide.", prevention: "Prune for air circulation, avoid excessive nitrogen.", riskLevel: "Medium" },
  ],
  groundnut:  [
    { problem: "Early Leaf Spot", symptoms: "Circular brown spots with yellow halo on leaves, premature defoliation.", advice: "Apply fungicide at first sign, remove infected debris.", organicTreatment: "Spray copper-based fungicide.", chemicalTreatment: "Apply chlorothalonil or mancozeb.", prevention: "Use resistant varieties, rotate crops.", riskLevel: "Medium" },
    { problem: "Groundnut Rosette Virus", symptoms: "Stunted plants, mosaic yellowing, small distorted leaves, poor pod set.", advice: "Remove and destroy infected plants immediately.", organicTreatment: "Control aphid vectors with neem oil spray.", chemicalTreatment: "Apply imidacloprid to control aphid vectors.", prevention: "Early planting, use resistant varieties, control aphids.", riskLevel: "High" },
    { problem: "Aspergillus Crown Rot", symptoms: "Wilting seedlings, brown rot at crown, white to yellow mold on stem base.", advice: "Improve drainage, avoid wounding plants.", organicTreatment: "Treat seed with Trichoderma before planting.", chemicalTreatment: "Treat seed with thiram or carbendazim.", prevention: "Use certified seed, avoid waterlogging.", riskLevel: "Medium" },
    { problem: "Termites", symptoms: "Wilting plants, hollow stems, soil tunnels around roots, plant death.", advice: "Remove infested plants, apply soil insecticide.", organicTreatment: "Apply neem cake to soil.", chemicalTreatment: "Use chlorpyrifos or imidacloprid soil drench.", prevention: "Remove crop debris, avoid planting in termite-prone areas.", riskLevel: "Medium" },
  ],
  soybean:    [
    { problem: "Soybean Rust", symptoms: "Tan to brown pustules on leaf undersides, yellowing, premature defoliation.", advice: "Apply fungicide early, monitor regularly.", organicTreatment: "Spray sulfur-based fungicide.", chemicalTreatment: "Apply trifloxystrobin or azoxystrobin.", prevention: "Use resistant varieties, early planting.", riskLevel: "High" },
    { problem: "Whitefly", symptoms: "Tiny white insects under leaves, yellowing, honeydew, sooty mold.", advice: "Use yellow sticky traps, introduce natural enemies.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or thiamethoxam.", prevention: "Use reflective mulch, remove crop debris.", riskLevel: "Medium" },
    { problem: "Pod Borer", symptoms: "Holes in pods, damaged seeds, frass, caterpillars inside pods.", advice: "Scout regularly, apply insecticide at pod fill.", organicTreatment: "Apply Bt spray or neem oil.", chemicalTreatment: "Use chlorpyrifos or lambda-cyhalothrin.", prevention: "Early planting, destroy crop residues.", riskLevel: "High" },
    { problem: "Bacterial Pustule", symptoms: "Small yellow-green spots with raised centers on leaves, defoliation.", advice: "Avoid overhead irrigation, remove infected debris.", organicTreatment: "Spray copper-based bactericide.", chemicalTreatment: "Apply copper hydroxide.", prevention: "Use certified seed, rotate crops.", riskLevel: "Low" },
  ],
  cotton:     [
    { problem: "Bollworm", symptoms: "Holes in bolls, damaged lint, frass, caterpillars inside bolls.", advice: "Scout regularly, use pheromone traps.", organicTreatment: "Apply Bt spray or neem oil.", chemicalTreatment: "Use chlorpyrifos or lambda-cyhalothrin.", prevention: "Early planting, destroy crop residues, use Bt cotton.", riskLevel: "High" },
    { problem: "Aphids", symptoms: "Curled leaves, sticky honeydew, sooty mold, stunted growth.", advice: "Encourage natural predators, monitor regularly.", organicTreatment: "Spray insecticidal soap or neem oil.", chemicalTreatment: "Apply imidacloprid or dimethoate.", prevention: "Avoid excessive nitrogen, use reflective mulch.", riskLevel: "Medium" },
    { problem: "Whitefly", symptoms: "Tiny white insects under leaves, yellowing, honeydew, sooty mold.", advice: "Use yellow sticky traps, introduce natural enemies.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or thiamethoxam.", prevention: "Use reflective mulch, remove crop debris.", riskLevel: "High" },
    { problem: "Cotton Leaf Curl Virus", symptoms: "Upward curling of leaves, thickened veins, stunted growth, reduced yield.", advice: "Remove and destroy infected plants.", organicTreatment: "Control whitefly vectors with neem oil.", chemicalTreatment: "Apply imidacloprid to control whitefly vectors.", prevention: "Use resistant varieties, control whiteflies.", riskLevel: "High" },
  ],
};

// Normalize crop name to key
function normalizeCrop(crop) {
  return crop.trim().toLowerCase().replace(/s$/, ""); // simple singularize
}

// Find best matching key in DB
function findCropKey(crop) {
  const norm = normalizeCrop(crop);
  // exact match
  if (PEST_DB[norm]) return norm;
  // partial match
  const keys = Object.keys(PEST_DB);
  const partial = keys.find((k) => k.startsWith(norm) || norm.startsWith(k));
  if (partial) return partial;
  return null;
}

// GET /api/pests-ai/library?crop=Onion
router.get("/library", async (req, res) => {
  try {
    const { crop } = req.query;
    if (!crop) return res.status(400).json({ error: "crop is required" });

    const key = findCropKey(crop);

    if (key) {
      // Return from built-in DB
      const pests = PEST_DB[key].map((p, i) => ({
        _id: `db-${key}-${i}`,
        crop: crop,
        ...p,
        source: "database",
      }));
      return res.json(pests);
    }

    // Crop not in DB — try Gemini as fallback
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const key2 = process.env.GEMINI_API_KEY || "AIzaSyAXF32KOqBEmzirwRCEO_U2-z6_hngEHhk";
      const genAI = new GoogleGenerativeAI(key2);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `List 4 common pests or diseases for ${crop} crop. Reply ONLY with a JSON array (no markdown, no code fences): [{"problem":"","symptoms":"","advice":"","organicTreatment":"","chemicalTreatment":"","prevention":"","riskLevel":"High or Medium or Low"}]`;
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim().replace(/```json|```/gi, "").trim();
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const valid = ["High", "Medium", "Low"];
        return res.json(parsed.map((p, i) => ({
          _id: `ai-${i}-${Math.random().toString(36).slice(2)}`,
          crop,
          problem: p.problem || "Unknown",
          symptoms: p.symptoms || "",
          advice: p.advice || "",
          organicTreatment: Array.isArray(p.organicTreatment) ? p.organicTreatment.join(" ") : (p.organicTreatment || ""),
          chemicalTreatment: Array.isArray(p.chemicalTreatment) ? p.chemicalTreatment.join(" ") : (p.chemicalTreatment || ""),
          prevention: Array.isArray(p.prevention) ? p.prevention.join(" ") : (p.prevention || ""),
          riskLevel: valid.includes(p.riskLevel) ? p.riskLevel : "Medium",
          source: "ai",
        })));
      }
    } catch (aiErr) {
      console.log("Gemini fallback error:", aiErr.message);
    }

    // Final fallback: generic pests
    return res.json([
      { _id: "gen-1", crop, problem: "Aphids", symptoms: "Clusters of small insects on leaves, sticky honeydew, curled leaves, stunted growth.", advice: "Remove infested shoots, encourage natural predators.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or dimethoate.", prevention: "Avoid excessive nitrogen, use companion planting.", riskLevel: "Medium", source: "database" },
      { _id: "gen-2", crop, problem: "Fungal Leaf Spot", symptoms: "Brown or black circular spots on leaves, yellowing, premature leaf drop.", advice: "Remove infected leaves, avoid overhead watering.", organicTreatment: "Spray copper-based fungicide.", chemicalTreatment: "Apply mancozeb or chlorothalonil.", prevention: "Rotate crops, use certified seed, improve air circulation.", riskLevel: "Medium", source: "database" },
      { _id: "gen-3", crop, problem: "Whitefly", symptoms: "Tiny white insects under leaves, yellowing, honeydew deposits, sooty mold.", advice: "Use yellow sticky traps, introduce natural enemies.", organicTreatment: "Spray neem oil or insecticidal soap.", chemicalTreatment: "Apply imidacloprid or thiamethoxam.", prevention: "Use reflective mulch, remove crop debris.", riskLevel: "Low", source: "database" },
      { _id: "gen-4", crop, problem: "Root Rot", symptoms: "Wilting despite adequate water, brown mushy roots, yellowing lower leaves.", advice: "Improve drainage, avoid overwatering.", organicTreatment: "Apply Trichoderma-based biocontrol to soil.", chemicalTreatment: "Drench soil with metalaxyl or carbendazim.", prevention: "Ensure good drainage, avoid waterlogging, rotate crops.", riskLevel: "High", source: "database" },
    ]);
  } catch (err) {
    console.log("Library error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
