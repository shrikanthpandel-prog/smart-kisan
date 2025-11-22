const express = require('express');
const router = express.Router();

// GET /api/suggestion - Get farming suggestions
router.get('/', async (req, res) => {
  try {
    const { location, crop } = req.query;
    
    // Placeholder: This would provide AI-powered farming suggestions
    // For now, return basic suggestions
    res.json({ 
      message: 'Farming suggestions endpoint',
      suggestions: [
        'Monitor soil moisture regularly',
        'Apply organic fertilizers for better yield',
        'Check weather forecast before irrigation'
      ]
    });
  } catch (error) {
    console.error('Suggestion error:', error.message);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

module.exports = router;
