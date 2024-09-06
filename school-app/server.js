//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const studentroutes = require('./routes/studentroutes');
const teacherroute = require('./routes/teacherroute');
const courseroute = require('./routes/courseroute');
const paymentroutes = require('./routes/paymentroutes');

// Use routes
app.use('/api', studentroutes);
app.use('/api', teacherroute);
app.use('/api', courseroute);
app.use('/api', paymentroutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Définition du schéma et du modèle Student
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  dob: { type: Date, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Student = mongoose.model('Student', studentSchema);

// Route pour obtenir tous les étudiants
app.get('/api/Students', (req, res) => {
  Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route pour enregistrer un nouvel étudiant
app.post('/api/Students', (req, res) => {
  const { name, email, className, dob } = req.body;

  const newStudent = new Student({
    name,
    email,
    className,
    dob,
  });

  newStudent.save()
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Définition du schéma et du modèle Teacher
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Route pour obtenir tous les enseignants
app.get('/api/Teachers', (req, res) => {
  Teacher.find()
    .populate('courses')
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route pour enregistrer un nouvel enseignant
app.post('/api/Teachers', (req, res) => {
  const { name, email, courses } = req.body;

  const newTeacher = new Teacher({
    name,
    email,
    courses,
  });

  newTeacher.save()
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json('Error: ' + err));
});


app.post('/api/Payments', async (req, res) => {
  const { student, amount, status, method } = req.body;

  try {
    // Logique pour traiter le paiement avec la méthode choisie
    if (method === 'orange-money') {
      // Intégrer Orange Money ici
    } else if (method === 'wave') {
      // Intégrer Wave ici
    }

    const payment = new Payment({ student, amount, status });
    const newPayment = await payment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Route pour récupérer tous les cours
app.get('/api/Courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer un nouveau cours
app.post('/api/Courses', async (req, res) => {
  const { title, teacher, cycle } = req.body;
  const course = new Course({
    title,
    teacher,
    cycle,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour récupérer un cours spécifique par son ID (si nécessaire)
app.get('/api/Courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour mettre à jour un cours par son ID (si nécessaire)
app.put('/api/courses/:id', async (req, res) => {
  const { title, teacher, cycle } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.teacher = teacher || course.teacher;
    course.cycle = cycle || course.cycle;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer un cours par son ID (si nécessaire)
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.remove();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
