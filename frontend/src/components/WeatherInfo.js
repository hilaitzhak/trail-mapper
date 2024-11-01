import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { ThermometerSun, Wind, Droplets, Cloud } from 'lucide-react';

const WeatherInfo = ({ coordinates }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!coordinates || coordinates.length === 0) return;

      setLoading(true);
      try {
        const [longitude, latitude] = coordinates[0];
        const [weatherData, forecastData] = await Promise.all([
          weatherService.getWeatherByCoordinates(latitude, longitude),
          weatherService.getForecast(latitude, longitude)
        ]);

        setWeather(weatherData);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        setError('שגיאה בטעינת נתוני מזג האוויר');
        console.error('Error fetching weather:', err);
      }
      setLoading(false);
    };

    fetchWeatherData();
  }, [coordinates]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">מזג אוויר</h2>
        <div className="text-center py-4">טוען נתוני מזג אוויר...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">מזג אוויר</h2>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Current Weather */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">מזג אוויר נוכחי</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center">
            <ThermometerSun className="h-5 w-5 text-blue-600 ml-3" />
            <div>
              <p className="text-sm text-gray-600">טמפרטורה</p>
              <div className="flex items-baseline">
                <span className="font-semibold text-xl">{weather.temperature}</span>
                <span className="text-sm text-gray-600 mr-1">°C</span>
              </div>
              <p className="text-sm text-gray-500">מרגיש כמו {weather.feels_like}°C</p>
            </div>
          </div>

          <div className="flex items-center">
            <Wind className="h-5 w-5 text-blue-600 ml-3" />
            <div>
              <p className="text-sm text-gray-600">רוח</p>
              <div className="flex items-baseline">
                <span className="font-semibold text-xl">{weather.windSpeed}</span>
                <span className="text-sm text-gray-600 mr-1">קמ"ש</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-600 ml-3" />
            <div>
              <p className="text-sm text-gray-600">לחות</p>
              <div className="flex items-baseline">
                <span className="font-semibold text-xl">{weather.humidity}</span>
                <span className="text-sm text-gray-600 mr-1">%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Cloud className="h-5 w-5 text-blue-600 ml-3" />
            <div>
              <p className="text-sm text-gray-600">מצב</p>
              <p className="font-semibold">{weather.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      {forecast && (
        <div>
          <h3 className="text-lg font-semibold mb-4">תחזית ל-5 ימים</h3>
          <div className="grid grid-cols-1 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <img 
                    src={`http://openweathermap.org/img/w/${day.icon}.png`}
                    alt="Weather icon"
                    className="w-8 h-8 ml-2"
                  />
                  <div>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(day.date)}
                    </p>
                    <p className="text-sm text-gray-600">{day.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{day.temperature}°C</p>
                  <p className="text-sm text-gray-600">{day.windSpeed} קמ"ש</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;