const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const requireAuth = require('../middleware/authMiddleware');

const allowedFields = ['name'];

const sanitize = (body) => {
  const data = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

const handleDuplicateKey = (error, res) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({ message: `A record with this ${field} already exists.` });
  }
  res.status(400).json({ message: error.message });
};

router.post('/', requireAuth, async (req, res) => {
  try {
    const department = new Department(sanitize(req.body));
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
