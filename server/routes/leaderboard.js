const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/leaderboard
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name initials xp streak badges')
      .sort({ xp: -1 })
      .limit(20);

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      _id: u._id,
      name: u.name,
      initials: u.initials,
      xp: u.xp,
      streak: u.streak,
      badges: u.badges,
      isCurrentUser: u._id.toString() === req.user._id.toString(),
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
