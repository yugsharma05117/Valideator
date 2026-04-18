import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Mail, MapPin, GitBranch, Loader2, CheckCircle,
  Shield, Code, Palette, Database, ArrowRight, Heart, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { sendContactMessage } from '../services/api';
import './AboutPage.css';

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

const contributors = [
  {
    name: 'Yug Sharma',
    role: 'Backend Developer',
    desc: 'Architected the backend infrastructure, designed the Groq AI integration, built the scoring engine and API endpoints that power Valideator\'s analysis pipeline.',
    icon: <Code size={24} />,
    color: 'purple',
    skills: ['Node.js', 'Express', 'Groq API', 'Firebase']
  },
  {
    name: 'Anshika Yadav',
    role: 'Frontend Developer',
    desc: 'Crafted the responsive UI components, designed the interactive chat experience, and implemented the landing page with smooth animations and modern aesthetics.',
    icon: <Palette size={24} />,
    color: 'teal',
    skills: ['React', 'CSS', 'Framer Motion', 'UI/UX']
  },
  {
    name: 'Anshika Singh',
    role: 'Frontend Developer',
    desc: 'Built the report visualization system, implemented Chart.js integrations, and designed the data-rich analysis dashboards with intuitive user interactions.',
    icon: <Palette size={24} />,
    color: 'warm',
    skills: ['React', 'Chart.js', 'CSS', 'Responsive Design']
  },
  {
    name: 'Krishna Kumar',
    role: 'Database Engineer',
    desc: 'Designed the Firestore database schema, managed data storage and retrieval, built the leaderboard system and ensured data integrity across the platform.',
    icon: <Database size={24} />,
    color: 'rose',
    skills: ['Firebase', 'Firestore', 'Data Modeling', 'NoSQL']
  }
];

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormError('');

    try {
      await sendContactMessage(formData.name, formData.email, formData.message);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000);
    } catch (err) {
      setFormStatus('error');
      setFormError(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="about" id="about-page">
      <Navbar />

      {/* Decorative */}
      <div className="about__bg-orbs">
        <div className="about__orb about__orb--1" />
        <div className="about__orb about__orb--2" />
      </div>

      <div className="about__wrapper">
        <div className="container">

          {/* ── Hero Header ──────────────────────────────── */}
          <motion.div
            className="about__header"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="section-badge">
              <Shield size={14} /> About Valideator
            </div>
            <h1 className="about__title">
              The Team Behind <span className="about__title-gradient">Valideator</span>
            </h1>
            <p className="about__subtitle">
              We're a team of passionate developers and designers building tools 
              to help entrepreneurs validate their ideas before they invest time and money.
            </p>
          </motion.div>

          {/* ── Our Mission ─────────────────────────────── */}
          <motion.section
            className="about__mission"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <div className="about__mission-card">
              <div className="about__mission-icon">
                <Sparkles size={32} />
              </div>
              <h2>Our Mission</h2>
              <p>
                90% of startups fail — most because they never validated their idea. We built 
                Valideator to change that. By combining AI with structured analysis frameworks, 
                we give every aspiring entrepreneur the tools that were once only available to 
                those with expensive consultants and market research firms. Our goal is to 
                democratize startup validation and help more great ideas succeed.
              </p>
            </div>
          </motion.section>

          {/* ── What We Do ──────────────────────────────── */}
          <motion.section
            className="about__what-we-do"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <h2 className="about__section-title">What Valideator Does</h2>
            <div className="about__features-row">
              {[
                { icon: '🎯', title: '5-Criteria Scoring', desc: 'Market Demand, Uniqueness, Feasibility, Scalability, Revenue Potential' },
                { icon: '👁️', title: 'Multi-Perspective', desc: 'AI simulates investor, user, and competitor viewpoints' },
                { icon: '🛡️', title: 'SWOT Analysis', desc: 'Structured strengths, weaknesses, opportunities, threats' },
                { icon: '🧠', title: 'AI Brainstorming', desc: 'Chat with AI to refine ideas and explore strategies' }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="about__feature-mini"
                  variants={scaleIn}
                  custom={i}
                >
                  <span className="about__feature-emoji">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── Contributors ────────────────────────────── */}
          <motion.section
            className="about__team"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="section-header">
              <span className="section-badge">
                <Users size={14} /> Our Team
              </span>
              <h2 className="section-title">Meet the Creators</h2>
              <p className="section-desc">The people who brought Valideator to life</p>
            </div>

            <div className="about__team-grid">
              {contributors.map((person, i) => (
                <motion.div
                  key={person.name}
                  className={`about__team-card about__team-card--${person.color}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={scaleIn}
                  custom={i}
                >
                  <div className={`about__team-avatar about__team-avatar--${person.color}`}>
                    {person.icon}
                  </div>
                  <h3 className="about__team-name">{person.name}</h3>
                  <span className={`about__team-role about__team-role--${person.color}`}>
                    {person.role}
                  </span>
                  <p className="about__team-desc">{person.desc}</p>
                  <div className="about__team-skills">
                    {person.skills.map(skill => (
                      <span key={skill} className="about__team-skill">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── Contact Section ─────────────────────────── */}
          <motion.section
            className="about__contact"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="about__contact-card">
              <div className="about__contact-left">
                <h2>Get In Touch</h2>
                <p>Have questions, feedback, or a feature request? We'd love to hear from you.</p>
                
                <div className="about__contact-info">
                  <div className="about__contact-item">
                    <Mail size={18} />
                    <span>yugsharma200606@gmail.com</span>
                  </div>
                  <div className="about__contact-item">
                    <MapPin size={18} />
                    <span>India</span>
                  </div>
                  <div className="about__contact-item">
                    <GitBranch size={18} />
                    <span>github.com/valideator</span>
                  </div>
                </div>
              </div>

              <form className="about__contact-form" onSubmit={handleSubmit}>
                <div className="about__form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                  />
                </div>
                <div className="about__form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                  />
                </div>
                <div className="about__form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                  />
                </div>

                {formStatus === 'success' && (
                  <div className="about__form-success">
                    <CheckCircle size={18} />
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="about__form-error">
                    ⚠️ {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  id="contact-submit-btn"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? (
                    <><Loader2 size={18} className="spin" /> Sending...</>
                  ) : (
                    <><Mail size={18} /> Send Message <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.section>

          {/* ── CTA ────────────────────────────────────── */}
          <motion.section
            className="about__cta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <div className="about__cta-card">
              <Heart size={32} className="about__cta-icon" />
              <h2>Built with Passion, Powered by AI</h2>
              <p>Ready to validate your next big idea?</p>
              <Link to="/explore" className="btn btn--primary btn--lg" id="about-cta-btn">
                Start Validating <ArrowRight size={18} />
              </Link>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
