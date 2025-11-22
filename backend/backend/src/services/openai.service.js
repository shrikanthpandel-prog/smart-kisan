const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze image for crop disease, weed, or soil quality
 * @param {string} imageBase64 - Base64 encoded image
 * @param {string} analysisType - 'crop-disease' | 'weed' | 'soil'
 * @returns {Promise<Object>} Analysis result with treatment and prevention
 */
async function analyzeImage(imageBase64, analysisType = 'crop-disease') {
  try {
    const prompts = {
      'crop-disease': `You are an expert agricultural AI analyzing crop images for diseases. 
Analyze this crop image and provide:
1. Disease name (if any detected)
2. Detailed treatment recommendations for Indian farming conditions
3. Prevention measures
4. Expected timeline for recovery

Format your response as JSON with keys: diseaseName, treatment, prevention, timeline`,

      'weed': `You are an expert agricultural AI analyzing images for weed identification.
Analyze this image and provide:
1. Weed species name (if detected)
2. Control methods suitable for Indian farming
3. Prevention strategies
4. Impact on crops

Format your response as JSON with keys: weedName, treatment, prevention, impact`,

      'soil': `You are an expert agricultural AI analyzing soil quality from images.
Analyze this soil image and provide:
1. Soil quality assessment
2. Recommendations for improvement
3. Suitable crops for this soil type
4. Fertilizer suggestions for Indian farming

Format your response as JSON with keys: soilQuality, treatment, prevention, suitableCrops`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompts[analysisType] || prompts['crop-disease'] },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return {
        className: parsed.diseaseName || parsed.weedName || parsed.soilQuality || 'Analysis Complete',
        treatment: parsed.treatment || 'Consult agricultural expert',
        prevention: parsed.prevention || 'Regular monitoring recommended',
        additionalInfo: parsed.timeline || parsed.impact || parsed.suitableCrops || ''
      };
    } catch (parseError) {
      // If not JSON, return as plain text
      return {
        className: analysisType === 'crop-disease' ? 'Crop Analysis' : 
                   analysisType === 'weed' ? 'Weed Detection' : 'Soil Analysis',
        treatment: content.substring(0, 500),
        prevention: 'Regular monitoring and preventive measures recommended',
        additionalInfo: ''
      };
    }
  } catch (error) {
    console.error('OpenAI Image Analysis Error:', error);
    throw new Error(error.message || 'Failed to analyze image with OpenAI');
  }
}

/**
 * Chat with OpenAI for farmer queries
 * @param {string} userMessage - Farmer's question
 * @param {Array} conversationHistory - Previous messages
 * @returns {Promise<string>} AI response
 */
async function chatWithFarmer(userMessage, conversationHistory = []) {
  try {
    const systemPrompt = `You are Kisan Sathi, an expert agricultural assistant for Indian farmers. 
You provide practical, localized farming advice in a friendly and supportive manner.

IMPORTANT RULES:
1. ONLY answer farming-related queries about: crops, soil, weather, irrigation, fertilizers, pesticides, seeds, harvesting, market prices, government schemes, agricultural techniques, pest control, disease management, etc.
2. If the user asks about anything NOT related to farming/agriculture, respond EXACTLY with: "Please ask farming based query"
3. Provide concise, actionable advice suitable for Indian farming conditions
4. Use simple language that farmers can easily understand
5. When relevant, mention organic/sustainable farming practices
6. Consider local Indian climate and soil conditions in your advice

Remember: You are here to help farmers succeed. Be supportive, practical, and focused on farming topics only.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Chat Error:', error);
    throw new Error(error.message || 'Failed to get response from OpenAI');
  }
}

/**
 * Get weather-based farming advice
 * @param {Object} weatherData - Current weather data
 * @returns {Promise<string>} Weather-based advice
 */
async function getWeatherAdvice(weatherData) {
  try {
    const prompt = `Based on this weather data for an Indian farm:
Temperature: ${weatherData.temp}°C
Humidity: ${weatherData.humidity}%
Conditions: ${weatherData.description}
Rain chance: ${weatherData.rainChance || 'N/A'}

Provide brief, actionable farming advice (2-3 sentences) for today's activities.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: 'You are an agricultural weather advisor for Indian farmers.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Weather Advice Error:', error);
    return 'Monitor weather conditions and adjust farming activities accordingly.';
  }
}

module.exports = {
  analyzeImage,
  chatWithFarmer,
  getWeatherAdvice
};
