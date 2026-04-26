import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Resources.css';

const STUDY_GUIDES = [
  { id: 1, title: 'Online Safety Study Guide', icon: '🛡️', color: '#10b981', bg: '#d1fae5', category: 'safety', pages: 8 },
  { id: 2, title: 'Ethical Communication Guide', icon: '💬', color: '#4f46e5', bg: '#ede9fe', category: 'ethics', pages: 7 },
  { id: 3, title: 'Data Privacy Study Guide', icon: '🔐', color: '#f59e0b', bg: '#fef3c7', category: 'privacy', pages: 9 },
  { id: 4, title: 'Cyberbullying Awareness Guide', icon: '🚫', color: '#ef4444', bg: '#fee2e2', category: 'cyberbullying', pages: 6 },
  { id: 5, title: 'Digital Literacy Study Guide', icon: '📚', color: '#8b5cf6', bg: '#f3e8ff', category: 'literacy', pages: 8 },
];

const VIDEO_LESSONS = [
  { id: 1, title: 'Password Security Explained', duration: '8:42', icon: '🔑', url: 'https://www.youtube.com/watch?v=aEmXedmVdFY', category: 'safety', thumb: '🛡️' },
  { id: 2, title: 'What is Two-Factor Authentication?', duration: '5:31', icon: '🔐', url: 'https://www.youtube.com/watch?v=0mvCeNsTa1g', category: 'safety', thumb: '🛡️' },
  { id: 3, title: 'How to Spot Fake News', duration: '7:18', icon: '📰', url: 'https://www.youtube.com/watch?v=AkwWcHekMdo', category: 'literacy', thumb: '📚' },
  { id: 4, title: 'Digital Footprint Explained', duration: '4:52', icon: '👣', url: 'https://www.youtube.com/watch?v=_qGCrn9Mf0E', category: 'literacy', thumb: '📚' },
  { id: 5, title: 'Deepfakes: What You Need to Know', duration: '9:14', icon: '🤖', url: 'https://www.youtube.com/watch?v=oxXpB9pSETo', category: 'literacy', thumb: '📚' },
  { id: 6, title: 'Understanding Cyberbullying', duration: '6:27', icon: '🚫', url: 'https://www.youtube.com/watch?v=eB3oQxKDCzM', category: 'cyberbullying', thumb: '🚫' },
  { id: 7, title: 'Your Data Privacy Rights (GDPR)', duration: '11:03', icon: '⚖️', url: 'https://www.youtube.com/watch?v=Assdm6fIHlE', category: 'privacy', thumb: '🔐' },
  { id: 8, title: 'Safe Online Communication', duration: '5:47', icon: '💬', url: 'https://www.youtube.com/watch?v=xMj_P_6H69g', category: 'ethics', thumb: '💬' },
];

