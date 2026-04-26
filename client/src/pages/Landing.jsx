import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Landing.css';

const COURSES = [
  { icon: '🛡️', title: 'Online Safety', desc: 'Protect yourself from phishing, malware, and digital threats.', color: '#10b981', bg: '#d1fae5', cat: 'safety' },
  { icon: '💬', title: 'Ethical Communication', desc: 'Communicate respectfully and combat misinformation online.', color: '#4f46e5', bg: '#ede9fe', cat: 'ethics' },
  { icon: '🔐', title: 'Data Privacy', desc: 'Understand your rights and protect your personal data.', color: '#f59e0b', bg: '#fef3c7', cat: 'privacy' },
  { icon: '🚫', title: 'Cyberbullying Awareness', desc: 'Recognize, prevent, and respond to online harassment.', color: '#ef4444', bg: '#fee2e2', cat: 'cyberbullying' },
  { icon: '📚', title: 'Digital Literacy', desc: 'Navigate information and media with critical thinking.', color: '#8b5cf6', bg: '#f3e8ff', cat: 'literacy' },
];

const STATS = [
  { icon: '📚', value: '5', label: 'Courses' },
  { icon: '✏️', value: '25+', label: 'Quizzes & Exams' },
  { icon: '🎓', value: '50+', label: 'Lessons' },
  { icon: '🏆', value: 'XP', label: 'Rewards System' },
];

