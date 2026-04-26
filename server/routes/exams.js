const express = require('express');
const router = express.Router();
const { Exam, ExamAttempt } = require('../models/Exam');
const { protect } = require('../middleware/auth');

// @GET /api/exams/course/:courseId
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const exam = await Exam.findOne({ course: req.params.courseId, isActive: true });
    if (!exam) return res.json(null);
    // Check if student already attempted
    const attempt = await ExamAttempt.findOne({ student: req.user._id, exam: exam._id });
    res.json({ exam, attempt: attempt || null });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// @POST /api/exams/:examId/attempt
router.post('/:examId/attempt', protect, async (req, res) => {
  try {
    const existing = await ExamAttempt.findOne({ student: req.user._id, exam: req.params.examId });
    if (existing) return res.status(400).json({ message: 'You have already taken this exam.', attempt: existing });

    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const { answers } = req.body;
    let correct = 0;
    exam.questions.forEach((q, i) => { if (answers[i] === q.correctIndex) correct++; });
    const score = Math.round((correct / exam.questions.length) * 100);
    const grade = calcGrade(score);
    const passed = score >= exam.passingScore;

    const attempt = await ExamAttempt.create({
      student: req.user._id,
      exam: exam._id,
      course: exam.course,
      answers,
      score,
      grade,
      passed,
    });
    res.json(attempt);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// @GET /api/exams/my-results
router.get('/my-results', protect, async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ student: req.user._id })
      .populate('course', 'title icon category')
      .populate('exam', 'title passingScore')
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

function calcGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

module.exports = router;
