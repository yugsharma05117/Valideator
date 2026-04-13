const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// In-memory conversation store (per session)
const conversations = new Map();

const callAI = async (messages) => {
  const res = await fetch(process.env.AI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: messages
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

/**
 * POST /chat
 * Body: { message, sessionId, context? }
 * 
 * Allows free-form brainstorming with the AI.
 * Maintains conversation history per session.
 */
router.post("/", async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid = sessionId || `session_${Date.now()}`;

    // Get or create conversation history
    if (!conversations.has(sid)) {
      conversations.set(sid, [
        {
          role: "system",
          content: `You are Valideator AI — a startup-focused brainstorming assistant. You ONLY discuss topics related to startups, business ideas, and entrepreneurship.

STRICT RULES — YOU MUST FOLLOW THESE:
1. You ONLY help with startup ideas, business concepts, entrepreneurship, and related topics.
2. If a user asks about ANYTHING unrelated to startups/business (e.g., science, Newton's Law, history, math, coding tutorials, recipes, weather, sports, entertainment, homework, general knowledge, etc.), you MUST politely refuse and redirect them.
3. When refusing off-topic requests, say something like: "I'm Valideator AI — I only help with startup ideas and business brainstorming! 🚀 Try asking me something like 'Help me brainstorm a startup idea for healthcare' or 'What business model should I use for my app?'"
4. Do NOT try to connect unrelated topics to startups. For example, if someone asks about "Newton's Law", do NOT say "Let me relate Newton's Law to startups..." — just refuse politely.
5. Even if the user insists, stay firm. You are ONLY for startup brainstorming.

WHAT YOU CAN HELP WITH:
- Brainstorming new startup/business ideas
- Refining and improving existing startup ideas
- Business models, revenue strategies, pricing
- Go-to-market strategies and marketing
- MVP planning and product strategy
- Competitive analysis and market research
- Startup naming, branding, positioning
- Fundraising, pitch decks, investor tips
- Startup success/failure case studies
- Team building and co-founder advice
- Scaling and growth strategies

HOW TO RESPOND:
- Be conversational, supportive, and insightful
- Give specific, actionable advice (not generic platitudes)
- Ask clarifying questions when needed
- Use real startup examples and case studies
- Be honest about risks but encouraging about potential
- Keep responses concise but thorough
${context ? `\nContext about the user's idea: ${context}` : ""}

Remember: You are EXCLUSIVELY a startup brainstorming partner. Nothing else.`
        }
      ]);
    }

    const history = conversations.get(sid);

    // Add user message
    history.push({ role: "user", content: message });

    // Keep conversation manageable (last 20 messages + system)
    const messagesToSend = [
      history[0], // system message
      ...history.slice(Math.max(1, history.length - 20))
    ];

    const aiResponse = await callAI(messagesToSend);

    // Add AI response to history
    history.push({ role: "assistant", content: aiResponse });

    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, val] of conversations.entries()) {
      if (val._timestamp && val._timestamp < oneHourAgo) {
        conversations.delete(key);
      }
    }
    history._timestamp = Date.now();

    res.json({
      reply: aiResponse,
      sessionId: sid
    });

  } catch (err) {
    console.error("Chat error:", err.message || err);

    // Detect rate limit errors and give user-friendly message
    const isRateLimit = err.message && err.message.toLowerCase().includes("rate limit");
    const errorMsg = isRateLimit
      ? "AI service is currently rate-limited. Please wait a minute and try again."
      : err.message || "Failed to process chat message";

    res.status(isRateLimit ? 429 : 500).json({ error: errorMsg });
  }
});

/**
 * DELETE /chat/:sessionId
 * Clear a conversation session
 */
router.delete("/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  res.json({ message: "Session cleared" });
});

module.exports = router;
