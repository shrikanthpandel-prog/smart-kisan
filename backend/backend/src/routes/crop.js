const express = require('express');
const Crop = require('../models/Crop');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

// List a crop for sale
router.post('/', auth, async (req, res) => {
  try {
    const { name, quantity, price, description, location } = req.body;
    const crop = new Crop({ user: req.user.id, name, quantity, price, description, location });
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all crops for sale
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find({ isSold: false });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark crop as sold
router.patch('/:id/sell', auth, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, user: req.user.id });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    crop.isSold = true;
    await crop.save();
    res.json({ message: 'Crop marked as sold' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
