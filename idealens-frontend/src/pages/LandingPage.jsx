import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb, ArrowRight, Target, Users, TrendingUp,
  Shield, Zap, BarChart3, Eye, Swords, DollarSign,
  CheckCircle, ChevronRight, Star, Sparkles, Trophy
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function LandingPage() {
  return (
    <div className="landing" id="landing-page">
      <Navbar />

      {/* ── Decorative Background ─────────────────────── */}
      <div className="landing__bg-orbs">
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />
        <div className="landing__orb landing__orb--3" />
      </div>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section className="hero" id="hero-section">
        <div className="container hero__inner">
          <motion.div
            className="hero__content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div className="hero__badge" variants={fadeUp} custom={0}>
              <Sparkles size={14} />
              AI-Powered Startup Validation
            </motion.div>

            <motion.h1 className="hero__title" variants={fadeUp} custom={1}>
              Validate Your Startup Idea
              <span className="hero__title-gradient"> Before You Build</span>
            </motion.h1>

            <motion.p className="hero__subtitle" variants={fadeUp} custom={2}>
              Get instant multi-perspective analysis from AI-simulated investors, users, and competitors.
              Know if your idea will fly — in seconds, not months.
            </motion.p>

            <motion.div className="hero__actions" variants={fadeUp} custom={3}>
              <Link to="/explore" className="btn btn--primary btn--lg" id="hero-explore-btn">
                <Zap size={18} />
                Explore Now
                <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn--outline btn--lg" id="hero-learn-btn">
                Learn How It Works
              </Link>
            </motion.div>

            <motion.div className="hero__stats" variants={fadeUp} custom={4}>
              <div className="hero__stat">
                <span className="hero__stat-number">3</span>
                <span className="hero__stat-label">AI Perspectives</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">&lt;30s</span>
                <span className="hero__stat-label">Analysis Time</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">5</span>
                <span className="hero__stat-label">Scoring Criteria</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero__card-stack">
              <div className="hero__float-card hero__float-card--investor">
                <DollarSign size={20} />
                <div>
                  <span className="hero__float-label">Investor View</span>
                  <span className="hero__float-value">Strong ROI potential</span>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--user">
                <Users size={20} />
                <div>
                  <span className="hero__float-label">User View</span>
                  <span className="hero__float-value">High demand signal</span>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--competitor">
                <Swords size={20} />
                <div>
                  <span className="hero__float-label">Competitor View</span>
                  <span className="hero__float-value">Clear differentiation</span>
                </div>
              </div>

              {/* Score circle */}
              <div className="hero__score-circle">
                <svg viewBox="0 0 120 120" className="hero__score-svg">
                  <circle cx="60" cy="60" r="54" className="hero__score-bg" />
                  <circle cx="60" cy="60" r="54" className="hero__score-fill" />
                </svg>
                <div className="hero__score-inner">
                  <span className="hero__score-num">82</span>
                  <span className="hero__score-label">Score</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHO / WHAT / WHY SECTION
          ══════════════════════════════════════════════════ */}
      <section className="info-section" id="info-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <span className="section-badge">
              <Target size={14} /> Understanding Valideator
            </span>
            <h2 className="section-title">Everything You Need to Know</h2>
            <p className="section-desc">Simple answers to the most important questions</p>
          </motion.div>

          <div className="info-grid">
            {[
              {
                icon: <Users size={28} />,
                question: 'Who is it for?',
                answer: 'Aspiring entrepreneurs, students, indie hackers, startup founders, and anyone with an idea they want to test — no technical knowledge needed. If you can describe your idea in a sentence, Valideator can analyze it.',
                color: 'purple'
              },
              {
                icon: <Lightbulb size={28} />,
                question: 'What does it do?',
                answer: 'Valideator instantly analyzes your startup idea from three perspectives — investor, user, and competitor. It gives you a feasibility score across 5 criteria, SWOT analysis, risk assessment, and actionable suggestions to improve your idea.',
                color: 'teal'
              },
              {
                icon: <Shield size={28} />,
                question: 'Why use it?',
                answer: 'Because 90% of startups fail, often due to lack of validation. Traditional validation takes weeks and costs thousands. Valideator gives you structured, multi-angle feedback in under 30 seconds — completely free.',
                color: 'warm'
              },
              {
                icon: <Zap size={28} />,
                question: 'How does it work?',
                answer: 'Simply type your idea, and our AI engine simulates investor, user, and competitor viewpoints. It scores your idea across Market Demand, Uniqueness, Feasibility, Scalability, and Revenue Potential — all powered by advanced AI.',
                color: 'rose'
              }
            ].map((item, i) => (
              <motion.div
                key={item.question}
                className={`info-card info-card--${item.color}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={scaleIn}
                custom={i}
              >
                <div className={`info-card__icon info-card__icon--${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="info-card__question">{item.question}</h3>
                <p className="info-card__answer">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES SECTION
          ══════════════════════════════════════════════════ */}
      <section className="features-section" id="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <span className="section-badge">
              <Star size={14} /> Powerful Features
            </span>
            <h2 className="section-title">More Than Just a Score</h2>
            <p className="section-desc">Deep, multi-dimensional analysis of every startup idea</p>
          </motion.div>

          <div className="features-grid">
            {[
              { icon: <Eye size={22} />, title: 'Multi-Perspective Analysis', desc: 'See your idea through the eyes of an investor, end user, and competitor simultaneously.' },
              { icon: <BarChart3 size={22} />, title: '5-Criteria Scoring', desc: 'Scored on Market Demand, Uniqueness, Feasibility, Scalability, and Revenue Potential (0–100).' },
              { icon: <Shield size={22} />, title: 'SWOT Analysis', desc: 'Structured breakdown of strengths, weaknesses, opportunities, and threats.' },
              { icon: <TrendingUp size={22} />, title: 'Risk Identification', desc: 'Pinpoint market, execution, and competition risks before they become problems.' },
              { icon: <Sparkles size={22} />, title: 'AI Brainstorming', desc: 'Chat freely with AI to brainstorm, refine ideas, and discuss strategy beyond just scoring.' },
              { icon: <Trophy size={22} />, title: 'Leaderboard & History', desc: 'Track your analyzed ideas and see how top-scoring ideas are structured.' }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
              >
                <div className="feature-card__icon">{feature.icon}</div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS (preview)
          ══════════════════════════════════════════════════ */}
      <section className="how-section" id="how-it-works-preview">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <span className="section-badge">
              <CheckCircle size={14} /> Simple Process
            </span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">From idea to insights in 3 simple steps</p>
          </motion.div>

          <div className="steps">
            {[
              { num: '01', title: 'Describe Your Idea', desc: 'Type your startup idea in plain language. No jargon needed — just tell us what you want to build.', icon: <Lightbulb size={24} /> },
              { num: '02', title: 'AI Analyzes Instantly', desc: 'Our AI engine simulates investor, user, and competitor perspectives and generates a comprehensive analysis.', icon: <Zap size={24} /> },
              { num: '03', title: 'Get Actionable Insights', desc: 'Receive your score, feasibility rating, SWOT analysis, risks, and suggestions to improve your idea.', icon: <Target size={24} /> }
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="step"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
              >
                <div className="step__num">{step.num}</div>
                <div className="step__icon">{step.icon}</div>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.desc}</p>
                {i < 2 && <ChevronRight className="step__arrow" size={24} />}
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="how-section__cta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            <Link to="/how-it-works" className="btn btn--outline btn--lg" id="how-more-btn">
              Learn More About How It Works
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════ */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scaleIn}
          >
            <div className="cta-card__glow" />
            <h2 className="cta-card__title">Ready to Validate Your Idea?</h2>
            <p className="cta-card__desc">
              Don't waste months building something nobody wants. Get AI-powered feedback in seconds.
            </p>
            <Link to="/explore" className="btn btn--primary btn--lg" id="cta-explore-btn">
              <Zap size={18} />
              Start Analyzing Now
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="footer" id="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="navbar__logo">
              <div className="navbar__logo-icon">
                <Shield size={18} />
              </div>
              <span className="navbar__logo-text">
                Valid<span className="navbar__logo-accent">eator</span>
              </span>
            </div>
            <p className="footer__tagline">Validate ideas before you invest.</p>
          </div>
          <div className="footer__links">
            <Link to="/about">About Us</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/brainstorm">Brainstorm</Link>
          </div>
          <div className="footer__copy">
            &copy; {new Date().getFullYear()} Valideator. Built with ❤️ and AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
