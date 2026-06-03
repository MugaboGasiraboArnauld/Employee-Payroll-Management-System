const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, employeeId } = req.body;
    const exist = await User.findOne({ username });
    if (exist) return res.status(400).json({ message: 'Username already exists!' });
    const hashed = await bcrypt.hash(password, 10);
    const userData = { username, password: hashed };
    if (employeeId) userData.employee = employeeId;
    const user = await User.create(userData);
    res.status(201).json({ message: 'User created successfully!', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user!', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate('employee');
    if (!user) return res.status(404).json({ message: 'User Not Found!' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Password does not match!' });
    req.session.userId = user._id;
    const userData = { username: user.username };
    if (user.employee) {
      userData.firstName = user.employee.firstName;
      userData.lastName = user.employee.lastName;
    }
    res.status(200).json({ message: 'Logged in!', user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logout successful' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
  res.json({ userId: req.session.userId });
});

module.exports = router;
