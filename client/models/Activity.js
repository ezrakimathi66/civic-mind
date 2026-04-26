const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['lesson_complete', 'quiz_passed', 'module_started', 'streak', 'badge_earned', 'certificate_earned'],
      required: true,
    },
    title: { type: String, required: true },
    meta: { type: String },
    xpEarned: { type: Number, default: 0 },
    badge: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
