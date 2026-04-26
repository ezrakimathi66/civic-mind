import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Quizzes.css';

const CATEGORY_COLORS = {
  safety: { bg: '#d1fae5', color: '#10b981' },
  ethics: { bg: '#ede9fe', color: '#4f46e5' },
  privacy: { bg: '#fef3c7', color: '#f59e0b' },
  cyberbullying: { bg: '#fee2e2', color: '#ef4444' },
  literacy: { bg: '#f3e8ff', color: '#8b5cf6' },
};

export default function Quizzes() {
  const { updateUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/quizzes').then(({ data }) => { setQuizzes(data); setLoading(false); });
  }, []);

  const startQuiz = (quiz) => {
    setActive(quiz);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setResult(null);
    setStep(0);
  };

  const selectAnswer = (qIdx, aIdx) => {
    const updated = [...answers];
    updated[qIdx] = aIdx;
    setAnswers(updated);
  };

  const submitQuiz = async () => {
    if (answers.some((a) => a === null)) return alert('Please answer all questions first.');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/quizzes/${active._id}/attempt`, { answers });
      setResult(data);
      updateUser({ xp: undefined });
    } catch (err) {
      alert('Error submitting quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = active?.questions[step];

  // Group quizzes by course
  const grouped = quizzes.reduce((acc, quiz) => {
    const courseTitle = quiz.course?.title || 'General';
    const courseId = quiz.course?._id || 'general';
    if (!acc[courseId]) acc[courseId] = { title: courseTitle, quizzes: [], category: quiz.course?.category };
    acc[courseId].quizzes.push(quiz);
    return acc;
  }, {});

  const categories = ['all', 'safety', 'ethics', 'privacy', 'cyberbullying', 'literacy'];
  const filtered = filter === 'all' ? quizzes : quizzes.filter(q => q.course?.category === filter);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header fade-up fade-up-1">
        <div>
          <h1 className="page-title">✏️ Quizzes</h1>
          <p className="page-sub">Test your knowledge per course and earn XP rewards</p>
        </div>
        <div className="quiz-count-badge">{quizzes.length} quizzes available</div>
      </div>

      {!active ? (
        <>
          {/* Category Filter */}
          <div className="filter-chips fade-up fade-up-2">
            {categories.map((cat) => (
              <button key={cat} className={`chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat === 'all' ? '⊞ All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Grouped by course */}
          {filter === 'all' ? (
            <div className="quiz-courses-grouped fade-up fade-up-3">
              {Object.entries(grouped).map(([courseId, group]) => {
                const colors = CATEGORY_COLORS[group.category] || { bg: '#ede9fe', color: '#4f46e5' };
                return (
                  <div key={courseId} className="quiz-course-group">
                    <div className="quiz-course-label" style={{ background: colors.bg, color: colors.color }}>
                      📚 {group.title}
                    </div>
                    <div className="quiz-list-grid">
                      {group.quizzes.map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} colors={colors} onStart={startQuiz} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.keys(grouped).length === 0 && (
                <p style={{ color: 'rgba(10,10,20,0.45)', fontSize: 14 }}>No quizzes available yet.</p>
              )}
            </div>
          ) : (
            <div className="quiz-list-grid fade-up fade-up-3">
              {filtered.map((quiz) => {
                const colors = CATEGORY_COLORS[quiz.course?.category] || { bg: '#ede9fe', color: '#4f46e5' };
                return <QuizCard key={quiz._id} quiz={quiz} colors={colors} onStart={startQuiz} />;
              })}
              {filtered.length === 0 && (
                <p style={{ color: 'rgba(10,10,20,0.45)', fontSize: 14 }}>No quizzes in this category.</p>
              )}
            </div>
          )}
        </>
      ) : result ? (
        <div className="quiz-result fade-up fade-up-1">
          <div className={`result-badge ${result.passed ? 'passed' : 'failed'}`}>
            {result.passed ? '🎉 Passed!' : '📚 Keep Studying'}
          </div>
          <div className="result-score">{result.score}%</div>
          <p className="result-desc">
            {result.passed
              ? `Great job! You earned +${result.xpEarned} XP.`
              : `You earned +${result.xpEarned} XP for trying. Review the material and try again!`}
          </p>
          {/* Show answer review */}
          <div className="result-review">
            <div className="result-review-title">Answer Review</div>
            {active.questions.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              return (
                <div key={i} className={`review-item ${correct ? 'correct' : 'wrong'}`}>
                  <div className="review-q">{i + 1}. {q.text}</div>
                  <div className="review-a">
                    {correct ? '✅' : '❌'} Your answer: <strong>{q.options[answers[i]]}</strong>
                    {!correct && <span className="review-correct"> · Correct: {q.options[q.correctIndex]}</span>}
                  </div>
                  {q.explanation && <div className="review-exp">💡 {q.explanation}</div>}
                </div>
              );
            })}
          </div>
          <div className="result-actions">
            <button className="btn-primary" onClick={() => { setActive(null); setResult(null); }}>Back to Quizzes</button>
            <button className="btn-secondary" onClick={() => startQuiz(active)}>Try Again</button>
          </div>
        </div>
      ) : (
        <div className="quiz-runner fade-up fade-up-1">
          <div className="quiz-runner-header">
            <div>
              <div className="quiz-runner-course">{active.course?.title}</div>
              <div className="quiz-runner-title">{active.title}</div>
            </div>
            <div className="quiz-runner-progress">{step + 1} / {active.questions.length}</div>
          </div>
          <div className="quiz-progress-bar">
            <div style={{ height: '100%', width: `${((step + 1) / active.questions.length) * 100}%`, background: 'var(--electric)', borderRadius: 10, transition: 'width 0.4s' }} />
          </div>
          <div className="question-block">
            <div className="question-text">{currentQ?.text}</div>
            <div className="options-list">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn ${answers[step] === i ? 'selected' : ''}`}
                  onClick={() => selectAnswer(step, i)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-nav">
            <button className="btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Previous</button>
            {step < active.questions.length - 1 ? (
              <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={answers[step] === null}>Next →</button>
            ) : (
              <button className="btn-primary" onClick={submitQuiz} disabled={submitting || answers[step] === null}>
                {submitting ? 'Submitting…' : 'Submit Quiz ✓'}
              </button>
            )}
          </div>
          <button className="quit-btn" onClick={() => setActive(null)}>Quit Quiz</button>
        </div>
      )}
    </>
  );
}

function QuizCard({ quiz, colors, onStart }) {
  return (
    <div className="quiz-list-card">
      <div className="quiz-list-top">
        <div className="quiz-list-icon-box" style={{ background: colors.bg, color: colors.color }}>🎯</div>
        <div>
          <div className="quiz-list-title">{quiz.title}</div>
          <div className="quiz-list-meta">{quiz.questions?.length || 0} questions · +{quiz.xpReward} XP · Pass at {quiz.passingScore}%</div>
          {quiz.course?.title && <div className="quiz-course-badge" style={{ background: colors.bg, color: colors.color }}>{quiz.course.title}</div>}
        </div>
      </div>
      <button className="btn-quiz-start" onClick={() => onStart(quiz)}>Start Quiz →</button>
    </div>
  );
}
