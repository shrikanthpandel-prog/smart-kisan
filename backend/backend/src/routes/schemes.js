const express = require('express');
const router = express.Router();
const GovernmentScheme = require('../models/GovernmentScheme');

// GET /api/schemes - Get all active schemes
router.get('/', async (req, res) => {
  try {
    const { state, category } = req.query;
    const filter = { active: true };
    
    if (state) filter.$or = [{ state }, { state: null }];
    if (category) filter.category = category;
    
    const schemes = await GovernmentScheme.find(filter).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/schemes/:id - Get scheme details
router.get('/:id', async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/schemes - Create new scheme (admin only)
router.post('/', async (req, res) => {
  try {
    const scheme = new GovernmentScheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
