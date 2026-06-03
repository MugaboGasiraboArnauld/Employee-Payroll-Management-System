const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const employeeRoutes = require('./routes/employee');
const departmentRoutes = require('./routes/department');
const positionRoutes = require('./routes/position');
const salaryRoutes = require('./routes/salary');
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'hrms_secret_key_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 6 * 24 * 60 * 60 * 1000
  }
}));

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB - HRMS'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
