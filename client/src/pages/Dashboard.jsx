import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const CATEGORY_COLORS = {
  safety: { bg: '#ede9fe', color: '#4f46e5' },
  ethics: { bg: '#ffedd5', color: '#f97316' },
  privacy: { bg: '#d1fae5', color: '#10b981' },
  cyberbullying: { bg: '#fee2e2', color: '#ef4444' },
  literacy: { bg: '#fef3c7', color: '#f59e0b' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, pRes, aRes, lRes, qRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/progress'),
          axios.get('/api/activities'),
          axios.get('/api/leaderboard'),
          axios.get('/api/quizzes'),
        ]);
        setCourses(cRes.data);
        setProgress(pRes.data);
        setActivities(aRes.data);
        setLeaderboard(lRes.data);
        setQuizzes(qRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getProgress = (courseId) => {
    const p = progress.find((p) => p.course?._id === courseId);
    return p?.percentComplete || 0;
  };

  const overallPct = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.percentComplete, 0) / progress.length)
    : 0;

  const completedCourses = progress.filter((p) => p.isCompleted).length;

  const filtered = (filter === 'all' ? courses : courses.filter((c) => c.category === filter))
    .filter((c) => c.isEnrollmentOpen !== false);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section fade-up fade-up-1">
        <div className="hero-left">
          <div className="hero-tag">🟢 Active Learner · Week {user?.streak || 1}</div>
          <h1 className="hero-title">
            Learn <em>Digital</em><br />Citizenship Awareness
          </h1>
          <p className="hero-sub">
            Build the skills to navigate, communicate, and thrive in digital spaces — safely and ethically.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/courses')}>Continue Learning →</button>
            <button className="btn-secondary" onClick={() => navigate('/quizzes')}>✏️ Take a Quiz</button>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-num">{courses.length}<span>+</span></div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{completedCourses}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{user?.xp || 0}<span> xp</span></div>
              <div className="stat-label">Total XP</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">{user?.streak || 0}<span>🔥</span></div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="progress-card">
            <div className="progress-card-label">YOUR PROGRESS</div>
            <div className="progress-card-title">Overall Completion</div>
            <div className="progress-ring-wrap">
              <svg className="ring-svg" viewBox="0 0 80 80">
                <circle className="ring-bg" cx="40" cy="40" r="32" />
                <circle
                  className="ring-fill"
                  cx="40" cy="40" r="32"
                  style={{ strokeDashoffset: 201 - (201 * overallPct) / 100 }}
                />
                <text className="ring-text" x="40" y="40">{overallPct}%</text>
              </svg>
              <div className="progress-info">
                <div className="progress-big">{completedCourses}<span>/{courses.length}</span></div>
                <div className="progress-desc">Courses completed</div>
              </div>
            </div>
            <div className="progress-bars">
              {courses.slice(0, 3).map((c) => (
                <div key={c._id} className="pbar-row">
                  <div className="pbar-label">{c.icon} {c.title}</div>
                  <div className="pbar-track">
                    <div className="pbar-fill" style={{ width: `${getProgress(c._id)}%`, background: CATEGORY_COLORS[c.category]?.color || 'var(--electric-light)' }} />
                  </div>
                  <div className="pbar-pct">{getProgress(c._id)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <div className="section-header fade-up fade-up-2">
        <div className="section-title">📚 Learning Paths</div>
        <a className="section-link" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>View all →</a>
      </div>

      <div className="filter-chips fade-up fade-up-2">
        {['all', 'safety', 'ethics', 'privacy', 'cyberbullying', 'literacy'].map((cat) => (
          <button
            key={cat}
            className={`chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? '⊞ All Topics' : `${['🛡️','💬','🔐','🚫','📚'][['safety','ethics','privacy','cyberbullying','literacy'].indexOf(cat)]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
          </button>
        ))}
      </div>

      <div className="cards-grid fade-up fade-up-3">
        {filtered.map((course) => {
          const pct = getProgress(course._id);
          const colors = CATEGORY_COLORS[course.category] || { bg: '#ede9fe', color: '#4f46e5' };
          return (
            <div key={course._id} className="topic-card" onClick={() => navigate(`/courses/${course._id}`)}>
              <div className="card-visual" style={{ background: colors.bg }}>
                <span style={{ fontSize: 52 }}>{course.icon}</span>
                <div className="card-badge">
                  <div className="card-badge-dot" style={{ background: pct === 100 ? '#10b981' : pct > 0 ? '#f59e0b' : '#94a3b8' }} />
                  {pct === 100 ? 'Done' : pct > 0 ? 'In Progress' : 'New'}
                </div>
              </div>
              <div className="card-body">
                <div className="card-title">{course.title}</div>
                <div className="card-desc">{course.description}</div>
                <div className="card-meta">
                  <span className="meta-pill">📖 {course.totalLessons} lessons</span>
                  <span className="meta-pill">⏱ {course.estimatedTime}min</span>
                  <span className="meta-pill">{course.difficulty}</span>
                </div>
                <div className="card-progress-row">
                  <div className="mini-bar">
                    <div className="mini-fill" style={{ width: `${pct}%`, background: colors.color }} />
                  </div>
                  <div className="mini-pct">{pct}%</div>
                </div>
                <div className="card-footer">
                  <button className="btn-review" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course._id}`); }}>
                    {pct === 0 ? 'Start' : pct === 100 ? 'Review' : 'Continue'}
                  </button>
                  <div className="card-icon-btn" title="Add to favorites">♡</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM GRID: Lesson + Quiz + Leaderboard ── */}
      <div className="bottom-grid fade-up fade-up-4">
        <div className="lesson-card">
          <div>
            <div className="lesson-card-tag">NEXT UP</div>
            <div className="lesson-card-title">Continue Where You Left Off</div>
            <div className="lesson-card-sub">Pick up your most recently active course and keep building your skills.</div>
          </div>
          <div className="lesson-card-footer">
            <button className="btn-start" onClick={() => navigate('/courses')}>Resume →</button>
            <div className="lesson-duration">⏱ ~15 min</div>
          </div>
          <div className="lesson-visual">📖</div>
        </div>

        <div className="quiz-card">
          <div className="quiz-card-header">
            <div>
              <div className="quiz-title">Daily Quizzes</div>
              <div className="quiz-sub">Test your knowledge and earn XP</div>
            </div>
            <div className="quiz-icon-box">✏️</div>
          </div>
          <ul className="quiz-list">
            {quizzes.slice(0, 3).map((q) => (
              <li key={q._id}>
                <div className="quiz-list-icon" style={{ background: '#ede9fe' }}>🎯</div>
                <span>{q.title}</span>
                <span className="quiz-list-right">+{q.xpReward} XP</span>
              </li>
            ))}
          </ul>
          <button className="btn-quiz" onClick={() => navigate('/quizzes')}>Start Quiz Challenge 🚀</button>
        </div>

        <div className="leaderboard-card">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16 }}>🏆 Leaderboard</div>
            <a className="section-link" onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer' }}>Full →</a>
          </div>
          {leaderboard.slice(0, 6).map((entry) => (
            <div key={entry._id} className={`leaderboard-item ${entry.isCurrentUser ? 'lb-me' : ''}`}>
              <div className={`lb-rank ${entry.rank === 1 ? 'gold' : entry.rank === 2 ? 'silver' : entry.rank === 3 ? 'bronze' : ''}`}>
                {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
              </div>
              <div className="lb-avatar" style={{ background: 'linear-gradient(135deg,#4f46e5,#f97316)' }}>
                {entry.initials}
              </div>
              <div className="lb-name">{entry.isCurrentUser ? `You (${entry.name})` : entry.name}</div>
              <div className="lb-score">{entry.xp.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTIVITY + CALENDAR ── */}
      <div className="section-header fade-up fade-up-5">
        <div className="section-title">📅 Recent Activity</div>
      </div>
      <div className="activity-grid fade-up fade-up-5">
        <div className="activity-timeline">
          {activities.length === 0 && (
            <p style={{ color: 'rgba(10,10,20,0.45)', fontSize: 14 }}>No activity yet. Start a course to see your progress here!</p>
          )}
          {activities.slice(0, 5).map((act) => (
            <div key={act._id} className="timeline-item">
              <div className="timeline-dot">
                {act.type === 'lesson_complete' ? '✅' : act.type === 'quiz_passed' ? '🎯' : act.type === 'streak' ? '🔥' : '📖'}
              </div>
              <div className="timeline-content">
                <div className="timeline-title">{act.title}</div>
                <div className="timeline-meta">{new Date(act.createdAt).toLocaleString()} {act.meta ? '· ' + act.meta : ''}</div>
                {act.xpEarned > 0 && (
                  <div className="timeline-badge" style={{ background: '#d1fae5', color: '#059669' }}>+{act.xpEarned} XP</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mini-calendar">
          <div className="cal-header">
            <div className="cal-month">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(10,10,20,0.5)', lineHeight: 1.7 }}>
            <p>🔥 Current streak: <strong>{user?.streak || 0} days</strong></p>
            <p>⭐ Total XP: <strong>{user?.xp || 0}</strong></p>
            <p>🏅 Badges: <strong>{user?.badges?.length || 0} earned</strong></p>
            <p>📜 Certificates: <strong>{user?.certificates?.length || 0} earned</strong></p>
          </div>
          <div className="upcoming-events" style={{ marginTop: 20 }}>
            <div className="event-item">
              <div className="event-dot-col"><div className="event-dot" style={{ background: 'var(--electric)' }} /></div>
              <div className="event-text">
                <div className="event-name">Keep your streak alive!</div>
                <div className="event-time">Complete a lesson today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RESOURCES ── */}
      <div className="section-header fade-up fade-up-6" style={{ marginTop: 32 }}>
        <div className="section-title">🗂 Quick Resources</div>
      </div>
      <div className="resources-strip fade-up fade-up-6">
        {[
          { icon: '📄', bg: '#ede9fe', title: 'Study Guides', count: '24 PDFs', link: '/resources' },
          { icon: '🎬', bg: '#d1fae5', title: 'Video Lessons', count: '18 videos', link: '/resources' },
          { icon: '🔗', bg: '#fef3c7', title: 'Useful Links', count: '45 resources', link: '/resources' },
          { icon: '🏅', bg: '#fee2e2', title: 'Certificates', count: 'View yours', link: '/certificates' },
        ].map((r) => (
          <div key={r.title} className="resource-card" onClick={() => navigate(r.link)} style={{ cursor:"pointer" }}>
            <div className="resource-icon" style={{ background: r.bg }}>{r.icon}</div>
            <div className="resource-info">
              <div className="resource-title">{r.title}</div>
              <div className="resource-count">{r.count}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
