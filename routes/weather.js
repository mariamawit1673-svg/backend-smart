const express = require("express");
const https = require("https");
const router = express.Router();
const OWM_KEY = process.env.WEATHER_API_KEY || "bd5e378503939ddaee76f12ad7a97608";
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch(e) { reject(e); } });
    }).on("error", reject);
  });
}
function toFarming(w) {
  const temp = w.main.temp, hum = w.main.humidity;
  const rain = w.rain ? (w.rain["1h"] || w.rain["3h"] || 0) : 0;
  const month = new Date().getMonth();
  return {
    temperature: temp < 18 ? "moderate" : temp < 28 ? "warm" : "hot",
    rainfall: (rain === 0 && hum < 50) ? "low" : (rain > 5 || hum > 75) ? "high" : "medium",
    season: (month >= 9 || month <= 2) ? "dry" : "rainy",
    soilHint: hum > 80 ? "clay" : hum < 40 ? "sandy" : "loam",
    humidity: hum, temp: Math.round(temp), rainMm: rain
  };
}
router.get("/", async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    let url;
    if (lat && lon) url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + OWM_KEY + "&units=metric";
    else if (city) url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + OWM_KEY + "&units=metric";
    else return res.status(400).json({ error: "lat/lon or city required" });
    const { status, body } = await httpsGet(url);
    if (status !== 200) return res.status(status).json({ error: body.message || "Weather API error" });
    res.json({
      location: body.name, country: body.sys && body.sys.country,
      temp: Math.round(body.main.temp), feelsLike: Math.round(body.main.feels_like),
      humidity: body.main.humidity, description: body.weather[0].description,
      icon: body.weather[0].icon, windSpeed: body.wind ? body.wind.speed : 0,
      farming: toFarming(body)
    });
  } catch(err) { console.error("Weather error:", err.message); res.status(500).json({ error: err.message }); }
});
module.exports = router;