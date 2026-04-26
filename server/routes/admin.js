const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Activity = require('../models/Activity');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');
const { ExamAttempt } = require('../models/Exam');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// ── STATS ──
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalCerts, unreadMsgs, recentActivity] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isActive: true }),
      Certificate.countDocuments({ status: 'pending' }),
      Message.countDocuments({ status: 'unread' }),
      Activity.find().sort({ createdAt: -1 }).limit(30).populate('user', 'name initials'),
    ]);
    const totalXP = await User.aggregate([{ $group: { _id: null, sum: { $sum: '$xp' } } }]);

    // Completion stats per course
    const completionStats = await Progress.aggregate([
      { $group: { _id: '$course', avg: { $avg: '$percentComplete' }, completed: { $sum: { $cond: ['$isCompleted', 1, 0] } }, total: { $sum: 1 } } }
    ]);
    const courses = await Course.find({ isActive: true }, 'title icon category');
    const statsWithTitles = completionStats.map(s => {
      const c = courses.find(c => c._id.toString() === s._id?.toString());
      return { ...s, courseTitle: c?.title, courseIcon: c?.icon, courseCategory: c?.category };
    });

    res.json({ totalUsers, totalCourses, totalXP: totalXP[0]?.sum || 0, pendingCerts: totalCerts, unreadMsgs, recentActivity, completionStats: statsWithTitles });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── USERS ──
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Progress.deleteMany({ user: req.params.id });
    await Activity.deleteMany({ user: req.params.id });
    await Message.deleteMany({ from: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── STUDENT GRADES (all exam results) ──
router.get('/grades', async (req, res) => {
  try {
    const attempts = await ExamAttempt.find()
      .populate('student', 'name initials email')
      .populate('course', 'title icon category')
      .populate('exam', 'title passingScore')
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── STUDENT PROGRESS (per student per course) ──
router.get('/progress', async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate('user', 'name initials email')
      .populate('course', 'title icon category totalLessons')
      .sort({ updatedAt: -1 });
    res.json(progress);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── CERTIFICATES ──
router.get('/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate('student', 'name initials email')
      .populate('course', 'title icon category')
      .sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/certificates/:id/approve', async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    ).populate('student', 'name email').populate('course', 'title');
    res.json(cert);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/certificates/:id/reject', async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(cert);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/certificates/:id/upload', async (req, res) => {
  try {
    const { issuedBy, issuedByTitle, adminSignature } = req.body;
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { issuedBy, issuedByTitle, adminSignature, uploadedAt: new Date() },
      { new: true }
    ).populate('student', 'name email').populate('course', 'title');
    res.json(cert);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── MESSAGES ──
router.get('/messages', async (req, res) => {
  try {
    const msgs = await Message.find().populate('from', 'name initials email').sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/messages/:id/read', async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    res.json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/messages/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied', repliedAt: new Date() },
      { new: true }
    ).populate('from', 'name email');
    res.json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── COURSES ──
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json(newCourse);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Progress.deleteMany({ course: req.params.id });
    res.json({ message: 'Course deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
