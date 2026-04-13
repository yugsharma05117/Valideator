const API_BASE = 'http://localhost:5000';

/**
 * Analyze a startup idea — main analysis.
 * POST /analyze
 */
export async function analyzeIdea(idea, harshMode = false) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, harshMode })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to analyze idea');
  }

  return res.json();
}

/**
 * Get failure analysis for a startup idea.
 * POST /failure-analysis
 */
export async function getFailureAnalysis(idea) {
  const res = await fetch(`${API_BASE}/failure-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to get failure analysis');
  }

  return res.json();
}

/**
 * Get leaderboard data.
 * GET /leaderboard
 */
export async function getLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json();
}

/**
 * Send a chat message for brainstorming.
 * POST /chat
 */
export async function sendChatMessage(message, sessionId = null, context = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, context })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to send chat message');
  }

  return res.json();
}

/**
 * Clear a brainstorm session.
 * DELETE /chat/:sessionId
 */
export async function clearChatSession(sessionId) {
  const res = await fetch(`${API_BASE}/chat/${sessionId}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Failed to clear session');
  }

  return res.json();
}
