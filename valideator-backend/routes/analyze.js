const db = require("../firebase");
const express = require("express");
const fetch = require("node-fetch");
const { optimizePrompt } = require("../utils/optimizer");
const { countTokens } = require("../utils/tokenizer");
const { getCache, setCache } = require("../utils/cache");

const router = express.Router();

// ═══════════════════════════════════════════════════════════════
// SMART VALIDATION — Only allow genuine startup/business ideas
// ═══════════════════════════════════════════════════════════════

// Patterns that indicate NON-startup input
const REJECTED_PATTERNS = [
  // Greetings
  /^(hi|hello|hey|howdy|hola|sup|yo|greetings|good\s?(morning|evening|afternoon|night)|what'?s?\s?up)[\s!?.]*$/i,
  // Code requests
  /\b(write|give|show|create|make|generate|code|script|program|function|class|def|import|console\.log|print\(|var\s|let\s|const\s|return\s)\b.*\b(python|java|javascript|js|c\+\+|html|css|sql|code|script|program|function|algorithm)\b/i,
  // Generic questions
  /^(who|what|when|where|why|how)\s+(is|are|was|were|do|does|did|can|could|will|would|should)\s/i,
  // Math/calculation
  /^\d+\s*[\+\-\*\/\%]\s*\d+/,
  // Just numbers
  /^\d+$/,
  // Very short gibberish
  /^[a-z]{1,3}$/i,
  // Asking AI to do non-startup tasks
  /\b(translate|summarize|explain|define|tell me|joke|poem|story|essay|letter|email|recipe)\b/i,
  // Explicit test/spam
  /^(test|testing|asdf|qwerty|abc|xyz|foo|bar|baz|lorem)[\s!?.]*$/i,
];

// Keywords that SUGGEST a valid startup/business idea
const STARTUP_KEYWORDS = [
  'app', 'platform', 'marketplace', 'service', 'tool', 'product',
  'website', 'saas', 'subscription', 'business', 'startup', 'company',
  'users', 'customers', 'revenue', 'market', 'solve', 'solution',
  'delivery', 'e-commerce', 'ecommerce', 'ai', 'machine learning',
  'fintech', 'healthtech', 'edtech', 'social', 'mobile', 'online',
  'digital', 'automated', 'automation', 'booking', 'rental',
  'connect', 'matching', 'recommendation', 'analytics', 'dashboard',
  'payment', 'logistics', 'supply chain', 'food', 'health', 'education',
  'fitness', 'travel', 'real estate', 'insurance', 'crypto', 'blockchain',
  'iot', 'smart', 'wearable', 'virtual', 'augmented', 'ar', 'vr',
  'freelance', 'gig', 'talent', 'hiring', 'recruitment',
  'sustainability', 'green', 'eco', 'renewable', 'clean',
  'mentor', 'coach', 'community', 'network', 'peer-to-peer', 'p2p',
  'aggregator', 'on-demand', 'personalized', 'custom', 'niche',
  'enterprise', 'b2b', 'b2c', 'd2c', 'sell', 'buy', 'trade',
  'invest', 'fund', 'crowdfunding', 'idea', 'innovation', 'disrupt'
];

function isValidStartupIdea(input) {
  if (!input) return { valid: false, reason: "Please enter a startup idea to analyze." };

  const text = input.trim();

  // Too short
  if (text.length < 15) {
    return { valid: false, reason: "Your input is too short. Please describe your startup idea in detail (at least a sentence)." };
  }

  // Too few words  
  const words = text.split(/\s+/);
  if (words.length < 4) {
    return { valid: false, reason: "Please provide more detail about your idea. Describe what it does, who it's for, and why it matters." };
  }

  // Check if it matches any rejected pattern
  for (const pattern of REJECTED_PATTERNS) {
    if (pattern.test(text)) {
      return { valid: false, reason: "That doesn't look like a startup idea. Please describe a product, service, or business concept you want to validate." };
    }
  }

  // Check for startup-related keywords (at least one should be present)
  const lowerText = text.toLowerCase();
  const hasStartupKeyword = STARTUP_KEYWORDS.some(keyword => lowerText.includes(keyword));

  // If no startup keyword found, check if it still sounds like an idea
  // (contains action verbs that suggest building something)
  const actionVerbs = /\b(build|create|develop|launch|start|offer|provide|design|connect|help|enable|empower|automate|simplify|streamline)\b/i;
  const hasActionVerb = actionVerbs.test(text);

  if (!hasStartupKeyword && !hasActionVerb) {
    return {
      valid: false,
      reason: "This doesn't appear to be a startup or business idea. Please describe a product, service, platform, or business concept. Example: 'An AI-powered app that helps students find affordable tutoring.'"
    };
  }

  return { valid: true };
}

// ✅ AI CALL
const callAI = async (prompt) => {
  const res = await fetch(process.env.AI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await res.json();
  console.log("FULL AI RESPONSE:", data);

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

// ✅ MAIN ROUTE
router.post("/", async (req, res) => {
  try {
    let { idea, harshMode } = req.body;

    // ❌ Missing idea
    if (!idea) {
      return res.status(400).json({ error: "Idea is required" });
    }

    // ❌ Smart validation
    const validation = isValidStartupIdea(idea);
    if (!validation.valid) {
      return res.json({
        score: 0,
        feasibility: "Invalid",
        message: validation.reason
      });
    }

    const normalizedIdea = idea.toLowerCase().trim();

    // ✅ Cache check
    const cached = getCache(normalizedIdea);
    if (cached) return res.json(cached);

    // ✅ CarbonGPT logic
    const optimizedPrompt = optimizePrompt(idea);
    const tokens = countTokens(optimizedPrompt);

    // ✅ Prompt with CLEAR SCORING CRITERIA
    const prompt = `
You are an expert startup validator AI called "Valideator". Analyze the startup idea using these 5 STRICT scoring criteria:

## SCORING CRITERIA (each 0-20 points, total 0-100):

1. **Market Demand (0-20)**: Is there real, proven demand for this? Are people actively looking for this solution? Is the target market large enough?
   - 0-5: No clear demand, niche too small
   - 6-10: Some demand but unproven
   - 11-15: Growing demand with evidence
   - 16-20: Massive, validated market demand

2. **Uniqueness & Differentiation (0-20)**: How different is this from existing solutions? What's the competitive moat?
   - 0-5: Many existing identical solutions
   - 6-10: Similar products exist but with minor differences
   - 11-15: Notable differentiation with clear advantages
   - 16-20: Truly innovative, first-mover potential

3. **Technical Feasibility (0-20)**: Can this realistically be built? What's the technical complexity?
   - 0-5: Extremely complex, requires breakthrough tech
   - 6-10: Challenging but doable with significant resources
   - 11-15: Feasible with standard technology
   - 16-20: Easy to build with existing tools/frameworks

4. **Scalability (0-20)**: Can this grow to serve millions? Is the business model scalable?
   - 0-5: Very limited scaling potential
   - 6-10: Can scale but with major challenges
   - 11-15: Good scaling potential with manageable challenges
   - 16-20: Highly scalable, network effects possible

5. **Revenue Potential (0-20)**: Can this make money? Are customers willing to pay?
   - 0-5: No clear revenue model
   - 6-10: Revenue possible but margins slim
   - 11-15: Strong revenue model with decent margins
   - 16-20: Multiple revenue streams, high willingness to pay

Also analyze from 3 perspectives:
1. Investor (ROI, scalability, exit potential)
2. User (usability, pain point resolution, demand)
3. Competitor (weaknesses, threats, market gaps)

Provide SWOT analysis, risks, and suggestions.

${harshMode ? "BE BRUTALLY HONEST. Don't sugarcoat anything. Point out every flaw mercilessly." : "Be constructive but honest."}

Return ONLY valid JSON in this EXACT format:

{
  "score": <number 0-100, sum of all 5 criteria>,
  "score_breakdown": {
    "market_demand": <0-20>,
    "uniqueness": <0-20>,
    "feasibility": <0-20>,
    "scalability": <0-20>,
    "revenue_potential": <0-20>
  },
  "feasibility": "Low/Medium/High",
  "investor_view": "...",
  "user_view": "...",
  "competitor_view": "...",
  "swot": {
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": []
  },
  "risks": [],
  "suggestions": []
}

Idea: ${optimizedPrompt}
`;

    // ✅ CALL AI (FIXED)
    const aiRaw = await callAI(prompt);

    // ✅ SAFE PARSE
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

      const jsonString = cleaned.substring(jsonStart, jsonEnd + 1);
      parsed = JSON.parse(jsonString);

    } catch (e) {
      console.log("❌ PARSE FAILED");
      console.log("👉 RAW AI RESPONSE:\n", aiRaw);

      parsed = {
        score: 50,
        score_breakdown: {
          market_demand: 10,
          uniqueness: 10,
          feasibility: 10,
          scalability: 10,
          revenue_potential: 10
        },
        feasibility: "Medium",
        investor_view: "Unable to analyze fully.",
        user_view: "Needs validation.",
        competitor_view: "Competition unclear.",
        swot: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: []
        },
        risks: ["Parsing failed"],
        suggestions: ["Try again"]
      };
    }

    // ✅ Save to DB
    await db.collection("ideas").add({
      idea: idea,
      score: parsed.score,
      score_breakdown: parsed.score_breakdown || null,
      feasibility: parsed.feasibility,
      createdAt: new Date()
    });

    // ✅ Final response
    const response = {
      optimizedPrompt,
      tokensUsed: tokens,
      energyEstimate: `${tokens * 0.002} kWh`,
      analysis: parsed
    };

    // ✅ Cache result
    setCache(normalizedIdea, response);

    res.json(response);

  } catch (err) {
    console.error("Analyze error:", err.message || err);

    const isRateLimit = err.message && err.message.toLowerCase().includes("rate limit");
    const errorMsg = isRateLimit
      ? "AI service is currently rate-limited. Please wait a minute and try again."
      : "Server error — please try again.";

    res.status(isRateLimit ? 429 : 500).json({ error: errorMsg });
  }
});

module.exports = router;