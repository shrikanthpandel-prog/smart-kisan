const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/market?crop=rice&location=city
router.get('/', async (req, res) => {
  const { crop, location } = req.query;
  // Placeholder: fetch market rate from external API or DB
  res.json({ message: 'Fetch live market rate for crop and location here.' });
});

module.exports = router;
