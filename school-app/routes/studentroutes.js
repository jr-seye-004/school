// studentroutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Create a new student
router.post('/Students', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newStudent = new Student({ name, email, password });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
router.get('/Students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a student
router.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
