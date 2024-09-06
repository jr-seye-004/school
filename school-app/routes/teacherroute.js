//teacherroute.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');

// Create a new teacher
router.post('/teachers', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newTeacher = new Teacher({ name, email, password });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific teacher by ID
router.get('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a teacher
router.put('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a teacher
router.delete('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Teacher.findByIdAndDelete(id);
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
