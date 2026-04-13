const express = require("express");
const cors = require("cors");
const leaderboardRoute = require("./routes/leaderboard");
const failureAnalysisRoute = require("./routes/failureAnalysis");
const chatRoute = require("./routes/chat");

require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const app = express();

app.use(cors());
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