import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Clock, BarChart3, TrendingUp, Medal,
  Trash2, ChevronRight, Search, Filter, ArrowRight, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getLeaderboard } from '../services/api';
import './LeaderboardPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // gold, silver, bronze
const rankEmoji = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('valideator_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Load leaderboard
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      setLoading(true);
      getLeaderboard()
        .then(data => setLeaderboardData(data))
        .catch(err => {
          console.error('Leaderboard error:', err);
          // Fallback with localStorage data
          setLeaderboardData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('valideator_history');
      setHistory([]);
    }
  };

  const removeHistoryItem = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('valideator_history', JSON.stringify(updated));
  };

  const filteredHistory = history.filter(item =>
    item.idea?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Strong';
    if (score >= 40) return 'Average';
    return 'Needs Work';
  };

  return (
    <div className="lb" id="leaderboard-page">
      <Navbar />

      <div className="lb__bg-orbs">
        <div className="lb__orb lb__orb--1" />
        <div className="lb__orb lb__orb--2" />
      </div>

      <div className="lb__wrapper">
        <div className="container">

          {/* ── Header ─────────────────────────────────── */}
          <motion.div
            className="lb__header"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="section-badge">
              <Trophy size={14} /> Rankings & History
            </div>
            <h1 className="lb__title">
              Idea <span className="lb__title-gradient">Leaderboard</span>
            </h1>
            <p className="lb__subtitle">
              See the top-scoring startup ideas and track your validation history.
            </p>
          </motion.div>

          {/* ── Tab Switcher ──────────────────────────── */}
          <motion.div
            className="lb__tabs"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <button
              className={`lb__tab ${activeTab === 'leaderboard' ? 'lb__tab--active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
              id="tab-leaderboard"
            >
              <Trophy size={16} /> Leaderboard
            </button>
            <button
              className={`lb__tab ${activeTab === 'history' ? 'lb__tab--active' : ''}`}
              onClick={() => setActiveTab('history')}
              id="tab-history"
            >
              <Clock size={16} /> My History
            </button>
          </motion.div>

          {/* ══════════════════════════════════════════════
              LEADERBOARD TAB
              ══════════════════════════════════════════════ */}
          {activeTab === 'leaderboard' && (
            <motion.div
              className="lb__content"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              {loading ? (
                <div className="lb__loading">
                  <div className="lb__spinner" />
                  <span>Loading top ideas...</span>
                </div>
              ) : leaderboardData.length > 0 ? (
                <div className="lb__list">
                  {leaderboardData.map((item, i) => (
                    <motion.div
                      key={i}
                      className={`lb__item ${i < 3 ? `lb__item--top-${i + 1}` : ''}`}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      custom={i}
                    >
                      <div className="lb__item-rank">
                        {i < 3 ? (
                          <span className="lb__item-medal">{rankEmoji[i]}</span>
                        ) : (
                          <span className="lb__item-num">{i + 1}</span>
                        )}
                      </div>
                      <div className="lb__item-info">
                        <h3 className="lb__item-idea">{item.idea}</h3>
                        <div className="lb__item-meta">
                          <span className={`lb__item-feasibility lb__item-feasibility--${item.feasibility?.toLowerCase()}`}>
                            {item.feasibility}
                          </span>
                          {item.createdAt && (
                            <span className="lb__item-date">
                              {new Date(item.createdAt._seconds ? item.createdAt._seconds * 1000 : item.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="lb__item-score">
                        <span
                          className="lb__item-score-num"
                          style={{ color: getScoreColor(item.score) }}
                        >
                          {item.score}
                        </span>
                        <span className="lb__item-score-label">/ 100</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="lb__empty">
                  <Trophy size={48} />
                  <h3>No Ideas Yet</h3>
                  <p>Be the first to validate your idea and claim the top spot!</p>
                  <Link to="/explore" className="btn btn--primary btn--lg">
                    <Sparkles size={18} />
                    Validate an Idea
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              HISTORY TAB
              ══════════════════════════════════════════════ */}
          {activeTab === 'history' && (
            <motion.div
              className="lb__content"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              {/* Search + Controls */}
              <div className="lb__history-controls">
                <div className="lb__search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search your ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="history-search"
                  />
                </div>
                {history.length > 0 && (
                  <button
                    className="lb__clear-btn"
                    onClick={clearHistory}
                    id="clear-history-btn"
                  >
                    <Trash2 size={14} />
                    Clear All
                  </button>
                )}
              </div>

              {filteredHistory.length > 0 ? (
                <div className="lb__history-list">
                  {filteredHistory.map((item, i) => (
                    <motion.div
                      key={i}
                      className="lb__history-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="lb__history-left">
                        <div
                          className="lb__history-score-dot"
                          style={{ background: getScoreColor(item.score) }}
                        />
                        <div className="lb__history-info">
                          <h3 className="lb__history-idea">{item.idea}</h3>
                          <div className="lb__history-meta">
                            <span style={{ color: getScoreColor(item.score) }}>
                              Score: {item.score}/100 — {getScoreLabel(item.score)}
                            </span>
                            <span className="lb__history-sep">·</span>
                            <span>{item.feasibility} Feasibility</span>
                            {item.timestamp && (
                              <>
                                <span className="lb__history-sep">·</span>
                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="lb__history-remove"
                        onClick={() => removeHistoryItem(i)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="lb__empty">
                  <Clock size={48} />
                  <h3>{searchTerm ? 'No Matching Ideas' : 'No History Yet'}</h3>
                  <p>
                    {searchTerm
                      ? 'Try a different search term.'
                      : 'Your validated ideas will appear here. Go explore and analyze an idea!'
                    }
                  </p>
                  {!searchTerm && (
                    <Link to="/explore" className="btn btn--primary btn--lg">
                      <Sparkles size={18} />
                      Validate an Idea
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
