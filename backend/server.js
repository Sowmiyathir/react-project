const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(express.static('uploads'));

const jobs = [
  { id: 1, title: "Frontend Developer", company: "ClearCode Labs" },
  { id: 2, title: "Backend Developer", company: "ClearCode Labs" }
];

const applications = [];

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF/DOC allowed'), false);
    }
  }
});

// API Routes
app.get('/jobs', (req, res) => res.json(jobs));

app.post('/apply', upload.array('resumes', 3), (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || req.files.length === 0) {
    return res.status(400).json({ error: 'All fields and at least one file are required' });
  }
  const filePaths = req.files.map(file => file.path);
  applications.push({ name, email, resumes: filePaths });
  res.json({ message: 'Application submitted successfully' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));