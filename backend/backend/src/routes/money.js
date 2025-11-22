const express = require('express');
const Money = require('../models/Money');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Add income/expense
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    const money = new Money({ user: req.user.id, type, amount, category, note, date });
    await money.save();
    res.status(201).json(money);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all money records for user
router.get('/', auth, async (req, res) => {
  try {
    const records = await Money.find({ user: req.user.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
