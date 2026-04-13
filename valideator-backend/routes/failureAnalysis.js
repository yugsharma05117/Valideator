const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Load startup failure dataset
const failureData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "startup_failures.json"), "utf-8")
);

/**
 * Analyze user's idea against known startup failure patterns.
 * Uses the curated dataset + AI reasoning to explain WHY the idea might fail.
 */
const callAI = async (prompt) => {
  const res = await fetch(process.env.AI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();

  // Handle API errors (rate limits, auth errors, etc.)
  if (data.error) {
    console.error("AI API Error:", data.error);
    throw new Error(data.error.message || "AI service is temporarily unavailable");
  }

  if (!data.choices || !data.choices[0]) {
    console.error("Unexpected AI response:", data);
    throw new Error("AI returned an unexpected response");
  }

  return data.choices[0].message.content;
};

router.post("/", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required" });
    }

    // Build context from failure dataset
    const failureSummary = failureData.map(f =>
      `- ${f.category} (${f.percentage}% of failures): ${f.description}. Signals: ${f.signals.join(", ")}`
    ).join("\n");

    const prompt = `
You are an expert startup failure analyst. You have deep knowledge of why startups fail.

Here is a comprehensive database of startup failure reasons with their frequencies:

${failureSummary}

A user has the following startup idea:
"${idea}"

Analyze this idea against the known failure patterns. For each relevant failure category, explain:
1. How likely this idea is to face this specific failure mode
2. What specific signals in their idea point to this risk
3. What they can do to avoid it

Return ONLY valid JSON in this exact format:
{
  "idea": "${idea}",
  "overall_failure_risk": "Low/Medium/High/Very High",
  "risk_score": <number 0-100 where 100 is highest risk>,
  "top_failure_reasons": [
    {
      "category": "...",
      "likelihood": "Low/Medium/High",
      "percentage_of_startups": <number>,
      "why_applies": "...",
      "warning_signals": ["..."],
      "how_to_avoid": "..."
    }
  ],
  "historical_similar_failures": [
    {
      "company": "...",
      "what_happened": "...",
      "lesson": "..."
    }
  ],
  "survival_tips": ["..."],
  "harsh_truth": "..."
}

Include 3-5 top failure reasons most relevant to this idea. Be specific and data-driven.
`;

    const aiRaw = await callAI(prompt);

    let parsed;
    try {
      const cleaned = aiRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON found");
      }

      parsed = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
    } catch (e) {
      console.log("❌ Failure analysis parse failed:", e.message);
      parsed = {
        idea: idea,
        overall_failure_risk: "Medium",
        risk_score: 50,
        top_failure_reasons: failureData.slice(0, 3).map(f => ({
          category: f.category,
          likelihood: "Medium",
          percentage_of_startups: f.percentage,
          why_applies: f.description,
          warning_signals: f.signals.slice(0, 2),
          how_to_avoid: f.advice
        })),
        historical_similar_failures: [],
        survival_tips: ["Validate your market first", "Build an MVP before investing heavily"],
        harsh_truth: "Most startups fail. Yours needs proper validation."
      };
    }

    res.json(parsed);

  } catch (err) {
    console.error("Failure analysis error:", err);
    res.status(500).json({ error: "Server error during failure analysis" });
  }
});

module.exports = router;
