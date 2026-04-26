import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Progress.css';

const CATEGORY_COLORS = {
  safety: '#4f46e5', ethics: '#f97316', privacy: '#10b981',
  cyberbullying: '#ef4444', literacy: '#8b5cf6',
};

export default function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, lRes, eRes] = await Promise.all([
          axios.get('/api/progress'),
          axios.get('/api/leaderboard'),
          axios.get('/api/exams/my-results'),
        ]);
        setProgress(pRes.data);
        const me = lRes.data.find(e => e.isCurrentUser);
        setMyRank(me || null);
        setExamResults(eRes.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const totalCourses = progress.length;
  const completed = progress.filter((p) => p.isCompleted).length;
  const inProgress = progress.filter((p) => p.percentComplete > 0 && !p.isCompleted).length;
  const overallPct = totalCourses ? Math.round(progress.reduce((s, p) => s + p.percentComplete, 0) / totalCourses) : 0;
  const totalXpFromCourses = progress.reduce((s, p) => s + (p.xpEarned || 0), 0);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">📈 My Progress</h1>
          <p className="page-sub">Track your learning journey across all courses</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="progress-summary-grid fade-up fade-up-2">
        {[
          { label: 'Overall Progress', value: `${overallPct}%`, icon: '🎯', color: 'var(--electric)' },
          { label: 'Courses Started', value: totalCourses, icon: '📖', color: 'var(--amber)' },
          { label: 'In Progress', value: inProgress, icon: '⏳', color: '#f97316' },
          { label: 'Completed', value: completed, icon: '✅', color: 'var(--mint)' },
          { label: 'Total XP', value: `${user?.xp || 0}`, icon: '⭐', color: 'var(--coral)' },
          { label: 'Leaderboard Rank', value: myRank ? `#${myRank.rank}` : '—', icon: '🏆', color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} className="summary-card">
            <div className="summary-icon">{s.icon}</div>
            <div className="summary-value" style={{ color: s.color }}>{s.value}</div>
            <div className="summary-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard Snippet */}
      {myRank && (
        <div className="progress-lb-banner fade-up fade-up-2" onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer' }}>
          <div className="plb-left">
            <div className="plb-rank">#{myRank.rank}</div>
            <div>
              <div className="plb-title">Your Leaderboard Position</div>
              <div className="plb-sub">🔥 {myRank.streak} day streak · {myRank.xp?.toLocaleString()} XP · {myRank.badges?.length || 0} badges</div>
            </div>
          </div>
          <div className="plb-arrow">View Full Leaderboard →</div>
        </div>
      )}

      {/* Course Breakdown */}
      <div className="section-title-row fade-up fade-up-3">Course Breakdown</div>
      <div className="progress-course-list fade-up fade-up-3">
        {progress.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No courses started yet</div>
            <p style={{ color: 'rgba(10,10,20,0.5)', marginBottom: 20 }}>Start a course to track your progress here.</p>
            <button className="btn-primary" onClick={() => navigate('/courses')}>Browse Courses →</button>
          </div>
        )}
        {progress.map((p) => {
          const course = p.course;
          if (!course) return null;
          const color = CATEGORY_COLORS[course.category] || 'var(--electric)';
          const examResult = examResults.find(e => e.course?._id === course._id || e.course === course._id);
          return (
            <div key={p._id} className="progress-course-card" onClick={() => navigate(`/courses/${course._id}`)}>
              <div className="pcc-icon" style={{ background: `${color}22` }}>
                <span style={{ fontSize: 28 }}>{course.icon}</span>
              </div>
              <div className="pcc-body">
                <div className="pcc-title">{course.title}</div>
                <div className="pcc-meta">
                  <span className="meta-pill">{p.completedLessons?.length || 0}/{course.totalLessons} lessons</span>
                  {p.isCompleted && <span className="meta-pill" style={{ background: '#d1fae5', color: '#059669' }}>✅ Completed</span>}
                  {!p.isCompleted && p.percentComplete > 0 && <span className="meta-pill" style={{ background: '#fef3c7', color: '#d97706' }}>⏳ In Progress</span>}
                  {!p.isCompleted && p.percentComplete === 0 && <span className="meta-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>🆕 Started</span>}
                  {examResult && (
                    <span className="meta-pill" style={{ background: examResult.passed ? '#d1fae5' : '#fee2e2', color: examResult.passed ? '#059669' : '#dc2626' }}>
                      📝 Exam: {examResult.score}% {examResult.passed ? '✅' : '❌'}
                    </span>
                  )}
                </div>
                <div className="pcc-bar-row">
                  <div className="pbar-track-light">
                    <div style={{ height: '100%', width: `${p.percentComplete}%`, background: color, borderRadius: 10, transition: 'width 0.8s' }} />
                  </div>
                  <span className="mini-pct">{p.percentComplete}%</span>
                </div>
              </div>
              <div className="pcc-right">
                <div className="pcc-xp">+{p.xpEarned} XP</div>
                {p.isCompleted && !examResult && (
                  <button className="btn-small-primary" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course._id}`); }}>
                    Take Exam →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Results Section */}
      {examResults.length > 0 && (
        <>
          <div className="section-title-row fade-up fade-up-4" style={{ marginTop: 32 }}>Exam Results</div>
          <div className="exam-results-list fade-up fade-up-4">
            {examResults.map((er) => (
              <div key={er._id} className="exam-result-row">
                <div className="er-icon">{er.course?.icon || '📝'}</div>
                <div className="er-body">
                  <div className="er-title">{er.course?.title}</div>
                  <div className="er-exam">{er.exam?.title}</div>
                </div>
                <div className="er-right">
                  <div className="er-score" style={{ color: er.passed ? '#059669' : '#dc2626' }}>{er.score}%</div>
                  <div className="er-grade">{er.grade}</div>
                  <div className={`er-status ${er.passed ? 'pass' : 'fail'}`}>{er.passed ? 'Passed' : 'Failed'}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
