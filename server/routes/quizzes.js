const express = require('express');
const router = express.Router();
const { Quiz, QuizAttempt } = require('../models/Quiz');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/quizzes
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).populate('course', 'title');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/quizzes/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/quizzes/:id/attempt — submit quiz
router.post('/:id/attempt', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.3);

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      passed,
      answers,
      xpEarned,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpEarned } });

    await Activity.create({
      user: req.user._id,
      type: passed ? 'quiz_passed' : 'lesson_complete',
      title: `${passed ? 'Quiz Passed' : 'Quiz Attempted'}: ${quiz.title}`,
      meta: `Score: ${score}%`,
      xpEarned,
    });

    res.json({ score, passed, xpEarned, attempt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/quizzes (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
