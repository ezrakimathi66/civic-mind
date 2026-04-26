import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Courses.css';

const CATEGORY_COLORS = {
  safety: { bg: '#ede9fe', color: '#4f46e5' },
  ethics: { bg: '#ffedd5', color: '#f97316' },
  privacy: { bg: '#d1fae5', color: '#10b981' },
  cyberbullying: { bg: '#fee2e2', color: '#ef4444' },
  literacy: { bg: '#fef3c7', color: '#f59e0b' },
};

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [cRes, pRes] = await Promise.all([axios.get('/api/courses'), axios.get('/api/progress')]);
      setCourses(cRes.data);
      setProgress(pRes.data);
      setLoading(false);
    };
    load();
  }, []);

  const getProgress = (id) => progress.find((p) => p.course?._id === id)?.percentComplete || 0;

  const filtered = courses
    .filter((c) => filter === 'all' || c.category === filter)
    .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">📚 All Courses</h1>
          <p className="page-sub">Browse all digital citizenship learning paths</p>
        </div>
        <div className="search-inline">
          <span>🔍</span>
          <input placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="filter-chips fade-up fade-up-2">
        {['all', 'safety', 'ethics', 'privacy', 'cyberbullying', 'literacy'].map((cat) => (
          <button key={cat} className={`chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
            {cat === 'all' ? '⊞ All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="courses-grid fade-up fade-up-3">
        {filtered.map((course) => {
          const pct = getProgress(course._id);
          const colors = CATEGORY_COLORS[course.category] || { bg: '#ede9fe', color: '#4f46e5' };
          const isLocked = !course.isEnrollmentOpen;
          const enrollmentDate = new Date(course.enrollmentStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          return (
            <div 
              key={course._id} 
              className={`course-row-card ${isLocked ? 'course-locked' : ''}`}
              onClick={() => !isLocked && navigate(`/courses/${course._id}`)}
            >
              <div className="course-icon-wrap" style={{ background: colors.bg }}>
                <span style={{ fontSize: 32 }}>{course.icon}</span>
              </div>
              <div className="course-row-body">
                <div className="course-row-title">{course.title}</div>
                {isLocked && <div className="enrollment-coming-soon">🔒 Coming Soon on {enrollmentDate}</div>}
                <div className="course-row-desc">{course.description}</div>
                <div className="course-row-meta">
                  <span className="meta-pill">📖 {course.totalLessons} lessons</span>
                  <span className="meta-pill">⏱ {course.estimatedTime}min</span>
                  <span className="meta-pill" style={{ background: colors.bg, color: colors.color }}>{course.difficulty}</span>
                  <span className="meta-pill">⭐ +{course.xpReward} XP</span>
                </div>
                {!isLocked && (
                  <div className="course-row-progress">
                    <div className="pbar-track-light">
                      <div style={{ height: '100%', width: `${pct}%`, background: colors.color, borderRadius: 10, transition: 'width 0.8s' }} />
                    </div>
                    <span className="mini-pct">{pct}%</span>
                  </div>
                )}
              </div>
              <button 
                className={`btn-primary ${isLocked ? 'btn-disabled' : ''}`} 
                style={{ whiteSpace: 'nowrap', fontSize: 13, opacity: isLocked ? 0.5 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }} 
                onClick={(e) => { 
                  e.stopPropagation();
                  if (!isLocked) navigate(`/courses/${course._id}`);
                }}
                disabled={isLocked}
              >
                {isLocked ? 'Locked' : pct === 0 ? 'Start' : pct === 100 ? 'Review' : 'Continue'} →
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ color: 'rgba(10,10,20,0.45)', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>No courses found.</p>
        )}
      </div>
    </>
  );
}
