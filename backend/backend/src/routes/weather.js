const express = require('express');
const axios = require('axios');
const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE = process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// GET /api/weather?lat=12.9716&lon=77.5946 (coordinates)
// OR /api/weather?city=Bangalore (city name)
router.get('/', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweathermap_api_key_here') {
      return res.status(500).json({ 
        error: 'Weather API key not configured',
        message: 'Please add your OpenWeatherMap API key to the .env file. Get one free at: https://openweathermap.org/api'
      });
    }

    let weatherUrl;
    if (lat && lon) {
      weatherUrl = `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (city) {
      weatherUrl = `${WEATHER_API_BASE}/weather?q=${city},IN&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ error: 'Please provide either lat/lon or city' });
    }

    // Fetch current weather
    const currentWeather = await axios.get(weatherUrl);
    
    // Fetch forecast (5-day/3-hour)
    const forecastUrl = lat && lon 
      ? `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      : `${WEATHER_API_BASE}/forecast?q=${city},IN&appid=${WEATHER_API_KEY}&units=metric`;
    
    const forecast = await axios.get(forecastUrl);

    // Format response
    const response = {
      current: {
        temp: currentWeather.data.main.temp,
        feelsLike: currentWeather.data.main.feels_like,
        humidity: currentWeather.data.main.humidity,
        windSpeed: currentWeather.data.wind.speed,
        description: currentWeather.data.weather[0].description,
        icon: currentWeather.data.weather[0].icon,
        location: currentWeather.data.name,
        country: currentWeather.data.sys.country,
      },
      hourly: forecast.data.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        rain: item.pop * 100, // Probability of precipitation
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      })),
      daily: getDailyForecast(forecast.data.list),
      farmingTips: generateFarmingTips(currentWeather.data, forecast.data),
    };

    res.json(response);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'Please check your OpenWeatherMap API key in the .env file'
      });
    }
    res.status(500).json({ 
      error: 'Failed to fetch weather data', 
      details: error.response?.data?.message || error.message 
    });
  }
});

// Helper: Convert 3-hour forecast to daily forecast
function getDailyForecast(forecastList) {
  const dailyMap = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-IN');
    if (!dailyMap[date]) {
      dailyMap[date] = {
        temps: [],
        rain: [],
        icons: [],
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].rain.push(item.pop * 100);
    dailyMap[date].icons.push(item.weather[0].icon);
  });

  return Object.entries(dailyMap).slice(0, 5).map(([date, data]) => ({
    date,
    high: Math.max(...data.temps),
    low: Math.min(...data.temps),
    rain: Math.max(...data.rain),
    icon: data.icons[Math.floor(data.icons.length / 2)], // Mid-day icon
  }));
}

// Helper: Generate farming tips based on weather
function generateFarmingTips(current, forecast) {
  const tips = [];
  
  // Temperature-based tips
  if (current.main.temp > 35) {
    tips.push('High temperature alert: Increase irrigation frequency and provide shade for sensitive crops.');
  } else if (current.main.temp < 15) {
    tips.push('Low temperature: Protect crops from frost. Consider mulching.');
  }
  
  // Rain-based tips
  const upcomingRain = forecast.list.slice(0, 8).some(item => item.pop > 0.6);
  if (upcomingRain) {
    tips.push('Rain expected soon: Postpone pesticide/fertilizer application.');
  } else if (current.main.humidity < 40) {
    tips.push('Low humidity: Increase irrigation to prevent crop stress.');
  }
  
  // Humidity-based tips
  if (current.main.humidity > 80) {
    tips.push('High humidity: Monitor crops for fungal diseases. Ensure good air circulation.');
  }
  
  // Wind-based tips
  if (current.wind.speed > 20) {
    tips.push('Strong winds: Secure young plants and avoid spraying operations.');
  }
  
  // General favorable conditions
  if (tips.length === 0) {
    tips.push('Weather conditions are favorable for normal farming operations.');
    tips.push('Good time for field preparation and planting activities.');
  }
  
  return tips;
}

module.exports = router;
