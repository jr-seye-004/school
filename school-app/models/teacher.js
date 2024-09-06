//teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Teacher = mongoose.model('teacher', teacherSchema);

module.exports = Teacher;
