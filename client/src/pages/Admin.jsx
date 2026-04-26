import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const TABS = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'courses', label: '📚 Courses' },
  { key: 'students', label: '👥 Students' },
  { key: 'grades', label: '📝 Grades & Exams' },
  { key: 'certificates', label: '🎓 Certificates' },
  { key: 'messages', label: '💬 Messages' },
  { key: 'progress', label: '📈 Course Progress' },
];

function gradeColor(grade) {
  if (grade === 'A') return '#059669'; if (grade === 'B') return '#4f46e5';
  if (grade === 'C') return '#f59e0b'; if (grade === 'D') return '#f97316'; return '#ef4444';
}

const EMPTY_COURSE = {
  title: '', description: '', category: 'safety', icon: '📘',
  difficulty: 'Beginner', totalLessons: 10, estimatedTime: 60, xpReward: 150,
  isActive: true, enrollmentOpen: true, startDate: '', endDate: '',
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [certs, setCerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [adminCourses, setAdminCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  // Course management
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  // Certificate upload
  const [certUpload, setCertUpload] = useState({});
  const [certUploadTarget, setCertUploadTarget] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [s, u, g, c, m, p, ac] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/grades'),
        axios.get('/api/admin/certificates'),
        axios.get('/api/admin/messages'),
        axios.get('/api/admin/progress'),
        axios.get('/api/admin/courses'),
      ]);
      setStats(s.data); setStudents(u.data); setGrades(g.data);
      setCerts(c.data); setMessages(m.data); setProgressData(p.data);
      setAdminCourses(ac.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const msg = (text, duration = 3500) => { setFlash(text); setTimeout(() => setFlash(''), duration); };

  const approveCert = async (id) => {
    const { data } = await axios.put(`/api/admin/certificates/${id}/approve`);
    setCerts(c => c.map(x => x._id === id ? data : x));
    msg(`✅ Certificate approved for ${data.student?.name}`);
  };
  const rejectCert = async (id) => {
    const { data } = await axios.put(`/api/admin/certificates/${id}/reject`);
    setCerts(c => c.map(x => x._id === id ? data : x));
    msg('❌ Certificate rejected.');
  };
  const uploadCert = async (id) => {
    const { issuedBy, issuedByTitle, adminSignature } = certUpload[id] || {};
    const { data } = await axios.put(`/api/admin/certificates/${id}/upload`, {
      issuedBy: issuedBy || 'Sir Ezra Kimanthi',
      issuedByTitle: issuedByTitle || 'Project Manager, CivicMind',
      adminSignature: adminSignature || '',
    });
    setCerts(c => c.map(x => x._id === id ? data : x));
    setCertUploadTarget(null);
    msg(`✅ Certificate details saved for ${data.student?.name}`);
  };

  const markRead = async (id) => {
    const { data } = await axios.put(`/api/admin/messages/${id}/read`);
    setMessages(m => m.map(x => x._id === id ? data : x));
  };
  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    const { data } = await axios.put(`/api/admin/messages/${id}/reply`, { reply: replyText });
    setMessages(m => m.map(x => x._id === id ? data : x));
    setReplyTarget(null); setReplyText('');
    msg(`✅ Reply sent to ${data.from?.name}`);
  };
  const deleteStudent = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This is permanent.`)) return;
    await axios.delete(`/api/admin/users/${id}`);
    setStudents(s => s.filter(x => x._id !== id));
    msg(`🗑 ${name} deleted`);
  };

  // Course CRUD
  const openCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course._id);
      setCourseForm({
        ...EMPTY_COURSE, ...course,
        startDate: course.startDate ? course.startDate.slice(0, 10) : '',
        endDate: course.endDate ? course.endDate.slice(0, 10) : '',
      });
    } else {
      setEditingCourse(null);
      setCourseForm(EMPTY_COURSE);
    }
    setShowCourseModal(true);
  };
  const saveCourse = async () => {
    try {
      const payload = { ...courseForm };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;
      if (editingCourse) {
        const { data } = await axios.put(`/api/admin/courses/${editingCourse}`, payload);
        setAdminCourses(cs => cs.map(x => x._id === editingCourse ? data : x));
        msg('✅ Course updated');
      } else {
        const { data } = await axios.post('/api/admin/courses', payload);
        setAdminCourses(cs => [data, ...cs]);
        msg('✅ Course created');
      }
      setShowCourseModal(false);
    } catch (err) { msg('❌ Error: ' + (err.response?.data?.message || err.message)); }
  };
  const toggleCourse = async (course) => {
    const { data } = await axios.put(`/api/admin/courses/${course._id}`, { isActive: !course.isActive });
    setAdminCourses(cs => cs.map(x => x._id === course._id ? data : x));
    msg(`${data.isActive ? '✅ Course activated' : '⏸ Course deactivated'}: ${data.title}`);
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const pendingCertsCount = certs.filter(c => c.status === 'pending').length;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div>
          <div className="admin-badge">👑 Admin Panel — Sir Ezra Kimanthi, Project Manager</div>
          <h1 className="admin-main-title">CivicMind Management Dashboard</h1>
        </div>
        <div className="admin-header-meta">
          <span className="admin-meta-chip">{students.length} Students</span>
          {unreadCount > 0 && <span className="admin-meta-chip urgent">{unreadCount} New Messages</span>}
          {pendingCertsCount > 0 && <span className="admin-meta-chip pending">{pendingCertsCount} Pending Certs</span>}
        </div>
      </div>

      {flash && <div className="admin-flash">{flash}</div>}

      <div className="kpi-grid">
        {[
          { label: 'Total Students', val: students.length, icon: '👥', color: '#4f46e5', bg: '#ede9fe' },
          { label: 'Active Courses', val: stats?.totalCourses || 0, icon: '📚', color: '#10b981', bg: '#d1fae5' },
          { label: 'Exam Submissions', val: grades.length, icon: '📝', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Pending Certs', val: pendingCertsCount, icon: '🎓', color: pendingCertsCount > 0 ? '#f59e0b' : '#10b981', bg: '#f3e8ff' },
          { label: 'Unread Messages', val: unreadCount, icon: '💬', color: unreadCount > 0 ? '#ef4444' : 'var(--ink)', bg: '#ffedd5' },
          { label: 'Total XP Earned', val: (stats?.totalXP || 0).toLocaleString(), icon: '⭐', color: '#ef4444', bg: '#fee2e2' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.color }}>
            <div className="kpi-icon" style={{ background: k.bg }}>{k.icon}</div>
            <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`admin-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            {t.key === 'messages' && unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
            {t.key === 'certificates' && pendingCertsCount > 0 && <span className="tab-badge pending">{pendingCertsCount}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="tab-content">
          <div className="overview-grid">
            <div className="panel">
              <div className="panel-title">📊 Course Completion Overview</div>
              {!stats?.completionStats?.length && <p className="empty-txt">No course progress recorded yet.</p>}
              {stats?.completionStats?.map((s, i) => (
                <div key={i} className="completion-row">
                  <div className="cr-icon">{s.courseIcon || '📘'}</div>
                  <div className="cr-body">
                    <div className="cr-title">{s.courseTitle || 'Unknown Course'}</div>
                    <div className="cr-bar-row">
                      <div className="cr-bar-track"><div className="cr-bar-fill" style={{ width: `${Math.round(s.avg || 0)}%` }} /></div>
                      <span className="cr-pct">{Math.round(s.avg || 0)}% avg</span>
                    </div>
                    <div className="cr-meta">{s.completed} completed · {s.total} enrolled</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel">
              <div className="panel-title">🕐 Recent Activity</div>
              {stats?.recentActivity?.map(act => (
                <div key={act._id} className="act-row">
                  <div className="act-dot">{act.type === 'lesson_complete' ? '✅' : act.type === 'quiz_passed' ? '🎯' : '📖'}</div>
                  <div className="act-body">
                    <div className="act-title">{act.title}</div>
                    <div className="act-meta">
                      <span className="act-user">{act.user?.name || '?'}</span>
                      {' · '}{new Date(act.createdAt).toLocaleString()}
                      {act.xpEarned > 0 && <span className="act-xp">+{act.xpEarned} XP</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES ── */}
      {tab === 'courses' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title-row">
              <div className="panel-title">Course Management ({adminCourses.length})</div>
              <button className="btn-primary btn-sm" onClick={() => openCourseModal()}>+ Add Course</button>
            </div>
            {adminCourses.length === 0 && <p className="empty-txt">No courses yet. Click Add Course to create one.</p>}
            <div className="courses-admin-list">
              {adminCourses.map(c => (
                <div key={c._id} className={`course-admin-row ${!c.isActive ? 'inactive' : ''}`}>
                  <div className="car-icon" style={{ background: c.colorBg || '#ede9fe' }}>{c.icon}</div>
                  <div className="car-body">
                    <div className="car-title">{c.title} {!c.isActive && <span className="inactive-badge">Inactive</span>}</div>
                    <div className="car-meta">
                      <span>{c.category}</span> · <span>{c.difficulty}</span> · <span>{c.totalLessons} lessons</span> · <span>+{c.xpReward} XP</span>
                    </div>
                    <div className="car-dates">
                      {c.startDate && <span>📅 Starts: {new Date(c.startDate).toLocaleDateString()}</span>}
                      {c.endDate && <span> · Ends: {new Date(c.endDate).toLocaleDateString()}</span>}
                      {!c.startDate && <span className="muted-txt">No start date set</span>}
                    </div>
                    <div className="car-enrollment">
                      Enrollment: <span className={c.enrollmentOpen ? 'open-badge' : 'closed-badge'}>{c.enrollmentOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>
                  <div className="car-actions">
                    <button className="tb-btn secondary" onClick={() => openCourseModal(c)}>✏️ Edit</button>
                    <button className={`tb-btn ${c.isActive ? 'del' : 'approve'}`} onClick={() => toggleCourse(c)}>
                      {c.isActive ? '⏸ Deactivate' : '▶ Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENTS ── */}
      {tab === 'students' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title">All Students ({students.length})</div>
            {students.length === 0 && <p className="empty-txt">No students registered yet.</p>}
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Email</th><th>XP</th><th>Streak</th><th>Badges</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td><div className="td-user"><div className="td-avatar">{s.initials || s.name?.[0]}</div><span>{s.name}</span></div></td>
                      <td className="td-mono">{s.email}</td>
                      <td className="td-xp">{s.xp?.toLocaleString() || 0}</td>
                      <td className="td-mono">🔥 {s.streak || 0}</td>
                      <td>{s.badges?.length || 0} 🏅</td>
                      <td className="td-mono">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td><button className="tb-btn del" onClick={() => deleteStudent(s._id, s.name)}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title">Student Exam Results ({grades.length})</div>
            {grades.length === 0 && <p className="empty-txt">No exams submitted yet.</p>}
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Course</th><th>Exam</th><th>Score</th><th>Grade</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {grades.map(g => (
                    <tr key={g._id}>
                      <td><div className="td-user"><div className="td-avatar">{g.student?.initials || '?'}</div><span>{g.student?.name || 'Unknown'}</span></div></td>
                      <td><span className="course-chip">{g.course?.icon} {g.course?.title}</span></td>
                      <td>{g.exam?.title || 'Final Exam'}</td>
                      <td><strong style={{ color: gradeColor(g.grade) }}>{g.score}%</strong></td>
                      <td><span className="grade-badge" style={{ background: gradeColor(g.grade) + '22', color: gradeColor(g.grade) }}>{g.grade}</span></td>
                      <td><span className={`status-chip ${g.passed ? 'passed' : 'failed'}`}>{g.passed ? '✅ Passed' : '❌ Failed'}</span></td>
                      <td className="td-mono">{new Date(g.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATES ── */}
      {tab === 'certificates' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title">Certificate Requests ({certs.length})</div>
            {certs.length === 0 && <p className="empty-txt">No certificate requests yet.</p>}
            <div className="certs-list">
              {certs.map(c => (
                <div key={c._id} className={`cert-row ${c.status}`}>
                  <div className="cert-icon">{c.course?.icon || '🎓'}</div>
                  <div className="cert-body">
                    <div className="cert-student">{c.student?.name || 'Unknown Student'}</div>
                    <div className="cert-course">{c.course?.title || 'Unknown Course'}</div>
                    <div className="cert-meta">
                      ID: <strong>{c.certificateId}</strong>
                      {c.score != null && <> · Score: <strong style={{ color: gradeColor(c.grade) }}>{c.score}% ({c.grade})</strong></>}
                      {' · '}{new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="cert-status-col">
                    <span className={`cert-status-chip ${c.status}`}>
                      {c.status === 'pending' ? '⏳ Pending' : c.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                    </span>
                    {c.status === 'approved' && c.approvedAt && (
                      <div className="cert-approved-date">Approved {new Date(c.approvedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="cert-actions">
                    {c.status === 'pending' && (
                      <>
                        <button className="tb-btn approve" onClick={() => approveCert(c._id)}>✅ Approve</button>
                        <button className="tb-btn del" onClick={() => rejectCert(c._id)}>❌ Reject</button>
                      </>
                    )}
                    {c.status === 'approved' && (
                      <button className="tb-btn secondary" onClick={() => setCertUploadTarget(certUploadTarget === c._id ? null : c._id)}>
                        ✍️ Set Signatory
                      </button>
                    )}
                  </div>
                  {/* Signatory Upload Panel */}
                  {certUploadTarget === c._id && (
                    <div className="cert-upload-panel">
                      <div className="cup-title">Set Certificate Signatory for <strong>{c.student?.name}</strong></div>
                      <div className="cup-fields">
                        <div className="cup-field">
                          <label>Issued By (Name)</label>
                          <input
                            placeholder="Sir Ezra Kimanthi"
                            value={certUpload[c._id]?.issuedBy || ''}
                            onChange={e => setCertUpload(u => ({ ...u, [c._id]: { ...u[c._id], issuedBy: e.target.value } }))}
                          />
                        </div>
                        <div className="cup-field">
                          <label>Title / Role</label>
                          <input
                            placeholder="Project Manager, CivicMind"
                            value={certUpload[c._id]?.issuedByTitle || ''}
                            onChange={e => setCertUpload(u => ({ ...u, [c._id]: { ...u[c._id], issuedByTitle: e.target.value } }))}
                          />
                        </div>
                        <div className="cup-field">
                          <label>Admin Signature Text</label>
                          <input
                            placeholder="e.g. E. Kimanthi"
                            value={certUpload[c._id]?.adminSignature || ''}
                            onChange={e => setCertUpload(u => ({ ...u, [c._id]: { ...u[c._id], adminSignature: e.target.value } }))}
                          />
                        </div>
                      </div>
                      <div className="cup-actions">
                        <button className="tb-btn approve" onClick={() => uploadCert(c._id)}>💾 Save</button>
                        <button className="tb-btn secondary" onClick={() => setCertUploadTarget(null)}>Cancel</button>
                      </div>
                      <p className="cup-note">Student will be able to print/download the certificate with your name and signature from their Certificates page.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === 'messages' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title">Student Messages ({messages.length}) {unreadCount > 0 && <span className="unread-count">{unreadCount} unread</span>}</div>
            {messages.length === 0 && <p className="empty-txt">No messages yet.</p>}
            <div className="messages-list">
              {messages.map(m => (
                <div key={m._id} className={`msg-card ${m.status}`}>
                  <div className="msg-header">
                    <div className="msg-from">
                      <div className="td-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{m.from?.initials || '?'}</div>
                      <div>
                        <div className="msg-sender">{m.from?.name || 'Unknown'}</div>
                        <div className="msg-email">{m.from?.email}</div>
                      </div>
                    </div>
                    <div className="msg-meta-right">
                      <span className={`msg-type-chip ${m.type}`}>{m.type}</span>
                      <span className={`msg-status-chip ${m.status}`}>
                        {m.status === 'unread' ? '🔴 Unread' : m.status === 'read' ? '👁 Read' : '✅ Replied'}
                      </span>
                      <span className="msg-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="msg-subject">{m.subject}</div>
                  <div className="msg-body">{m.body}</div>
                  {m.reply && (
                    <div className="msg-reply-block">
                      <strong>Your reply:</strong> {m.reply}
                      <div className="msg-reply-date">{m.repliedAt ? new Date(m.repliedAt).toLocaleDateString() : ''}</div>
                    </div>
                  )}
                  <div className="msg-actions">
                    {m.status === 'unread' && <button className="tb-btn secondary" onClick={() => markRead(m._id)}>👁 Mark Read</button>}
                    {m.status !== 'replied' && <button className="tb-btn approve" onClick={() => { setReplyTarget(m._id); setReplyText(''); }}>💬 Reply</button>}
                  </div>
                  {replyTarget === m._id && (
                    <div className="reply-compose">
                      <textarea placeholder="Type your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={3} />
                      <div className="reply-actions">
                        <button className="tb-btn approve" onClick={() => sendReply(m._id)}>Send Reply ✈</button>
                        <button className="tb-btn secondary" onClick={() => setReplyTarget(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS ── */}
      {tab === 'progress' && (
        <div className="tab-content">
          <div className="panel">
            <div className="panel-title">All Student Course Progress</div>
            {progressData.length === 0 && <p className="empty-txt">No progress data yet.</p>}
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Course</th><th>Start Date</th><th>Progress</th><th>Lessons</th><th>Status</th><th>XP</th><th>Last Active</th></tr></thead>
                <tbody>
                  {progressData.map(p => {
                    const course = adminCourses.find(c => c._id === p.course?._id) || p.course;
                    return (
                      <tr key={p._id}>
                        <td><div className="td-user"><div className="td-avatar">{p.user?.initials || '?'}</div><span>{p.user?.name || 'Unknown'}</span></div></td>
                        <td><span className="course-chip">{p.course?.icon} {p.course?.title}</span></td>
                        <td className="td-mono">{course?.startDate ? new Date(course.startDate).toLocaleDateString() : '—'}</td>
                        <td>
                          <div className="prog-bar-row">
                            <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: `${p.percentComplete}%` }} /></div>
                            <span className="prog-pct">{p.percentComplete}%</span>
                          </div>
                        </td>
                        <td className="td-mono">{p.completedLessons?.length || 0}/{p.course?.totalLessons || '?'}</td>
                        <td>
                          <span className={`status-chip ${p.isCompleted ? 'passed' : p.percentComplete > 0 ? 'inprog' : 'notstarted'}`}>
                            {p.isCompleted ? '✅ Complete' : p.percentComplete > 0 ? '⏳ In Progress' : '⭕ Not Started'}
                          </span>
                        </td>
                        <td className="td-xp">{p.xpEarned}</td>
                        <td className="td-mono">{p.lastAccessed ? new Date(p.lastAccessed).toLocaleDateString() : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── COURSE MODAL ── */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-box course-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editingCourse ? '✏️ Edit Course' : '+ New Course'}</div>
            <div className="course-form">
              {[
                { label: 'Title', key: 'title', type: 'text' },
                { label: 'Description', key: 'description', type: 'textarea' },
                { label: 'Icon (emoji)', key: 'icon', type: 'text' },
                { label: 'Total Lessons', key: 'totalLessons', type: 'number' },
                { label: 'Estimated Time (min)', key: 'estimatedTime', type: 'number' },
                { label: 'XP Reward', key: 'xpReward', type: 'number' },
                { label: 'Start Date', key: 'startDate', type: 'date' },
                { label: 'End Date', key: 'endDate', type: 'date' },
              ].map(f => (
                <div key={f.key} className="cf-field">
                  <label>{f.label}</label>
                  {f.type === 'textarea'
                    ? <textarea value={courseForm[f.key] || ''} onChange={e => setCourseForm(cf => ({ ...cf, [f.key]: e.target.value }))} rows={2} />
                    : <input type={f.type} value={courseForm[f.key] || ''} onChange={e => setCourseForm(cf => ({ ...cf, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} />
                  }
                </div>
              ))}
              <div className="cf-row">
                <div className="cf-field">
                  <label>Category</label>
                  <select value={courseForm.category} onChange={e => setCourseForm(cf => ({ ...cf, category: e.target.value }))}>
                    {['safety','ethics','privacy','cyberbullying','literacy'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="cf-field">
                  <label>Difficulty</label>
                  <select value={courseForm.difficulty} onChange={e => setCourseForm(cf => ({ ...cf, difficulty: e.target.value }))}>
                    {['Beginner','Intermediate','Advanced'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="cf-row">
                <label className="cf-toggle">
                  <input type="checkbox" checked={courseForm.isActive} onChange={e => setCourseForm(cf => ({ ...cf, isActive: e.target.checked }))} />
                  Active (visible to students)
                </label>
                <label className="cf-toggle">
                  <input type="checkbox" checked={courseForm.enrollmentOpen} onChange={e => setCourseForm(cf => ({ ...cf, enrollmentOpen: e.target.checked }))} />
                  Enrollment Open
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCourseModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveCourse}>{editingCourse ? 'Save Changes' : 'Create Course'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
