import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Send, Loader2, Lightbulb, ChevronRight, X,
  TrendingUp, AlertTriangle, Sparkles, Flame,
  ArrowLeft, BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { analyzeIdea } from '../services/api';
import './ExplorePage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExplorePage() {
  const [idea, setIdea] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [harshMode, setHarshMode] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save to localStorage history
  const saveToHistory = (ideaText, analysis) => {
    try {
      const saved = localStorage.getItem('valideator_history');
      const history = saved ? JSON.parse(saved) : [];
      history.unshift({
        idea: ideaText,
        score: analysis.score,
        feasibility: analysis.feasibility,
        timestamp: new Date().toISOString()
      });
      // Keep last 50
      localStorage.setItem('valideator_history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;

    const userMessage = idea.trim();
    setIdea('');

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const data = await analyzeIdea(userMessage, harshMode);

      // Check if the input was rejected (invalid idea)
      if (data.message) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `⚠️ ${data.message}`,
          error: true
        }]);
        setLoading(false);
        return;
      }

      const analysis = data.analysis;

      setCurrentAnalysis({ ...analysis, idea: userMessage });
      setSidebarOpen(true);

      // Save to history
      saveToHistory(userMessage, analysis);

      // Determine the emoji/status based on score
      let statusEmoji = '🟡';
      let statusText = 'Average';
      if (analysis.score >= 70) { statusEmoji = '🟢'; statusText = 'Strong'; }
      else if (analysis.score < 40) { statusEmoji = '🔴'; statusText = 'Needs Work'; }

      // Build score breakdown text
      let breakdownText = '';
      if (analysis.score_breakdown) {
        const sb = analysis.score_breakdown;
        breakdownText = `\n\n📊 **Score Breakdown:**\n• Market Demand: ${sb.market_demand}/20\n• Uniqueness: ${sb.uniqueness}/20\n• Feasibility: ${sb.feasibility}/20\n• Scalability: ${sb.scalability}/20\n• Revenue: ${sb.revenue_potential}/20`;
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        text: `${statusEmoji} **Score: ${analysis.score}/100** — ${statusText}\n\n📊 Feasibility: **${analysis.feasibility}**${breakdownText}\n\n💡 _Check the sidebar for a visual breakdown, or click "Know More" for a detailed report._`,
        analysis
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `❌ Oops! Something went wrong: ${err.message}. Please try again.`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!currentAnalysis) return null;
    const score = currentAnalysis.score || 50;
    return {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [
          score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444',
          '#f0f0f0'
        ],
        borderWidth: 0,
        cutout: '75%'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  const goToReport = () => {
    navigate('/report', { state: { analysis: currentAnalysis } });
  };

  const placeholders = [
    'An AI tool that helps people find the best restaurants...',
    'A marketplace for freelance graphic designers...',
    'A subscription box for sustainable office supplies...',
    'An app that matches mentors with startup founders...'
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="explore" id="explore-page">
      <Navbar />

      <div className={`explore__layout ${sidebarOpen ? 'explore__layout--sidebar-open' : ''}`}>
        {/* ── Main Chat Area ──────────────────────────── */}
        <div className="explore__main">
          {/* Chat Messages */}
          <div className="explore__chat" id="chat-area">
            {messages.length === 0 ? (
              <div className="explore__empty">
                <motion.div
                  className="explore__empty-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Lightbulb size={48} />
                </motion.div>
                <h2 className="explore__empty-title">What's Your Big Idea?</h2>
                <p className="explore__empty-desc">
                  Describe your startup idea below and let AI analyze it from
                  investor, user, and competitor perspectives.
                </p>
                <div className="explore__suggestions">
                  {[
                    'AI-powered personal finance advisor',
                    'Peer-to-peer skill learning platform',
                    'Eco-friendly delivery service for local businesses'
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      className="explore__suggestion"
                      onClick={() => { setIdea(suggestion); inputRef.current?.focus(); }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      id={`suggestion-${i}`}
                    >
                      <Sparkles size={14} />
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="explore__messages">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`message message--${msg.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message__bubble">
                      {msg.type === 'bot' ? (
                        <div className="message__content" dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/_(.*?)_/g, '<em>$1</em>')
                            .replace(/\n/g, '<br/>')
                        }} />
                      ) : (
                        <div className="message__content">{msg.text}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    className="message message--bot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="message__bubble message__bubble--loading">
                      <Loader2 size={18} className="spin" />
                      <span>Analyzing your idea across 5 criteria...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form className="explore__input-area" onSubmit={handleSubmit} id="idea-input-form">
            <div className="explore__input-wrapper">
              <div className="explore__harsh-toggle">
                <button
                  type="button"
                  className={`harsh-btn ${harshMode ? 'harsh-btn--active' : ''}`}
                  onClick={() => setHarshMode(!harshMode)}
                  title={harshMode ? 'Harsh Truth Mode: ON' : 'Harsh Truth Mode: OFF'}
                  id="harsh-mode-toggle"
                >
                  <Flame size={16} />
                  {harshMode ? 'Harsh' : 'Normal'}
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                className="explore__input"
                placeholder={placeholders[placeholderIdx]}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
                id="idea-input"
              />
              <button
                type="submit"
                className="explore__send-btn"
                disabled={!idea.trim() || loading}
                id="send-idea-btn"
              >
                {loading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>
        </div>

        {/* ── Sidebar ─────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && currentAnalysis && (
            <motion.aside
              className="explore__sidebar"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              id="analysis-sidebar"
            >
              <div className="sidebar__header">
                <h3 className="sidebar__title">
                  <BarChart3 size={18} />
                  Quick Analysis
                </h3>
                <button
                  className="sidebar__close"
                  onClick={() => setSidebarOpen(false)}
                  id="close-sidebar"
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sidebar__content">
                {/* Pie Chart */}
                <div className="sidebar__chart-container">
                  <div className="sidebar__chart">
                    <Doughnut data={getChartData()} options={chartOptions} />
                    <div className="sidebar__chart-center">
                      <span className="sidebar__chart-score">{currentAnalysis.score}</span>
                      <span className="sidebar__chart-label">out of 100</span>
                    </div>
                  </div>
                  <div className="sidebar__feasibility">
                    <span className={`feasibility-badge feasibility-badge--${currentAnalysis.feasibility?.toLowerCase()}`}>
                      {currentAnalysis.feasibility} Feasibility
                    </span>
                  </div>
                </div>

                {/* Score Breakdown */}
                {currentAnalysis.score_breakdown && (
                  <div className="sidebar__breakdown">
                    <h4 className="sidebar__breakdown-title">Score Breakdown</h4>
                    {[
                      { label: 'Market Demand', value: currentAnalysis.score_breakdown.market_demand },
                      { label: 'Uniqueness', value: currentAnalysis.score_breakdown.uniqueness },
                      { label: 'Feasibility', value: currentAnalysis.score_breakdown.feasibility },
                      { label: 'Scalability', value: currentAnalysis.score_breakdown.scalability },
                      { label: 'Revenue', value: currentAnalysis.score_breakdown.revenue_potential }
                    ].map((item) => (
                      <div key={item.label} className="sidebar__bar-item">
                        <div className="sidebar__bar-header">
                          <span className="sidebar__bar-label">{item.label}</span>
                          <span className="sidebar__bar-value">{item.value}/20</span>
                        </div>
                        <div className="sidebar__bar-bg">
                          <div
                            className="sidebar__bar-fill"
                            style={{
                              width: `${(item.value / 20) * 100}%`,
                              background: item.value >= 14 ? '#22c55e' : item.value >= 8 ? '#eab308' : '#ef4444'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Metrics */}
                <div className="sidebar__metrics">
                  <div className="sidebar__metric">
                    <TrendingUp size={16} />
                    <div>
                      <span className="sidebar__metric-label">Investor View</span>
                      <span className="sidebar__metric-value">
                        {currentAnalysis.investor_view?.substring(0, 80)}...
                      </span>
                    </div>
                  </div>
                  <div className="sidebar__metric">
                    <AlertTriangle size={16} />
                    <div>
                      <span className="sidebar__metric-label">Top Risk</span>
                      <span className="sidebar__metric-value">
                        {currentAnalysis.risks?.[0] || 'No major risks identified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Strengths / Weaknesses */}
                <div className="sidebar__swot-quick">
                  <div className="sidebar__swot-item sidebar__swot-item--strength">
                    <span className="sidebar__swot-label">💪 Top Strength</span>
                    <span className="sidebar__swot-value">
                      {currentAnalysis.swot?.strengths?.[0] || 'N/A'}
                    </span>
                  </div>
                  <div className="sidebar__swot-item sidebar__swot-item--weakness">
                    <span className="sidebar__swot-label">⚠️ Top Weakness</span>
                    <span className="sidebar__swot-value">
                      {currentAnalysis.swot?.weaknesses?.[0] || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Know More Button */}
                <button
                  className="sidebar__know-more"
                  onClick={goToReport}
                  id="know-more-btn"
                >
                  View Full Report
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
