const express = require('express');
const router = express.Router();
const Course = require('../models/courses');

// Create a new course
router.post('/courses', async (req, res) => {
  const { title, description, teacher } = req.body;
  try {
    const newCourse = new Course({ title, description, teacher });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher').populate('students');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific course by ID
router.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate('teacher').populate('students');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a course
router.put('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
