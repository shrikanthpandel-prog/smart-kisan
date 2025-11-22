import api from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Weather Service
 * Handles weather data fetching from backend API
 */

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    location: string;
    country: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    rain: number;
    icon: string;
    description: string;
  }>;
  daily: Array<{
    date: string;
    high: number;
    low: number;
    rain: number;
    icon: string;
  }>;
  farmingTips: string[];
}

/**
 * Get weather data by coordinates
 */
export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
  const response = await api.get(`${API_ENDPOINTS.WEATHER.GET_ADVICE}?lat=${lat}&lon=${lon}`);
  return response.data;
}

/**
 * Get weather data by city name
 */
export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const response = await api.get(`${API_ENDPOINTS.WEATHER.GET_ADVICE}?city=${city}`);
  return response.data;
}

/**
 * Get current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      enableHighAccuracy: true,
    });
  });
}