const USEFUL_LINKS = [
  { title: 'Google Safety Center', url: 'https://safety.google', desc: 'Google\'s official safety & privacy resources', category: 'safety', icon: '🔒' },
  { title: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', desc: 'Check if your email was in a data breach', category: 'safety', icon: '🔍' },
  { title: 'StaySafeOnline.org', url: 'https://staysafeonline.org', desc: 'National Cybersecurity Alliance resources', category: 'safety', icon: '🛡️' },
  { title: 'Common Sense Media', url: 'https://www.commonsensemedia.org', desc: 'Digital citizenship resources for all ages', category: 'ethics', icon: '⭐' },
  { title: 'MediaWise (Poynter)', url: 'https://www.poynter.org/mediawise', desc: 'Fact-checking and media literacy', category: 'literacy', icon: '📰' },
  { title: 'EFF: Privacy Guides', url: 'https://www.eff.org/issues/privacy', desc: 'Electronic Frontier Foundation privacy resources', category: 'privacy', icon: '🔐' },
  { title: 'StopBullying.gov', url: 'https://www.stopbullying.gov', desc: 'Official US anti-bullying resources', category: 'cyberbullying', icon: '🚫' },
  { title: 'Cyberbullying Research Center', url: 'https://cyberbullying.org', desc: 'Research, resources and reporting tools', category: 'cyberbullying', icon: '📊' },
  { title: 'Mozilla Web Literacy', url: 'https://foundation.mozilla.org/en/initiatives/web-literacy', desc: 'Mozilla\'s web literacy framework', category: 'literacy', icon: '🌐' },
  { title: 'GDPR.eu', url: 'https://gdpr.eu', desc: 'Official GDPR information and guides', category: 'privacy', icon: '⚖️' },
  { title: 'FactCheck.org', url: 'https://www.factcheck.org', desc: 'Nonpartisan fact-checking organisation', category: 'literacy', icon: '✅' },
  { title: 'Crisis Text Line', url: 'https://www.crisistextline.org', desc: 'Text HOME to 741741 — free crisis support', category: 'cyberbullying', icon: '💙' },
];

const CAT_COLORS = {
  safety: { color: '#10b981', bg: '#d1fae5' },
  ethics: { color: '#4f46e5', bg: '#ede9fe' },
  privacy: { color: '#f59e0b', bg: '#fef3c7' },
  cyberbullying: { color: '#ef4444', bg: '#fee2e2' },
  literacy: { color: '#8b5cf6', bg: '#f3e8ff' },
  all: { color: '#0a0a14', bg: '#e5e5ea' },
};

export default function Resources() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('videos');
  const [viewGuide, setViewGuide] = useState(null);

  useEffect(() => {
    axios.get('/api/courses').then(({ data }) => setCourses(data));
  }, []);

  const filterLinks = (arr) => filter === 'all' ? arr : arr.filter(x => x.category === filter);

  const getGuideContent = (category) => {
    const c = courses.find(c => c.category === category);
    return c?.studyGuide || 'Study guide loading...';
  };

  const printGuide = (guide) => {
    const content = getGuideContent(guide.category);
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>${guide.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <style>
      body { font-family:'DM Sans',sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#0a0a14; }
      h1 { font-family:'Syne',sans-serif;font-size:28px;margin-bottom:8px; }
      .sub { color:rgba(10,10,20,0.45);font-size:14px;margin-bottom:32px; }
      h2 { font-family:'Syne',sans-serif;font-size:18px;margin:24px 0 8px; }
      h3 { font-size:15px;margin:16px 0 6px; }
      p, li { font-size:14px;line-height:1.7;color:rgba(10,10,20,0.75); }
      strong { color:#0a0a14; }
      pre { background:#f5f3ee;padding:16px;border-radius:8px;font-size:13px;white-space:pre-wrap; }
    </style></head><body>
    <h1>${guide.icon} ${guide.title}</h1>
    <div class="sub">CivicMind Digital Citizenship Platform · Study Guide</div>
    <pre>${content}</pre>
    <script>window.onload=()=>window.print()</script>
    </body></html>`);
    win.document.close();
  };

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">🗂 Learning Resources</h1>
          <p className="page-sub">Video lessons, study guides, and useful links to support your learning</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="filter-chips fade-up fade-up-2">
        {['all','safety','ethics','privacy','cyberbullying','literacy'].map(cat => (
          <button key={cat} className={`chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
            {cat === 'all' ? '⊞ All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="res-tabs fade-up fade-up-2">
        {[
          { key: 'videos', label: '🎬 Video Lessons', count: filterLinks(VIDEO_LESSONS).length },
          { key: 'guides', label: '📄 Study Guides', count: filterLinks(STUDY_GUIDES).length },
          { key: 'links', label: '🔗 Useful Links', count: filterLinks(USEFUL_LINKS).length },
        ].map(t => (
          <button key={t.key} className={`res-tab ${activeSection === t.key ? 'active' : ''}`} onClick={() => setActiveSection(t.key)}>
            {t.label} <span className="res-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* VIDEO LESSONS */}
      {activeSection === 'videos' && (
        <div className="res-grid fade-up fade-up-3">
          {filterLinks(VIDEO_LESSONS).map(v => {
            const c = CAT_COLORS[v.category] || CAT_COLORS.all;
            return (
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="video-card">
                <div className="video-thumb" style={{ background: c.bg }}>
                  <div className="video-thumb-icon">{v.thumb}</div>
                  <div className="video-play-btn">▶</div>
                  <div className="video-duration">{v.duration}</div>
                </div>
                <div className="video-body">
                  <div className="video-title">{v.title}</div>
                  <div className="video-meta">
                    <span className="video-cat-chip" style={{ background: c.bg, color: c.color }}>{v.category}</span>
                    <span className="video-optional">Optional</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* STUDY GUIDES */}
      {activeSection === 'guides' && (
        <div className="guides-list fade-up fade-up-3">
          {filterLinks(STUDY_GUIDES).map(g => {
            const c = CAT_COLORS[g.category] || CAT_COLORS.all;
            return (
              <div key={g.id} className="guide-row">
                <div className="guide-icon" style={{ background: g.bg, color: g.color }}>{g.icon}</div>
                <div className="guide-body">
                  <div className="guide-title">{g.title}</div>
                  <div className="guide-meta">{g.pages} pages · Comprehensive notes + exam tips</div>
                </div>
                <div className="guide-actions">
                  <button className="guide-btn view" onClick={() => setViewGuide(viewGuide === g.id ? null : g.id)}>
                    {viewGuide === g.id ? '▲ Hide' : '👁 View'}
                  </button>
                  <button className="guide-btn print" onClick={() => printGuide(g)}>🖨 Print</button>
                </div>
                {viewGuide === g.id && (
                  <div className="guide-content">
                    <pre>{getGuideContent(g.category)}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* USEFUL LINKS */}
      {activeSection === 'links' && (
        <div className="links-grid fade-up fade-up-3">
          {filterLinks(USEFUL_LINKS).map((l, i) => {
            const c = CAT_COLORS[l.category] || CAT_COLORS.all;
            return (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="link-card">
                <div className="link-icon" style={{ background: c.bg }}>{l.icon}</div>
                <div className="link-body">
                  <div className="link-title">{l.title}</div>
                  <div className="link-desc">{l.desc}</div>
                  <div className="link-url">{l.url.replace('https://', '')}</div>
                </div>
                <div className="link-arrow">→</div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
