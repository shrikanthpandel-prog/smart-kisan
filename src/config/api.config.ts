/**
 * API Configuration
 * Base URL and settings for backend API
 */

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // Backend API base URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Request timeout (10 seconds)
  timeout: 10000,
  
  // Enable credentials (cookies, auth headers)
  withCredentials: false,
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  
  // Money (Khatabook)
  MONEY: {
    BASE: '/money',
    GET_ALL: '/money',
    ADD: '/money',
  },
  
  // Crop (Marketplace)
  CROP: {
    BASE: '/crop',
    GET_ALL: '/crop',
    ADD: '/crop',
    MARK_SOLD: (id: string) => `/crop/${id}/sell`,
  },
  
  // Market Price
  MARKET: {
    GET_RATES: '/market',
  },
  
  // Weather
  WEATHER: {
    GET_ADVICE: '/weather',
  },
  
  // Disease Detection
  DISEASE: {
    DETECT: '/disease',
  },
  
  // Weed Detection
  WEED: {
    DETECT: '/weed',
  },
  
  // Farming Suggestions
  SUGGESTION: {
    GET: '/suggestion',
  },
};
