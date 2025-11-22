/**
 * Gemini API Configuration
 * 
 * Configure your Google Gemini API here
 */

export const GEMINI_CONFIG = {
  // 👇 PASTE YOUR GEMINI API KEY HERE
  // Get your API key from: https://makersuite.google.com/app/apikey
  apiKey: "AIzaSyCgnKGc37ci-YORIomPs-U7vs-IEZk28A0",
  
  // Model configuration
  model: "gemini-1.5-flash", // Latest Gemini Flash model
  
  // Generation settings
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  
  // Safety settings
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};

/**
 * System prompts for different use cases
 */
export const GEMINI_PROMPTS = {
  kisanSathi: `You are Kisan Sathi, an expert agricultural assistant for Indian farmers. You provide practical, localized farming advice in a friendly and supportive manner.

IMPORTANT RULES:
1. ONLY answer farming-related queries about: crops, soil, weather, irrigation, fertilizers, pesticides, seeds, harvesting, market prices, government schemes, agricultural techniques, pest control, disease management, etc.
2. If the user asks about anything NOT related to farming/agriculture, respond EXACTLY with: "Please ask farming based query"
3. Provide concise, actionable advice suitable for Indian farming conditions
4. Use simple language that farmers can easily understand
5. When relevant, mention organic/sustainable farming practices
6. Consider local Indian climate and soil conditions in your advice

Remember: You are here to help farmers succeed. Be supportive, practical, and focused on farming topics only.`,

  aiScanner: `You are an expert agricultural AI analyzing crop images. Based on the detected class from the image classification model, provide:
1. Detailed explanation of the detected condition (disease/health/weed)
2. Specific treatment recommendations
3. Prevention measures
4. Expected timeline for recovery/action
5. Additional tips for Indian farming conditions

Be specific, practical, and consider local Indian agricultural practices.`,
};
