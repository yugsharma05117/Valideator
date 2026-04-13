import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import {
  ArrowLeft, DollarSign, Users, Swords, Shield,
  TrendingUp, AlertTriangle, Lightbulb, CheckCircle,
  XCircle, Target, Loader2, Flame, BarChart3,
  Sparkles, ChevronDown, ChevronUp, Skull
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getFailureAnalysis } from '../services/api';
import './ReportPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  const [failureData, setFailureData] = useState(null);
  const [failureLoading, setFailureLoading] = useState(false);
  const [expandedFailure, setExpandedFailure] = useState(null);

  useEffect(() => {
    if (!analysis) return;

    setFailureLoading(true);
    getFailureAnalysis(analysis.idea)
      .then(data => setFailureData(data))
      .catch(err => console.error('Failure analysis error:', err))
      .finally(() => setFailureLoading(false));
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="report" id="report-page">
        <Navbar />
        <div className="report__empty">
          <Lightbulb size={48} />
          <h2>No Analysis Yet</h2>
          <p>Go to the Explore page to analyze an idea first.</p>
          <Link to="/explore" className="btn btn--primary btn--lg">
            Go to Explore
          </Link>
        </div>
      </div>
    );
  }

  const scoreColor = analysis.score >= 70 ? '#22c55e' : analysis.score >= 40 ? '#eab308' : '#ef4444';

  const scoreData = {
    labels: ['Score', 'Remaining'],
    datasets: [{
      data: [analysis.score, 100 - analysis.score],
      backgroundColor: [scoreColor, '#f0f0f0'],
      borderWidth: 0,
      cutout: '78%'
    }]
  };

  const swotData = {
    labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    datasets: [{
      data: [
        analysis.swot?.strengths?.length || 0,
        analysis.swot?.weaknesses?.length || 0,
        analysis.swot?.opportunities?.length || 0,
        analysis.swot?.threats?.length || 0
      ],
      backgroundColor: ['#22c55e', '#ef4444', '#3b82f6', '#f97316'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="report" id="report-page">
      <Navbar />

      <div className="report__wrapper">
        <div className="container">
          {/* Back Button */}
          <motion.button
            className="report__back"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            id="back-button"
          >
            <ArrowLeft size={18} />
            Back to Chat
          </motion.button>

          {/* Header */}
          <motion.div
            className="report__header"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="report__title">
              <BarChart3 size={28} />
              Detailed Analysis Report
            </h1>
            <p className="report__idea">"{analysis.idea}"</p>
          </motion.div>

          {/* ── Score + Feasibility Row ─────────────────── */}
          <div className="report__top-row">
            <motion.div
              className="report__score-card"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <div className="report__score-chart">
                <Doughnut data={scoreData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } }
                }} />
                <div className="report__score-center">
                  <span className="report__score-num" style={{ color: scoreColor }}>{analysis.score}</span>
                  <span className="report__score-label">/ 100</span>
                </div>
              </div>
              <div className="report__score-info">
                <h3>Overall Score</h3>
                <span
                  className={`feasibility-badge feasibility-badge--${analysis.feasibility?.toLowerCase()}`}
                >
                  {analysis.feasibility} Feasibility
                </span>
                <p className="report__score-desc">
                  {analysis.score >= 70
                    ? 'Strong idea with high potential!'
                    : analysis.score >= 40
                    ? 'Promising but needs refinement.'
                    : 'Significant challenges ahead.'}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="report__swot-chart-card"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              <h3>SWOT Distribution</h3>
              <div className="report__swot-pie">
                <Pie data={swotData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 16, usePointStyle: true, font: { size: 12, family: 'Inter' } }
                    }
                  }
                }} />
              </div>
            </motion.div>
          </div>

          {/* ── Score Breakdown ────────────────────────── */}
          {analysis.score_breakdown && (
            <motion.div
              className="report__breakdown-section"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="report__section-title">
                <BarChart3 size={20} /> Score Breakdown (5 Criteria)
              </h2>
              <div className="report__breakdown-grid">
                {[
                  { label: 'Market Demand', value: analysis.score_breakdown.market_demand, desc: 'Real proven demand for this solution' },
                  { label: 'Uniqueness', value: analysis.score_breakdown.uniqueness, desc: 'Differentiation from existing solutions' },
                  { label: 'Technical Feasibility', value: analysis.score_breakdown.feasibility, desc: 'How realistically this can be built' },
                  { label: 'Scalability', value: analysis.score_breakdown.scalability, desc: 'Potential to grow and serve millions' },
                  { label: 'Revenue Potential', value: analysis.score_breakdown.revenue_potential, desc: 'Ability to generate sustainable revenue' }
                ].map((item, i) => (
                  <div key={item.label} className="report__breakdown-item">
                    <div className="report__breakdown-header">
                      <span className="report__breakdown-label">{item.label}</span>
                      <span className="report__breakdown-score" style={{
                        color: item.value >= 14 ? '#22c55e' : item.value >= 8 ? '#eab308' : '#ef4444'
                      }}>
                        {item.value}/20
                      </span>
                    </div>
                    <div className="report__breakdown-bar-bg">
                      <div
                        className="report__breakdown-bar-fill"
                        style={{
                          width: `${(item.value / 20) * 100}%`,
                          background: item.value >= 14 ? '#22c55e' : item.value >= 8 ? '#eab308' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="report__breakdown-desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Perspectives ───────────────────────────── */}
          <motion.h2
            className="report__section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Sparkles size={20} /> Multi-Perspective Analysis
          </motion.h2>

          <div className="report__perspectives">
            {[
              { key: 'investor_view', icon: <DollarSign size={22} />, title: 'Investor Perspective', color: 'purple', data: analysis.investor_view },
              { key: 'user_view', icon: <Users size={22} />, title: 'User Perspective', color: 'teal', data: analysis.user_view },
              { key: 'competitor_view', icon: <Swords size={22} />, title: 'Competitor Perspective', color: 'warm', data: analysis.competitor_view }
            ].map((p, i) => (
              <motion.div
                key={p.key}
                className={`perspective-card perspective-card--${p.color}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className={`perspective-card__icon perspective-card__icon--${p.color}`}>
                  {p.icon}
                </div>
                <h3 className="perspective-card__title">{p.title}</h3>
                <p className="perspective-card__text">{p.data}</p>
              </motion.div>
            ))}
          </div>

          {/* ── SWOT Detailed ──────────────────────────── */}
          <motion.h2
            className="report__section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Shield size={20} /> SWOT Analysis
          </motion.h2>

          <div className="report__swot-grid">
            {[
              { key: 'strengths', icon: <CheckCircle size={18} />, title: 'Strengths', items: analysis.swot?.strengths, color: 'green' },
              { key: 'weaknesses', icon: <XCircle size={18} />, title: 'Weaknesses', items: analysis.swot?.weaknesses, color: 'red' },
              { key: 'opportunities', icon: <TrendingUp size={18} />, title: 'Opportunities', items: analysis.swot?.opportunities, color: 'blue' },
              { key: 'threats', icon: <AlertTriangle size={18} />, title: 'Threats', items: analysis.swot?.threats, color: 'orange' }
            ].map((s, i) => (
              <motion.div
                key={s.key}
                className={`swot-card swot-card--${s.color}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <h3 className="swot-card__title">
                  {s.icon} {s.title}
                </h3>
                <ul className="swot-card__list">
                  {(s.items || []).map((item, j) => (
                    <li key={j} className="swot-card__item">{item}</li>
                  ))}
                  {(!s.items || s.items.length === 0) && (
                    <li className="swot-card__item swot-card__item--empty">No items identified</li>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* ── Risks ──────────────────────────────────── */}
          <motion.h2
            className="report__section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <AlertTriangle size={20} /> Identified Risks
          </motion.h2>

          <motion.div
            className="report__risks"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {(analysis.risks || []).map((risk, i) => (
              <div key={i} className="risk-item">
                <div className="risk-item__dot" />
                <span>{risk}</span>
              </div>
            ))}
          </motion.div>

          {/* ── Suggestions ────────────────────────────── */}
          <motion.h2
            className="report__section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Lightbulb size={20} /> Improvement Suggestions
          </motion.h2>

          <motion.div
            className="report__suggestions"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {(analysis.suggestions || []).map((sug, i) => (
              <div key={i} className="suggestion-item">
                <div className="suggestion-item__num">{String(i + 1).padStart(2, '0')}</div>
                <span>{sug}</span>
              </div>
            ))}
          </motion.div>

          {/* ══════════════════════════════════════════════
              WHY IDEAS FAIL - Failure Analysis Section
              ══════════════════════════════════════════════ */}
          <motion.div
            className="report__failure-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="report__section-title report__section-title--danger">
              <Skull size={20} /> Why Your Idea Might Fail
            </h2>
            <p className="report__failure-intro">
              Based on data from thousands of failed startups, here's how your idea maps to common failure patterns.
            </p>

            {failureLoading ? (
              <div className="report__failure-loading">
                <Loader2 size={24} className="spin" />
                <span>Analyzing failure patterns...</span>
              </div>
            ) : failureData ? (
              <div className="report__failure-content">
                {/* Risk Overview */}
                <div className="failure-overview">
                  <div className="failure-overview__risk">
                    <span className="failure-overview__label">Overall Failure Risk</span>
                    <span className={`failure-overview__badge failure-overview__badge--${failureData.overall_failure_risk?.toLowerCase().replace(' ', '-')}`}>
                      {failureData.overall_failure_risk}
                    </span>
                  </div>
                  <div className="failure-overview__score">
                    <span className="failure-overview__label">Risk Score</span>
                    <span className="failure-overview__num">{failureData.risk_score}/100</span>
                  </div>
                </div>

                {/* Harsh Truth */}
                {failureData.harsh_truth && (
                  <div className="failure-harsh">
                    <Flame size={18} />
                    <p>{failureData.harsh_truth}</p>
                  </div>
                )}

                {/* Failure Reasons */}
                <div className="failure-reasons">
                  {(failureData.top_failure_reasons || []).map((reason, i) => (
                    <div
                      key={i}
                      className={`failure-reason ${expandedFailure === i ? 'failure-reason--expanded' : ''}`}
                    >
                      <button
                        className="failure-reason__header"
                        onClick={() => setExpandedFailure(expandedFailure === i ? null : i)}
                      >
                        <div className="failure-reason__left">
                          <span className={`failure-reason__likelihood failure-reason__likelihood--${reason.likelihood?.toLowerCase()}`}>
                            {reason.likelihood}
                          </span>
                          <span className="failure-reason__category">{reason.category}</span>
                          <span className="failure-reason__pct">{reason.percentage_of_startups}% of startups</span>
                        </div>
                        {expandedFailure === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {expandedFailure === i && (
                        <motion.div
                          className="failure-reason__body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="failure-reason__section">
                            <h4>Why this applies to your idea:</h4>
                            <p>{reason.why_applies}</p>
                          </div>
                          <div className="failure-reason__section">
                            <h4>Warning Signals:</h4>
                            <ul>
                              {(reason.warning_signals || []).map((s, j) => (
                                <li key={j}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="failure-reason__section failure-reason__section--success">
                            <h4>How to Avoid:</h4>
                            <p>{reason.how_to_avoid}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Historical Failures */}
                {failureData.historical_similar_failures?.length > 0 && (
                  <>
                    <h3 className="failure-sub-title">Similar Companies That Failed</h3>
                    <div className="failure-history">
                      {failureData.historical_similar_failures.map((h, i) => (
                        <div key={i} className="failure-history__item">
                          <span className="failure-history__company">{h.company}</span>
                          <p className="failure-history__what">{h.what_happened}</p>
                          <p className="failure-history__lesson">💡 {h.lesson}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Survival Tips */}
                {failureData.survival_tips?.length > 0 && (
                  <>
                    <h3 className="failure-sub-title">🛡️ Survival Tips</h3>
                    <div className="survival-tips">
                      {failureData.survival_tips.map((tip, i) => (
                        <div key={i} className="survival-tip">
                          <Target size={16} />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="report__failure-error">
                <p>Unable to load failure analysis. Try refreshing the page.</p>
              </div>
            )}
          </motion.div>

          {/* Back to chat */}
          <motion.div
            className="report__footer-actions"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link to="/explore" className="btn btn--primary btn--lg" id="report-back-explore">
              <ArrowLeft size={18} />
              Analyze Another Idea
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
