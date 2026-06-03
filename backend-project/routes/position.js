const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const requireAuth = require('../middleware/authMiddleware');

const allowedFields = ['name', 'requiredQualification'];

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
    const position = new Position(sanitize(req.body));
    await position.save();
    res.status(201).json(position);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const positions = await Position.find();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true });
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json(position);
  } catch (error) {
    handleDuplicateKey(error, res);
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ message: 'Position not found' });
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
