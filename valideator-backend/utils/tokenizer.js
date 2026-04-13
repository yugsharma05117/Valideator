const { encoding_for_model } = require("tiktoken");

// choose a fast + commonly used model encoding
const encoder = encoding_for_model("gpt-4o-mini");

function countTokens(text) {
  if (!text) return 0;

  try {
    const tokens = encoder.encode(text);
    return tokens.length;
  } catch (err) {
    console.error("Tokenization error:", err);
    return 0;
  }
}

module.exports = { countTokens };