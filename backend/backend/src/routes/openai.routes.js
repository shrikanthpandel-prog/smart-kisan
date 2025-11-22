const express = require('express');
const router = express.Router();
const { analyzeImage, chatWithFarmer, getWeatherAdvice } = require('../services/openai.service');

/**
 * POST /api/openai/analyze-image
 * Analyze image for crop disease, weed, or soil quality
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, analysisType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const result = await analyzeImage(image, analysisType || 'crop-disease');
    res.json(result);
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze image' });
  }
});

/**
 * POST /api/openai/chat
 * Chat with AI for farmer queries
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatWithFarmer(message, history || []);
    res.json({ reply: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to get chat response' });
  }
});

/**
 * POST /api/openai/weather-advice
 * Get weather-based farming advice
 */
router.post('/weather-advice', async (req, res) => {
  try {
    const { weatherData } = req.body;

    if (!weatherData) {
      return res.status(400).json({ error: 'Weather data is required' });
    }

    const advice = await getWeatherAdvice(weatherData);
    res.json({ advice });
  } catch (error) {
    console.error('Weather advice error:', error);
    res.status(500).json({ error: error.message || 'Failed to get weather advice' });
  }
});

module.exports = router;
