const defaultCrops = [
    {
        name: "Maize",
        soilTypes: ["loam", "sandy"],
        seasons: ["rainy"],
        rainfall: "medium",
        temperature: "warm",
        waterRequirement: "medium",
        fertilizerAdvice: "Use compost before planting and apply NPK during early growth.",
        pestAdvice: "Monitor fall armyworm and remove affected leaves early.",
        harvestPeriod: "3 to 4 months",
        description: "A reliable cereal crop for warm rainy seasons."
    },
    {
        name: "Beans",
        soilTypes: ["loam"],
        seasons: ["rainy"],
        rainfall: "medium",
        temperature: "moderate",
        waterRequirement: "medium",
        fertilizerAdvice: "Use compost and avoid too much nitrogen fertilizer.",
        pestAdvice: "Watch for aphids and bean rust.",
        harvestPeriod: "2 to 3 months",
        description: "Good legume for improving soil fertility."
    },
    {
        name: "Rice",
        soilTypes: ["clay"],
        seasons: ["rainy"],
        rainfall: "high",
        temperature: "warm",
        waterRequirement: "high",
        fertilizerAdvice: "Apply organic manure and split nitrogen fertilizer applications.",
        pestAdvice: "Monitor birds, stem borers, and rice blast.",
        harvestPeriod: "4 to 5 months",
        description: "Suitable for heavy clay soil with reliable water."
    },
    {
        name: "Sorghum",
        soilTypes: ["clay", "sandy"],
        seasons: ["dry"],
        rainfall: "low",
        temperature: "hot",
        waterRequirement: "low",
        fertilizerAdvice: "Use manure or moderate NPK fertilizer.",
        pestAdvice: "Control shoot fly and birds during grain filling.",
        harvestPeriod: "3 to 4 months",
        description: "Drought-tolerant cereal for dry conditions."
    },
    {
        name: "Tomato",
        soilTypes: ["loam"],
        seasons: ["dry"],
        rainfall: "low",
        temperature: "warm",
        waterRequirement: "medium",
        fertilizerAdvice: "Use compost and potassium-rich fertilizer during fruiting.",
        pestAdvice: "Scout for tomato blight, whiteflies, and fruit worm.",
        harvestPeriod: "3 months",
        description: "High-value vegetable crop when irrigation is available."
    },
    {
        name: "Groundnut",
        soilTypes: ["sandy"],
        seasons: ["rainy"],
        rainfall: "medium",
        temperature: "warm",
        waterRequirement: "medium",
        fertilizerAdvice: "Use phosphorus fertilizer and avoid waterlogging.",
        pestAdvice: "Check for leaf spot and aphids.",
        harvestPeriod: "3 to 4 months",
        description: "Performs well in loose sandy soils."
    },
    {
        name: "Cotton",
        soilTypes: ["black"],
        seasons: ["rainy"],
        rainfall: "medium",
        temperature: "hot",
        waterRequirement: "medium",
        fertilizerAdvice: "Apply balanced fertilizer after thinning.",
        pestAdvice: "Monitor bollworms and sucking pests.",
        harvestPeriod: "5 to 6 months",
        description: "Cash crop suited to black cotton soil."
    },
    {
        name: "Chickpea",
        soilTypes: ["black", "clay"],
        seasons: ["dry"],
        rainfall: "low",
        temperature: "moderate",
        waterRequirement: "low",
        fertilizerAdvice: "Use compost and phosphorus fertilizer.",
        pestAdvice: "Watch for pod borer and root rot.",
        harvestPeriod: "3 to 4 months",
        description: "Useful pulse crop for dry seasons."
    }
];

module.exports = defaultCrops;
