const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['help', 'report', 'question', 'feedback'], default: 'help' },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  reply: { type: String },
  repliedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
