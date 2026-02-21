const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

// --- STEP 0: THE "SPY" LOGGER (Must be absolutely first) ---
// This will print details for EVERY request, even if CORS blocks it later.
app.use((req, res, next) => {
  console.log("-----------------------------------------");
  console.log(`📨 NEW REQUEST: ${req.method} ${req.url}`);
  console.log(`📍 Origin: ${req.headers.origin}`);
  console.log("-----------------------------------------");
  next();
});

// --- STEP 1: DYNAMIC CORS ---
// Instead of hardcoding one URL, we check if the origin is trusted.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ BLOCKED BY CORS: ${origin}`); // Log if we block it
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// --- STEP 2: BODY PARSER ---
app.use(express.json());

// --- STEP 3: DATABASE ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// --- STEP 4: ROUTES ---
app.use("/api/auth", require("./routes/auth.route"));
const doctorRoutes = require("./routes/doctor.route");
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", require("./routes/appointment.route"));
app.use("/api/labs", require("./routes/lab.route"));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));