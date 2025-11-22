import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, GEMINI_PROMPTS } from '@/config/gemini.config';

/**
 * Gemini Service
 * Handles AI chat interactions with Google Gemini API
 */

let genAI: GoogleGenerativeAI | null = null;

/**
 * Initialize Gemini AI
 */
function initializeGemini() {
  if (!genAI && GEMINI_CONFIG.apiKey) {
    genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
  }
  return genAI;
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return true; // Backend handles configuration
}

/**
 * Chat with Gemini for Kisan Sathi
 */
export async function chatWithGemini(
  previousMessages: Array<{ text: string; sender: 'user' | 'bot' }>,
  userMessage: string
): Promise<{ response: string }> {
  try {
    // Call OpenAI backend
    const res = await fetch('http://localhost:5000/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userMessage,
        history: previousMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      })
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();
    return { response: data.reply };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Failed to get response from AI');
  }
}

/**
 * Analyze image with Gemini (for AI Scanner)
 */
export async function analyzeImageWithGemini(
  imageData: string,
  detectedClass: string
): Promise<{ analysis: string; treatment: string; prevention: string }> {
  try {
    // Call OpenAI backend for image analysis
    const res = await fetch('http://localhost:5000/api/openai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: imageData,
        analysisType: 'crop-disease'
      })
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();
    return {
      analysis: data.className || detectedClass,
      treatment: data.treatment || 'Consult agricultural expert',
      prevention: data.prevention || 'Regular monitoring recommended'
    };
  } catch (error: any) {
    console.error('OpenAI Image Analysis Error:', error);
    throw new Error(error.message || 'Failed to analyze image');
  }
}
