import axios from 'axios';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  getWeatherByCoordinates: async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      return {
        temperature: Math.round(response.data.main.temp),
        feels_like: Math.round(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  getForecast: async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );

      // Process 5-day forecast data
      const forecasts = response.data.list
        .filter((item, index) => index % 8 === 0) // Get one forecast per day
        .map(item => ({
          date: new Date(item.dt * 1000),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          windSpeed: Math.round(item.wind.speed * 3.6),
          precipitation: item.pop * 100 // Probability of precipitation
        }));

      return forecasts;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }
};