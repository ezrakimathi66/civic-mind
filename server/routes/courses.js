const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/courses
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    let courses = await Course.find(filter).select('-lessons');
    
    // Add enrollment status to each course
    const now = new Date();
    courses = courses.map(course => {
      const courseObj = course.toObject();
      const isEnrollmentOpen = courseObj.enrollmentOpen && new Date(courseObj.enrollmentStartDate) <= now;
      courseObj.isEnrollmentOpen = isEnrollmentOpen;
      courseObj.enrollmentStatus = isEnrollmentOpen ? 'open' : 'closed';
      return courseObj;
    });
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if enrollment is open for students (admins can always access)
    if (req.user.role !== 'admin') {
      const now = new Date();
      const isEnrollmentOpen = course.enrollmentOpen && new Date(course.enrollmentStartDate) <= now;
      
      if (!isEnrollmentOpen) {
        return res.status(403).json({
          message: 'This course is not yet available for enrollment',
          enrollmentStartDate: course.enrollmentStartDate,
          enrollmentStatus: 'closed'
        });
      }
    }
    
    const courseObj = course.toObject();
    courseObj.isEnrollmentOpen = true;
    res.json(courseObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/courses (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @PUT /api/courses/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @DELETE /api/courses/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Course deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
