const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/weed - expects image or data, forwards to your ML API
router.post('/', async (req, res) => {
  // Placeholder: forward to your trained API
  // Example: const result = await axios.post('YOUR_WEED_API_URL', req.body);
  res.json({ message: 'Forward to your weed identification API here.' });
});

module.exports = router;
