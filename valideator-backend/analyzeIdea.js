const Groq = require("groq-sdk");
const fs = require("fs");

// load dataset
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function analyzeIdea(userIdea) {
  const examples = data.slice(0, 3);

  let exampleText = "";

  examples.forEach((ex, i) => {
    exampleText += `
Example ${i + 1}:
Idea: ${ex.idea}
Analysis: ${ex.analysis}
`;
  });

  const prompt = `
You are an AI startup validator.

${exampleText}

Now analyze this:

Idea: ${userIdea}

Give output in this format:
Risk:
Reasons:
Advice:
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: prompt }
    ]
  });

  return res.choices[0].message.content;
}

module.exports = { analyzeIdea };