const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const requireAuth = require('../middleware/authMiddleware');

const allowedFields = ['employee', 'grossSalary', 'totalDeduction', 'netSalary', 'month'];

const sanitize = (body) => {
  const data = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (data.grossSalary !== undefined || data.totalDeduction !== undefined) {
    data.netSalary = Number(data.grossSalary || 0) - Number(data.totalDeduction || 0);
  }
  return data;
};

router.post('/', requireAuth, async (req, res) => {
  try {
    const salary = new Salary(sanitize(req.body));
    await salary.save();
    const populated = await Salary.findById(salary._id).populate('employee');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const salaries = await Salary.find().populate('employee');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate('employee');
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true }).populate('employee');
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
