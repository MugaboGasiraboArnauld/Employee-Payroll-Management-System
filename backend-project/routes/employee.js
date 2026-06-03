const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const requireAuth = require('../middleware/authMiddleware');

const allowedFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'email', 'telephone', 'address', 'hireDate', 'status', 'department', 'position'];

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
    const employee = new Employee(sanitize(req.body));
    await employee.save();
    const populated = await Employee.findById(employee._id).populate('department').populate('position');
    res.status(201).json(populated);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const employees = await Employee.find().populate('department').populate('position');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department').populate('position');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true }).populate('department').populate('position');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
