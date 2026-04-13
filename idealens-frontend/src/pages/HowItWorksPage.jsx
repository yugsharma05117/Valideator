import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb, Zap, Target, BarChart3, Shield, ArrowRight,
  CheckCircle, MessageSquare, TrendingUp, Eye, DollarSign,
  Users, Swords, Sparkles, Brain, FileText, Trophy, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './HowItWorksPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function HowItWorksPage() {
  return (
    <div className="hiw" id="how-it-works-page">
      <Navbar />

      {/* Decorative */}
      <div className="hiw__bg-orbs">
        <div className="hiw__orb hiw__orb--1" />
        <div className="hiw__orb hiw__orb--2" />
      </div>

      <div className="hiw__wrapper">
        <div className="container">

          {/* ── Header ───────────────────────────────────── */}
          <motion.div
            className="hiw__header"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="section-badge">
              <CheckCircle size={14} /> How Valideator Works
            </div>
            <h1 className="hiw__title">
              From Idea to <span className="hiw__title-gradient">Insights</span>
            </h1>
            <p className="hiw__subtitle">
              Understanding the complete journey from typing your startup idea 
              to receiving actionable, AI-powered validation insights.
            </p>
          </motion.div>

          {/* ══════════════════════════════════════════════
              STEP-BY-STEP PROCESS
              ══════════════════════════════════════════════ */}
          <section className="hiw__steps-section">
            <motion.h2
              className="hiw__section-title"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              The 5-Step Process
            </motion.h2>

            <div className="hiw__steps-timeline">
              {[
                {
                  num: '01',
                  icon: <Lightbulb size={28} />,
                  title: 'Describe Your Idea',
                  desc: 'Type your startup idea in plain, everyday language. No business jargon or technical knowledge required — just describe what you want to build, who it\'s for, and the problem it solves.',
                  example: '"An AI-powered app that matches local farmers with restaurants that need fresh, organic produce delivered daily."',
                  color: 'purple'
                },
                {
                  num: '02',
                  icon: <Shield size={28} />,
                  title: 'Smart Validation',
                  desc: 'Our system first validates that your input is a genuine startup idea — not a random question, greeting, or code request. Only real business ideas proceed to analysis, ensuring quality and accuracy.',
                  example: '✅ "A subscription box for eco-friendly office supplies" → Passes\n❌ "Hello how are you" → Rejected (not an idea)',
                  color: 'teal'
                },
                {
                  num: '03',
                  icon: <Zap size={28} />,
                  title: 'AI Analyzes from 3 Perspectives',
                  desc: 'Advanced AI simulates three critical viewpoints — investor (ROI, scalability), user (demand, usability), and competitor (threats, differentiation). Each perspective adds a unique analytical dimension.',
                  example: '💰 Investor: "Strong ROI potential, TAM of $2.3B"\n👥 User: "Solves a clear pain point"\n⚔️ Competitor: "Low barriers to entry"',
                  color: 'warm'
                },
                {
                  num: '04',
                  icon: <BarChart3 size={28} />,
                  title: '5-Criteria Scoring',
                  desc: 'Your idea is scored on 5 transparent criteria, each worth 0–20 points. The total (0–100) gives you a clear, defensible feasibility score backed by specific reasoning.',
                  example: 'Market Demand: 16/20\nUniqueness: 12/20\nFeasibility: 18/20\nScalability: 14/20\nRevenue: 15/20\nTotal: 75/100',
                  color: 'rose'
                },
                {
                  num: '05',
                  icon: <FileText size={28} />,
                  title: 'Get Your Full Report',
                  desc: 'Receive a comprehensive report with SWOT analysis, identified risks, improvement suggestions, failure pattern matching, and actionable next steps — all in a visually rich, easy-to-understand format.',
                  example: '📊 Score + Chart → 💪 SWOT → ⚠️ Risks → 💡 Suggestions → 💀 Failure Patterns',
                  color: 'purple'
                }
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  className={`hiw__step hiw__step--${step.color}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="hiw__step-connector">
                    <div className={`hiw__step-num hiw__step-num--${step.color}`}>{step.num}</div>
                    {i < 4 && <div className="hiw__step-line" />}
                  </div>
                  <div className="hiw__step-content">
                    <div className={`hiw__step-icon hiw__step-icon--${step.color}`}>
                      {step.icon}
                    </div>
                    <h3 className="hiw__step-title">{step.title}</h3>
                    <p className="hiw__step-desc">{step.desc}</p>
                    <div className="hiw__step-example">
                      <span className="hiw__step-example-label">Example:</span>
                      <pre className="hiw__step-example-text">{step.example}</pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              SCORING CRITERIA EXPLAINED
              ══════════════════════════════════════════════ */}
          <motion.section
            className="hiw__scoring"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2 className="hiw__section-title">
              <BarChart3 size={22} /> How We Score Your Idea
            </h2>
            <p className="hiw__scoring-intro">
              Every idea is scored using 5 transparent criteria, each worth 0–20 points. 
              Here's exactly what we evaluate:
            </p>

            <div className="hiw__criteria-grid">
              {[
                {
                  icon: <TrendingUp size={22} />,
                  title: 'Market Demand',
                  range: '0–20 pts',
                  desc: 'Is there real, proven demand? Is the target market large enough? Are people actively looking for this solution?',
                  tiers: ['0–5: No clear demand', '6–10: Some demand, unproven', '11–15: Growing demand with evidence', '16–20: Massive, validated market'],
                  color: 'purple'
                },
                {
                  icon: <Sparkles size={22} />,
                  title: 'Uniqueness',
                  range: '0–20 pts',
                  desc: 'How different is this from existing solutions? What\'s the competitive moat? Is there a first-mover advantage?',
                  tiers: ['0–5: Many identical solutions exist', '6–10: Minor differences from competitors', '11–15: Notable differentiation', '16–20: Truly innovative approach'],
                  color: 'teal'
                },
                {
                  icon: <CheckCircle size={22} />,
                  title: 'Technical Feasibility',
                  range: '0–20 pts',
                  desc: 'Can this realistically be built? What resources and tech stack would it require? Is the complexity manageable?',
                  tiers: ['0–5: Requires breakthrough tech', '6–10: Challenging, major resources needed', '11–15: Feasible with standard tech', '16–20: Easy to build with existing tools'],
                  color: 'warm'
                },
                {
                  icon: <Target size={22} />,
                  title: 'Scalability',
                  range: '0–20 pts',
                  desc: 'Can this grow to serve millions? Are there network effects? Is the business model inherently scalable?',
                  tiers: ['0–5: Very limited scaling', '6–10: Can scale with challenges', '11–15: Good scaling potential', '16–20: Highly scalable, network effects'],
                  color: 'rose'
                },
                {
                  icon: <DollarSign size={22} />,
                  title: 'Revenue Potential',
                  range: '0–20 pts',
                  desc: 'Can this make money? Are customers willing to pay? Are there multiple revenue streams possible?',
                  tiers: ['0–5: No clear revenue model', '6–10: Possible but slim margins', '11–15: Strong model, decent margins', '16–20: Multiple streams, high willingness to pay'],
                  color: 'purple'
                }
              ].map((criteria, i) => (
                <motion.div
                  key={criteria.title}
                  className={`hiw__criteria-card hiw__criteria-card--${criteria.color}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={scaleIn}
                  custom={i}
                >
                  <div className={`hiw__criteria-icon hiw__criteria-icon--${criteria.color}`}>
                    {criteria.icon}
                  </div>
                  <div className="hiw__criteria-header">
                    <h3>{criteria.title}</h3>
                    <span className="hiw__criteria-range">{criteria.range}</span>
                  </div>
                  <p className="hiw__criteria-desc">{criteria.desc}</p>
                  <ul className="hiw__criteria-tiers">
                    {criteria.tiers.map((tier, j) => (
                      <li key={j}>{tier}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════
              BEYOND SCORING — EXTRA FEATURES
              ══════════════════════════════════════════════ */}
          <motion.section
            className="hiw__extra"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2 className="hiw__section-title">
              <Sparkles size={22} /> Beyond the Score
            </h2>

            <div className="hiw__extra-grid">
              {[
                {
                  icon: <Brain size={24} />,
                  title: 'AI Brainstorming',
                  desc: 'Don\'t just validate — brainstorm! Chat freely with our AI to refine your idea, explore business models, discuss go-to-market strategies, and get creative suggestions.'
                },
                {
                  icon: <Eye size={24} />,
                  title: 'SWOT Analysis',
                  desc: 'Get a structured breakdown of your Strengths, Weaknesses, Opportunities, and Threats — the same framework used by Fortune 500 companies for strategic planning.'
                },
                {
                  icon: <Trophy size={24} />,
                  title: 'Leaderboard & History',
                  desc: 'Track all your validated ideas in history, compare scores over time, and see how top-scoring ideas on the leaderboard are structured.'
                },
                {
                  icon: <MessageSquare size={24} />,
                  title: 'Failure Pattern Matching',
                  desc: 'Your idea is cross-referenced against a curated database of real startup failures to proactively identify risks you might not have considered.'
                }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="hiw__extra-card"
                  variants={scaleIn}
                  custom={i}
                >
                  <div className="hiw__extra-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── CTA ──────────────────────────────────────── */}
          <motion.section
            className="hiw__cta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <div className="hiw__cta-card">
              <h2>Ready to Try It?</h2>
              <p>Validate your startup idea in under 30 seconds.</p>
              <div className="hiw__cta-buttons">
                <Link to="/explore" className="btn btn--primary btn--lg" id="hiw-explore-btn">
                  <Zap size={18} />
                  Start Analyzing
                  <ArrowRight size={18} />
                </Link>
                <Link to="/brainstorm" className="btn btn--outline btn--lg" id="hiw-brainstorm-btn">
                  <Brain size={18} />
                  Brainstorm with AI
                </Link>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
