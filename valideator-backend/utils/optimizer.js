/**
 * CarbonGPT Prompt Optimizer
 * ===========================
 * Calls the Python optimizer microservice for advanced optimization.
 * Supports two backends:
 *   1. Flask service (port 5001) — primary
 *   2. FastAPI service (port 8000) — secondary
 * Falls back to the built-in JS optimizer if both are unreachable.
 */

const FLASK_OPTIMIZER_URL = process.env.FLASK_OPTIMIZER_URL || "http://localhost:5001";
const FASTAPI_OPTIMIZER_URL = process.env.FASTAPI_OPTIMIZER_URL || "http://localhost:8000";

// Legacy env var support
const PYTHON_OPTIMIZER_URL = process.env.PYTHON_OPTIMIZER_URL || FLASK_OPTIMIZER_URL;

// ─── Built-in JS fallback optimizer ────────────────────────────────
const fillerWords = [
  "please", "kindly", "just", "actually", "basically",
  "i think", "can you", "could you", "would you", "so yeah"
];

function jsFallbackOptimize(text) {
  let cleaned = text.toLowerCase();

  fillerWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleaned = cleaned.replace(regex, "");
  });

  // remove extra spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned;
}

// ─── Generic Python optimizer caller ───────────────────────────────

/**
 * Call a Python optimizer service at the given baseUrl.
 * @param {string} baseUrl - The base URL of the optimizer service
 * @param {string} text - The prompt text to optimize
 * @param {boolean} aggressive - Whether to use aggressive optimization
 * @returns {Promise<{optimized: string, stats: object|null, source: string}|null>}
 */
async function callOptimizerService(baseUrl, text, aggressive = false) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch(`${baseUrl}/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: text,
        aggressive: aggressive,
        remove_asides: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Optimizer at ${baseUrl} returned HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Unknown error from optimizer");
    }

    return {
      optimized: data.optimized,
      stats: {
        originalWords: data.original_word_count,
        optimizedWords: data.optimized_word_count,
        reductionPercent: data.reduction_percentage,
        processingTimeMs: data.processing_time_ms
      },
      source: baseUrl.includes("8000") ? "fastapi" : "python"
    };

  } catch (err) {
    return null;
  }
}

// ─── Python microservice optimizer (primary — Flask on 5001) ───────

/**
 * Call the Flask Python optimizer microservice (port 5001).
 */
async function callPythonOptimizer(text, aggressive = false) {
  const result = await callOptimizerService(PYTHON_OPTIMIZER_URL, text, aggressive);
  if (!result) {
    console.warn(`⚠️  Flask optimizer unavailable, trying FastAPI...`);
  }
  return result;
}

// ─── FastAPI optimizer (secondary — port 8000) ─────────────────────

/**
 * Call the FastAPI optimizer microservice (port 8000).
 */
async function callFastAPIOptimizer(text, aggressive = false) {
  const result = await callOptimizerService(FASTAPI_OPTIMIZER_URL, text, aggressive);
  if (!result) {
    console.warn(`⚠️  FastAPI optimizer also unavailable, using JS fallback`);
  }
  return result;
}

// ─── Analyzer ──────────────────────────────────────────────────────

/**
 * Call the Python analyzer for detailed prompt analysis.
 * Tries Flask first, then FastAPI.
 * @param {string} text - The prompt text to analyze
 * @returns {Promise<object|null>} Full analysis data or null if both are unavailable
 */
async function callPythonAnalyzer(text) {
  // Try Flask first
  const flaskResult = await _callAnalyzerService(PYTHON_OPTIMIZER_URL, text);
  if (flaskResult) return flaskResult;

  // Try FastAPI as backup
  const fastapiResult = await _callAnalyzerService(FASTAPI_OPTIMIZER_URL, text);
  if (fastapiResult) return fastapiResult;

  console.warn(`⚠️  No Python analyzer available`);
  return null;
}

/**
 * Internal: call an analyzer endpoint at the given base URL.
 */
async function _callAnalyzerService(baseUrl, text) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${baseUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text, remove_asides: true }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Analyzer at ${baseUrl} returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.success ? data.data : null;

  } catch (err) {
    return null;
  }
}

// ─── Health checks ─────────────────────────────────────────────────

/**
 * Check if the Flask Python optimizer microservice is available.
 * @returns {Promise<boolean>}
 */
async function isPythonOptimizerAvailable() {
  return _checkHealth(PYTHON_OPTIMIZER_URL);
}

/**
 * Check if the FastAPI optimizer microservice is available.
 * @returns {Promise<boolean>}
 */
async function isFastAPIOptimizerAvailable() {
  return _checkHealth(FASTAPI_OPTIMIZER_URL);
}

/**
 * Internal: check health at the given base URL.
 */
async function _checkHealth(baseUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${baseUrl}/health`, {
      signal: controller.signal
    });

    clearTimeout(timeout);
    return res.ok;

  } catch {
    return false;
  }
}

// ─── Main exports ──────────────────────────────────────────────────

/**
 * Synchronous fallback for legacy code.
 */
function optimizePrompt(text) {
  return jsFallbackOptimize(text);
}

/**
 * Async version: tries Flask → FastAPI → JS fallback.
 * 
 * @param {string} text - The prompt to optimize
 * @param {boolean} aggressive - Whether to use aggressive mode
 * @returns {Promise<{optimized: string, stats: object|null, source: string}>}
 */
async function optimizePromptAsync(text, aggressive = false) {
  // 1. Try Flask optimizer (port 5001)
  const flaskResult = await callPythonOptimizer(text, aggressive);
  if (flaskResult) return flaskResult;

  // 2. Try FastAPI optimizer (port 8000)
  const fastapiResult = await callFastAPIOptimizer(text, aggressive);
  if (fastapiResult) return fastapiResult;

  // 3. Fallback to JS optimizer
  const optimized = jsFallbackOptimize(text);
  const originalWords = text.split(/\s+/).filter(w => w).length;
  const optimizedWords = optimized.split(/\s+/).filter(w => w).length;
  const reduction = originalWords > 0 ? ((originalWords - optimizedWords) / originalWords * 100) : 0;

  return {
    optimized,
    stats: {
      originalWords,
      optimizedWords,
      reductionPercent: Math.round(reduction * 100) / 100,
      processingTimeMs: 0
    },
    source: "js-fallback"
  };
}

module.exports = {
  optimizePrompt,
  optimizePromptAsync,
  callPythonOptimizer,
  callFastAPIOptimizer,
  callPythonAnalyzer,
  isPythonOptimizerAvailable,
  isFastAPIOptimizerAvailable,
  jsFallbackOptimize
};