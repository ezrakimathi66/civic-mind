const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, unique: true, default: () => 'CIVIC-' + uuidv4().slice(0,8).toUpperCase() },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  issuedBy: { type: String, default: 'Sir Ezra Kimanthi' },
  issuedByTitle: { type: String, default: 'Project Manager, CivicMind' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedAt: { type: Date },
  score: { type: Number },
  grade: { type: String },
  fileUrl: { type: String },           // Admin-uploaded certificate file URL
  adminSignature: { type: String },    // Admin signature text or image URL
  issuedBy: { type: String, default: 'Sir Ezra Kimanthi' },
  issuedByTitle: { type: String, default: 'Project Manager, CivicMind' },

module.exports = mongoose.model('Certificate', certificateSchema);
