import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetail.css';

const TABS = ['lessons', 'study-notes', 'exam', 'resources'];
const TAB_LABELS = { lessons: '📖 Lessons', 'study-notes': '📝 Study Notes', exam: '🎓 Final Exam', resources: '🔗 Resources' };

function calcGradeColor(g) {
  if (g === 'A') return '#059669'; if (g === 'B') return '#4f46e5';
  if (g === 'C') return '#f59e0b'; if (g === 'D') return '#f97316'; return '#ef4444';
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [examData, setExamData] = useState(null);    // { exam, attempt }
  const [certData, setCertData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [tab, setTab] = useState('lessons');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState('');
  const [accessError, setAccessError] = useState(null);
  // Exam state
  const [examStep, setExamStep] = useState(0);
  const [examAnswers, setExamAnswers] = useState([]);
  const [examResult, setExamResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestingCert, setRequestingCert] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, pRes, eRes, certRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get(`/api/progress/${id}`),
          axios.get(`/api/exams/course/${id}`),
          axios.get('/api/certificates'),
        ]);
        setCourse(cRes.data);
        setProgress(pRes.data);
        setExamData(eRes.data);
        const myCert = certRes.data.find(c => c.course?._id === id || c.course === id);
        setCertData(myCert || null);
      } catch (err) {
        if (err.response?.status === 403) {
          setAccessError({
            message: err.response.data.message,
            enrollmentStartDate: err.response.data.enrollmentStartDate
          });
        } else {
          console.error(err);
        }
      }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const completeLesson = async (lessonIndex) => {
    setCompleting(true);
    try {
      const { data } = await axios.post(`/api/progress/${id}/lesson`, { lessonIndex });
      setProgress(data);
      flash(`✅ Lesson ${lessonIndex + 1} completed! +10 XP`);
    } catch (err) { flash('Error saving progress.'); }
    finally { setCompleting(false); }
  };

  const flash = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const startExam = () => {
    if (!examData?.exam) return;
    setExamAnswers(new Array(examData.exam.questions.length).fill(null));
    setExamStep(0);
    setExamResult(null);
  };

  const submitExam = async () => {
    if (examAnswers.some(a => a === null)) return flash('Please answer all questions first.');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/exams/${examData.exam._id}/attempt`, { answers: examAnswers });
      setExamResult(data);
      setExamData(ed => ({ ...ed, attempt: data }));
      flash(data.passed ? `🎉 Exam passed! Grade: ${data.grade}` : `📚 Score: ${data.score}% — Keep studying!`);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.data?.attempt) { setExamData(ed => ({ ...ed, attempt: err.response.data.attempt })); }
      flash(msg || 'Error submitting exam.');
    } finally { setSubmitting(false); }
  };

  const requestCert = async () => {
    const score = examData?.attempt?.score || progress?.percentComplete;
    setRequestingCert(true);
    try {
      const { data } = await axios.post(`/api/certificates/request/${id}`, { score });
      setCertData(data);
      flash('🎓 Certificate request submitted! Awaiting admin approval.');
    } catch (err) {
      flash(err.response?.data?.message || 'Error requesting certificate.');
    } finally { setRequestingCert(false); }
  };

  const isLessonDone = (idx) => progress?.completedLessons?.includes(idx);
  const pct = progress?.percentComplete || 0;
  const currentQ = examData?.exam?.questions?.[examStep];
  const attempt = examData?.attempt;
  const examStarted = examAnswers.length > 0 && !attempt;

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (accessError) {
    const enrollDate = new Date(accessError.enrollmentStartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return (
      <div className="course-detail fade-up fade-up-1">
        <button className="back-btn" onClick={() => navigate('/courses')}>← Back to Courses</button>
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius)', padding: '32px 24px', textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>Course Not Yet Available</h2>
          <p style={{ fontSize: '16px', color: 'rgba(10,10,20,0.65)', marginBottom: '4px' }}>{accessError.message}</p>
          <p style={{ fontSize: '14px', color: 'var(--amber)', fontWeight: 600, marginTop: '12px' }}>📅 Available from: {enrollDate}</p>
        </div>
      </div>
    );
  }
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="course-detail fade-up fade-up-1">
      <button className="back-btn" onClick={() => navigate('/courses')}>← Back to Courses</button>

      {/* Hero Banner */}
      <div className="course-hero" style={{ background: course.colorBg || '#ede9fe' }}>
        <div className="course-hero-content">
          <div className="course-hero-icon">{course.icon}</div>
          <div>
            <div className="course-category-tag">{course.category}</div>
            <h1 className="course-hero-title">{course.title}</h1>
            <p className="course-hero-desc">{course.description}</p>
            <div className="course-meta-row">
              <span className="meta-pill">📖 {course.totalLessons} lessons</span>
              <span className="meta-pill">⏱ {course.estimatedTime} min</span>
              <span className="meta-pill">{course.difficulty}</span>
              <span className="meta-pill">⭐ +{course.xpReward} XP</span>
              <span className="meta-pill">📅 2 weeks · Week 3 exam</span>
            </div>
          </div>
        </div>
        <div className="course-progress-pill">
          <div className="pbar-track-light"><div style={{ height:'100%',width:`${pct}%`,background:course.color||'#4f46e5',borderRadius:10,transition:'width 0.8s' }} /></div>
          <span className="mini-pct">{pct}% complete</span>
        </div>
      </div>

      {message && <div className="success-banner">{message}</div>}

      {/* Certificate Status Bar */}
      {certData && (
        <div className={`cert-status-bar ${certData.status}`}>
          {certData.status === 'pending' && '⏳ Certificate request pending — awaiting approval from Sir Ezra Kimanthi'}
          {certData.status === 'approved' && `✅ Certificate approved! ID: ${certData.certificateId} — Go to Certificates to print it.`}
          {certData.status === 'rejected' && '❌ Certificate request was not approved. Contact your admin.'}
        </div>
      )}

      {/* TABS */}
      <div className="course-tabs">
        {TABS.map(t => (
          <button key={t} className={`course-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
            {t === 'exam' && attempt && <span className={`tab-grade ${attempt.passed ? 'pass' : 'fail'}`}>{attempt.grade}</span>}
          </button>
        ))}
      </div>

      {/* ── LESSONS TAB ── */}
      {tab === 'lessons' && (
        <div className="lessons-section">
          <div className="lessons-week-label">📅 2-Week Schedule — 1 lesson per day, Mon–Fri</div>
          {[1, 2].map(week => {
            const weekLessons = course.lessons?.filter(l => l.week === week) || course.lessons?.slice((week-1)*5, week*5) || [];
            return (
              <div key={week} className="week-block">
                <div className="week-heading">Week {week}</div>
                {weekLessons.map((lesson, idx) => {
                  const globalIdx = course.lessons?.findIndex(l => l.title === lesson.title) ?? idx;
                  const done = isLessonDone(globalIdx);
                  return (
                    <div key={globalIdx} className={`lesson-item ${activeLesson === globalIdx ? 'expanded' : ''} ${done ? 'done' : ''}`}
                         onClick={() => setActiveLesson(activeLesson === globalIdx ? null : globalIdx)}>
                      <div className="lesson-item-header">
                        <div className="lesson-num">{done ? '✅' : globalIdx + 1}</div>
                        <div className="lesson-item-title">{lesson.title}</div>
                        <div className="lesson-duration">⏱ {lesson.duration} min</div>
                        {lesson.videoUrl && <div className="lesson-video-badge">🎬</div>}
                        <div className="lesson-chevron">{activeLesson === globalIdx ? '▲' : '▼'}</div>
                      </div>
                      {activeLesson === globalIdx && (
                        <div className="lesson-body">
                          <p className="lesson-content">{lesson.content}</p>
                          {lesson.notes && (
                            <div className="lesson-notes-box">
                              <div className="lesson-notes-label">📝 Study Notes</div>
                              <div className="lesson-notes-text">{lesson.notes}</div>
                            </div>
                          )}
                          {lesson.videoUrl && (
                            <div className="lesson-video-link">
                              <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-video">
                                🎬 Watch Video Lesson (Optional)
                              </a>
                            </div>
                          )}
                          <div className="lesson-actions">
                            {!done ? (
                              <button className="btn-primary" style={{ fontSize:13,padding:'10px 20px' }}
                                onClick={(e) => { e.stopPropagation(); completeLesson(globalIdx); }}
                                disabled={completing}>
                                {completing ? 'Saving…' : 'Mark as Complete ✓'}
                              </button>
                            ) : <span className="done-label">✅ Completed</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* ── STUDY NOTES TAB ── */}
      {tab === 'study-notes' && (
        <div className="study-notes-section">
          <div className="study-notes-header">
            <h2 className="study-notes-title">📝 {course.title} — Complete Study Guide</h2>
            <button className="btn-secondary" onClick={() => {
              const win = window.open('', '_blank');
              win.document.write(`<html><head><title>${course.title} Study Guide</title></head><body><pre style="font-family:sans-serif;padding:40px;max-width:800px;margin:auto;line-height:1.7">${course.studyGuide || ''}</pre><script>window.onload=()=>window.print()<\/script></body></html>`);
              win.document.close();
            }}>🖨 Print Guide</button>
          </div>
          {course.studyGuide ? (
            <div className="study-guide-content">
              {course.studyGuide.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h2 key={i} className="sg-h1">{line.replace('# ','')}</h2>;
                if (line.startsWith('## ')) return <h3 key={i} className="sg-h2">{line.replace('## ','')}</h3>;
                if (line.startsWith('### ')) return <h4 key={i} className="sg-h3">{line.replace('### ','')}</h4>;
                if (line.startsWith('- ')) return <div key={i} className="sg-bullet">• {line.replace('- ','').replace(/\*\*(.*?)\*\*/g,'$1')}</div>;
                if (/^\d+\./.test(line)) return <div key={i} className="sg-numbered">{line}</div>;
                if (line.trim() === '') return <div key={i} style={{height:10}} />;
                return <p key={i} className="sg-para">{line.replace(/\*\*(.*?)\*\*/g,'$1')}</p>;
              })}
            </div>
          ) : <p style={{ color:'rgba(10,10,20,0.45)',fontSize:14 }}>Study guide not available for this course yet.</p>}

          {/* Per-lesson notes */}
          <div className="per-lesson-notes">
            <h3 className="pln-heading">📋 Lesson-by-Lesson Notes</h3>
            {course.lessons?.map((lesson, idx) => (
              <div key={idx} className="pln-item">
                <div className="pln-num">{idx + 1}</div>
                <div className="pln-body">
                  <div className="pln-title">{lesson.title}</div>
                  {lesson.notes ? <div className="pln-notes">{lesson.notes}</div> : <div className="pln-notes muted">No notes for this lesson.</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EXAM TAB ── */}
      {tab === 'exam' && (
        <div className="exam-section">
          {!examData?.exam && (
            <div className="exam-unavailable">
              <div style={{ fontSize:48,marginBottom:12 }}>📋</div>
              <h3>No exam available yet</h3>
              <p>The final exam for this course hasn't been set up. Complete all lessons and check back.</p>
            </div>
          )}

          {examData?.exam && !attempt && !examStarted && (
            <div className="exam-intro-card">
              <div className="exam-intro-icon">📝</div>
              <div className="exam-intro-title">{examData.exam.title}</div>
              <div className="exam-intro-desc">{examData.exam.description}</div>
              <div className="exam-info-pills">
                <span className="exam-pill">❓ {examData.exam.questions?.length} questions</span>
                <span className="exam-pill">⏱ {examData.exam.duration} minutes</span>
                <span className="exam-pill">✅ Pass at {examData.exam.passingScore}%</span>
                <span className="exam-pill">📅 Week 3</span>
              </div>
              {pct < 80 && <div className="exam-warning">⚠️ Recommended: Complete at least 80% of lessons before taking the exam. You're at {pct}%.</div>}
              <button className="btn-primary exam-start-btn" onClick={startExam}>Start Exam →</button>
            </div>
          )}

          {/* Taking the exam */}
          {examData?.exam && examStarted && !attempt && !examResult && (
            <div className="exam-runner">
              <div className="exam-runner-header">
                <div className="exam-runner-title">{examData.exam.title}</div>
                <div className="exam-runner-prog">{examStep + 1} / {examData.exam.questions.length}</div>
              </div>
              <div className="exam-prog-bar">
                <div style={{ height:'100%',width:`${((examStep+1)/examData.exam.questions.length)*100}%`,background:'var(--electric)',borderRadius:10,transition:'width 0.4s' }} />
              </div>
              <div className="question-text">{currentQ?.text}</div>
              <div className="options-list">
                {currentQ?.options.map((opt, i) => (
                  <button key={i} className={`option-btn ${examAnswers[examStep] === i ? 'selected' : ''}`}
                    onClick={() => { const a=[...examAnswers]; a[examStep]=i; setExamAnswers(a); }}>
                    <span className="option-letter">{String.fromCharCode(65+i)}</span>{opt}
                  </button>
                ))}
              </div>
              <div className="exam-nav">
                <button className="btn-secondary" onClick={() => setExamStep(Math.max(0,examStep-1))} disabled={examStep===0}>← Previous</button>
                {examStep < examData.exam.questions.length - 1
                  ? <button className="btn-primary" onClick={() => setExamStep(examStep+1)} disabled={examAnswers[examStep]===null}>Next →</button>
                  : <button className="btn-primary" onClick={submitExam} disabled={submitting||examAnswers[examStep]===null}>{submitting?'Submitting…':'Submit Exam ✓'}</button>}
              </div>
              <button className="quit-btn" onClick={() => { setExamAnswers([]); setExamStep(0); }}>Cancel Exam</button>
            </div>
          )}

          {/* Exam result */}
          {(attempt || examResult) && (() => {
            const res = attempt || examResult;
            return (
              <div className="exam-result-card">
                <div className={`result-badge-big ${res.passed ? 'passed' : 'failed'}`}>
                  {res.passed ? '🎉 Exam Passed!' : '📚 Keep Studying'}
                </div>
                <div className="result-score-display" style={{ color: calcGradeColor(res.grade) }}>{res.score}%</div>
                <div className="result-grade-badge" style={{ background: calcGradeColor(res.grade)+'18', color: calcGradeColor(res.grade) }}>Grade: {res.grade}</div>
                <p className="result-desc">
                  {res.passed
                    ? `Excellent work! You passed with ${res.score}%. You are now eligible to request your certificate.`
                    : `You scored ${res.score}%. The passing score is ${examData.exam.passingScore}%. Review the study notes and lessons and try the quiz again.`}
                </p>
                <div className="result-cert-section">
                  {res.passed && !certData && (
                    <button className="btn-primary cert-req-btn" onClick={requestCert} disabled={requestingCert}>
                      {requestingCert ? 'Requesting…' : '🎓 Request Certificate'}
                    </button>
                  )}
                  {certData && (
                    <div className={`cert-mini-status ${certData.status}`}>
                      {certData.status==='pending' && '⏳ Certificate pending admin approval — ID: '+certData.certificateId}
                      {certData.status==='approved' && '✅ Certificate approved! Go to the Certificates page to print it.'}
                      {certData.status==='rejected' && '❌ Certificate was not approved. Contact your admin.'}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── RESOURCES TAB ── */}
      {tab === 'resources' && (
        <div className="course-resources-section">
          {course.usefulLinks?.length > 0 && (
            <>
              <h3 className="cr-heading">🔗 Useful Links for This Course</h3>
              <div className="cr-links-list">
                {course.usefulLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="cr-link-row">
                    <span className="cr-link-icon">🔗</span>
                    <div className="cr-link-body">
                      <div className="cr-link-title">{link.title}</div>
                      <div className="cr-link-desc">{link.description}</div>
                    </div>
                    <span className="cr-link-arrow">→</span>
                  </a>
                ))}
              </div>
            </>
          )}
          <div className="cr-video-note">
            <h3 className="cr-heading">🎬 Video Lessons</h3>
            <p style={{ fontSize:14,color:'rgba(10,10,20,0.55)',marginBottom:16 }}>Video lessons are available for this course in the Resources section. They are optional — for additional learning support.</p>
            <button className="btn-secondary" onClick={() => navigate('/resources')}>View All Video Lessons →</button>
          </div>
        </div>
      )}
    </div>
  );
}
