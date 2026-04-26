const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// @GET /api/progress — all progress for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).populate('course', 'title icon category color colorBg totalLessons');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/progress/:courseId
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!progress) return res.json({ percentComplete: 0, completedLessons: [] });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/progress/:courseId/lesson — mark a lesson complete
router.post('/:courseId/lesson', protect, async (req, res) => {
  try {
    const { lessonIndex } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!progress) {
      progress = new Progress({ user: req.user._id, course: req.params.courseId });
    }

    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    const total = course.totalLessons || 1;
    progress.percentComplete = Math.round((progress.completedLessons.length / total) * 100);
    progress.lastAccessed = new Date();

    if (progress.percentComplete >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      const xpReward = course.xpReward || 100;
      progress.xpEarned += xpReward;
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpReward } });
      await Activity.create({
        user: req.user._id,
        type: 'lesson_complete',
        title: `Completed: ${course.title}`,
        meta: `Course finished`,
        xpEarned: xpReward,
      });
    } else {
      // Partial XP
      const partialXp = 10;
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: partialXp } });
      await Activity.create({
        user: req.user._id,
        type: 'lesson_complete',
        title: `Completed lesson ${lessonIndex + 1} in ${course.title}`,
        xpEarned: partialXp,
      });
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
