const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String },
});

const examSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [examQuestionSchema],
  passingScore: { type: Number, default: 60 },
  totalMarks: { type: Number, default: 100 },
  duration: { type: Number, default: 60 }, // minutes
  week: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const examAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [{ type: Number }],
  score: { type: Number },
  grade: { type: String },
  passed: { type: Boolean },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);
module.exports = { Exam, ExamAttempt };
