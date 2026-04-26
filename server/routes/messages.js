const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @GET /api/messages — student gets their own messages
router.get('/', protect, async (req, res) => {
  try {
    const msgs = await Message.find({ from: req.user._id }).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// @POST /api/messages — student sends message to admin
router.post('/', protect, async (req, res) => {
  try {
    const { subject, body, type } = req.body;
    if (!subject || !body) return res.status(400).json({ message: 'Subject and body required.' });
    const msg = await Message.create({ from: req.user._id, subject, body, type: type || 'help' });
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
