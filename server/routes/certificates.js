const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @GET /api/certificates — student's own certificates
router.get('/', protect, async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user._id })
      .populate('course', 'title icon category color')
      .sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// @POST /api/certificates/request/:courseId — student requests cert after completing course
router.post('/request/:courseId', protect, async (req, res) => {
  try {
    const prog = await Progress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!prog || !prog.isCompleted)
      return res.status(400).json({ message: 'You must complete the course first.' });

    const existing = await Certificate.findOne({ student: req.user._id, course: req.params.courseId });
    if (existing) return res.status(400).json({ message: 'Certificate already requested.', cert: existing });

    const cert = await Certificate.create({
      student: req.user._id,
      course: req.params.courseId,
      score: req.body.score || prog.percentComplete,
      grade: calcGrade(req.body.score || prog.percentComplete),
    });

    res.status(201).json(await cert.populate('course', 'title icon category color'));
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
