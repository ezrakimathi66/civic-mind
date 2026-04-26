const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  notes: { type: String },         // Study notes for the lesson
  videoUrl: { type: String },      // Optional video lesson URL
  duration: { type: Number, default: 10 },
  order: { type: Number, required: true },
  week: { type: Number, default: 1 },
  dayOfWeek: { type: Number, default: 1 }, // 1-5 (Mon-Fri)
});

const usefulLinkSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
  description: { type: String },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['safety', 'ethics', 'privacy', 'cyberbullying', 'literacy'],
      required: true,
    },
    icon: { type: String, default: '📘' },
    color: { type: String, default: '#4f46e5' },
    colorBg: { type: String, default: '#ede9fe' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    totalLessons: { type: Number, default: 0 },
    estimatedTime: { type: Number, default: 30 },
    xpReward: { type: Number, default: 100 },
    studyGuide: { type: String },         // Downloadable/printable study guide text
    usefulLinks: [usefulLinkSchema],      // Curated links
    lessons: [lessonSchema],
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    enrollmentStartDate: { type: Date, default: new Date() },
    enrollmentOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
