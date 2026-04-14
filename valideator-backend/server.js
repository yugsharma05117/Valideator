const express = require("express");
const cors = require("cors");
const leaderboardRoute = require("./routes/leaderboard");
const failureAnalysisRoute = require("./routes/failureAnalysis");
const chatRoute = require("./routes/chat");

require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const app = express();

// CORS — allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL  // Set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    // Also allow any *.vercel.app domain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use("/leaderboard", leaderboardRoute);
app.use("/failure-analysis", failureAnalysisRoute);
app.use("/chat", chatRoute);

// route handler
app.use("/analyze", analyzeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});