const FEATURES = [
  { icon: '📖', title: 'Structured Learning Paths', desc: 'Follow 2-week learning plans with daily lessons, study notes, and video resources — built for real progress.' },
  { icon: '✏️', title: 'Quizzes & Final Exams', desc: 'Test your knowledge with course-specific quizzes, then prove mastery with a comprehensive final exam each week.' },
  { icon: '🎓', title: 'Earn Certificates', desc: 'Complete a course, pass the exam, and receive an official certificate signed by your instructor — printable and downloadable.' },
  { icon: '🏆', title: 'Leaderboard & XP', desc: 'Earn XP for every lesson, quiz, and exam. Track your rank on the live leaderboard and compete with classmates.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'See your overall completion, exam scores, and XP earned across every course — all in one place.' },
  { icon: '🗂', title: 'Rich Resources', desc: 'Access video lessons, downloadable study guides, and curated external links for every topic.' },
];

const TESTIMONIALS = [
  { name: 'Amara N.', role: 'Student', text: 'I had no idea how much of my personal data was being collected online. The Data Privacy course completely changed how I use the internet.', avatar: 'AN' },
  { name: 'Brian K.', role: 'Student', text: 'The cyberbullying course gave me the words and tools to actually help a friend who was being targeted online. Incredibly practical.', avatar: 'BK' },
  { name: 'Cynthia M.', role: 'Student', text: 'I love the XP system — it makes learning feel like a game. I\'m ranked 2nd on the leaderboard and not stopping until I\'m first!', avatar: 'CM' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-cycle features
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">CivicMind</div>
        <div className="nav-links">
          <a href="#courses" className="nav-link">Courses</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <div className="nav-actions">
          <button className="nav-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="nav-btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="hero-content">
          <div className="hero-tag fade-up fade-up-1">
            <span className="hero-dot" />
            Digital Citizenship Education Platform
          </div>
          <h1 className="hero-title fade-up fade-up-2">
            Learn to Navigate<br />
            <span className="gradient-text">the Digital World</span><br />
            Safely & Ethically
          </h1>
          <p className="hero-desc fade-up fade-up-3">
            Master online safety, data privacy, ethical communication, and more — through structured courses, quizzes, and real certifications.
          </p>
          <div className="hero-ctas fade-up fade-up-4">
            <button className="cta-primary" onClick={() => navigate('/register')}>
              Start Learning Free →
            </button>
            <button className="cta-secondary" onClick={() => navigate('/login')}>
              I already have an account
            </button>
          </div>
          <div className="hero-stats fade-up fade-up-5">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hs-icon">{s.icon}</div>
                <div className="hs-val">{s.value}</div>
                <div className="hs-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual — Floating Cards */}
        <div className="hero-visual fade-up fade-up-3">
          <div className="hv-card hv-card-1">
            <div className="hvc-row"><span className="hvc-icon" style={{background:'#d1fae5'}}>🛡️</span><div><div className="hvc-title">Online Safety</div><div className="hvc-sub">10 lessons · Beginner</div></div></div>
            <div className="hvc-bar-wrap"><div className="hvc-bar" style={{width:'72%', background:'#10b981'}} /><span>72%</span></div>
          </div>
          <div className="hv-card hv-card-2">
            <div className="hvc-pill">🎯 Quiz Passed!</div>
            <div className="hvc-score">94%</div>
            <div className="hvc-sub">+85 XP earned</div>
          </div>
          <div className="hv-card hv-card-3">
            <div className="hvc-cert-icon">🎓</div>
            <div className="hvc-title">Certificate Ready</div>
            <div className="hvc-sub">Data Privacy — Grade A</div>
          </div>
          <div className="hv-card hv-card-4">
            <div style={{fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:13, marginBottom:8}}>🏆 Leaderboard</div>
            {['Amara N.','Brian K.','You'].map((n,i) => (
              <div key={n} className="hvc-lb-row">
                <span className="hvc-rank">{['🥇','🥈','🥉'][i]}</span>
                <span className={i===2?'hvc-lb-you':''}>{n}</span>
                <span className="hvc-lb-xp">{[2400,1980,1650][i]} XP</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="section" id="courses">
        <div className="section-inner">
          <div className="section-tag">📚 What You'll Learn</div>
          <h2 className="section-title">5 Courses in Digital Citizenship</h2>
          <p className="section-sub">Each course covers a critical area of life online — with lessons, quizzes, exams, and a certificate you can earn.</p>
          <div className="courses-grid">
            {COURSES.map((c) => (
              <div key={c.cat} className="course-card">
                <div className="cc-icon-wrap" style={{ background: c.bg }}>
                  <span className="cc-icon">{c.icon}</span>
                </div>
                <div className="cc-body">
                  <div className="cc-title">{c.title}</div>
                  <div className="cc-desc">{c.desc}</div>
                  <div className="cc-meta">
                    <span className="cc-pill" style={{ background: c.bg, color: c.color }}>10 lessons</span>
                    <span className="cc-pill" style={{ background: c.bg, color: c.color }}>+XP Rewards</span>
                  </div>
                </div>
                <div className="cc-arrow" style={{ color: c.color }}>→</div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <button className="cta-primary" onClick={() => navigate('/register')}>Enrol in All 5 Courses →</button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section section-dark" id="features">
        <div className="section-inner">
          <div className="section-tag light">⚡ Platform Features</div>
          <h2 className="section-title light">Everything you need to learn and grow</h2>
          <p className="section-sub light">From your first lesson to your certificate — CivicMind guides every step.</p>
          <div className="features-layout">
            <div className="features-list">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className={`feature-item ${activeFeature === i ? 'active' : ''}`}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className="fi-icon">{f.icon}</div>
                  <div className="fi-body">
                    <div className="fi-title">{f.title}</div>
                    <div className="fi-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="features-preview">
              <div className="fp-card">
                <div className="fp-icon">{FEATURES[activeFeature].icon}</div>
                <div className="fp-title">{FEATURES[activeFeature].title}</div>
                <div className="fp-desc">{FEATURES[activeFeature].desc}</div>
                <button className="cta-primary fp-cta" onClick={() => navigate('/register')}>Try it free →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="about">
        <div className="section-inner">
          <div className="section-tag">🗺 How It Works</div>
          <h2 className="section-title">From registration to certificate in 3 weeks</h2>
          <div className="steps-grid">
            {[
              { step: '01', icon: '✍️', title: 'Create Your Account', desc: 'Register in under 60 seconds. No payment required. Your learning profile is set up instantly.' },
              { step: '02', icon: '📖', title: 'Take Lessons Daily', desc: 'Follow a structured 2-week plan — one lesson per day, Monday to Friday. Includes notes, videos, and study guides.' },
              { step: '03', icon: '✏️', title: 'Pass Quizzes & Exams', desc: 'Test your knowledge with per-course quizzes along the way, then take the final exam in Week 3.' },
              { step: '04', icon: '🎓', title: 'Earn Your Certificate', desc: 'Request your certificate after passing. The admin reviews and approves it — then you print or download it with your name.' },
            ].map(s => (
              <div key={s.step} className="step-card">
                <div className="sc-step">{s.step}</div>
                <div className="sc-icon">{s.icon}</div>
                <div className="sc-title">{s.title}</div>
                <div className="sc-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section section-tinted">
        <div className="section-inner">
          <div className="section-tag">💬 From Students</div>
          <h2 className="section-title">Real learners, real impact</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="tc-quote">❝</div>
                <p className="tc-text">{t.text}</p>
                <div className="tc-author">
                  <div className="tc-avatar">{t.avatar}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="ctab-inner">
          <div className="ctab-tag">🚀 Ready to start?</div>
          <h2 className="ctab-title">Join CivicMind today — it's free</h2>
          <p className="ctab-sub">5 courses. 50+ lessons. Real certificates. Start learning digital citizenship the right way.</p>
          <div className="ctab-actions">
            <button className="cta-primary ctab-btn" onClick={() => navigate('/register')}>Create Free Account →</button>
            <button className="cta-ghost" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">CivicMind</div>
            <div className="footer-tagline">Digital Citizenship Education Platform</div>
          </div>
          <div className="footer-links">
            <div className="fl-col">
              <div className="fl-heading">Courses</div>
              {COURSES.map(c => <div key={c.cat} className="fl-link">{c.icon} {c.title}</div>)}
            </div>
            <div className="fl-col">
              <div className="fl-heading">Platform</div>
              <div className="fl-link">Leaderboard</div>
              <div className="fl-link">Certificates</div>
              <div className="fl-link">Resources</div>
              <div className="fl-link">Help & Support</div>
            </div>
            <div className="fl-col">
              <div className="fl-heading">Account</div>
              <div className="fl-link" onClick={() => navigate('/login')} style={{cursor:'pointer'}}>Sign In</div>
              <div className="fl-link" onClick={() => navigate('/register')} style={{cursor:'pointer'}}>Register</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CivicMind. Built by Sir Ezra Kimanthi — Project Manager.</span>
        </div>
      </footer>
    </div>
  );
}
