require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const authRoutes = require("./routes/auth");
const recommendRoutes = require("./routes/recommend");
const cropRoutes = require("./routes/crops");
const profileRoutes = require("./routes/profiles");
const historyRoutes = require("./routes/history");
const pestRoutes = require("./routes/pestRoutes");
const pestAIRoutes = require("./routes/pestAI");
const advisoryRoutes = require("./routes/advisory");
const weatherRoutes = require("./routes/weather");
const marketRoutes = require("./routes/market");

const app = express();
const PORT = process.env.PORT || 10000;

const ALLOWED_ORIGINS = [
  /^http:\/\/localhost:\d+$/,
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (allowed) return callback(null, true);
    callback(new Error("CORS: origin not allowed"));
  },
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/pests", pestRoutes);
app.use("/api/pests-ai", pestAIRoutes);
app.use("/api/advisory", advisoryRoutes); 
app.use("/api/weather", weatherRoutes);
app.use("/api/market", marketRoutes);
app.get("/", (req, res) => res.send("Smart Agriculture API Running"));

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGODB_URI is not set in .env");
  process.exit(1);
}

async function ensureAdminUser() {
  try {
    const email = "admin@smartagri.com";
    const phone = "+251911000000";
    const password = "admin@1234";

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new User({
        name: "Admin",
        email,
        phone,
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("✅ Default admin created: admin@smartagri.com / admin@1234");
    } else {
      console.log("✅ Admin account already exists");
    }
  } catch (error) {
    console.error("❌ Failed to ensure admin user:", error.message);
  }
}

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  maxPoolSize: 10,
})
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await ensureAdminUser();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));

mongoose.connection.on("error", err => console.error("Mongoose error:", err.message));
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected — retrying..."));
mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));
