// frontend/src/screens/TrailDetailScreen.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trailService } from '../services/trailService';
import MapComponent from '../components/MapComponent';
import WeatherInfo from '../components/WeatherInfo';

import { 
  Mountain, 
  Route, 
  Calendar, 
  User, 
  Clock, 
  MapPin, 
  ArrowLeft
} from 'lucide-react';

const TrailDetailScreen = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Split difficulty into riding type and level
  const splitDifficulty = (difficulty) => {
    if (!difficulty) return { ridingType: '', difficultyLevel: '' };
    const parts = difficulty.split(',').map(part => part.trim());
    return {
      ridingType: parts[0] || '',
      difficultyLevel: parts[1] || parts[0]
    };
  };

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const data = await trailService.getTrailById(id);
        setTrail(data);
      } catch (error) {
        console.error('Error fetching trail:', error);
      }
      setLoading(false);
    };

    fetchTrail();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">טוען מידע על המסלול...</div>;
  }

  if (!trail) {
    return <div className="text-center py-8">המסלול לא נמצא</div>;
  }

  const { ridingType, difficultyLevel } = splitDifficulty(trail.properties.difficulty);

  // Mock weather data - replace with actual API call
  const weatherData = {
    temperature: 22,
    windSpeed: 10,
    precipitation: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">
      {/* Back Button */}
      <Link 
        to="/search" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        חזרה לחיפוש
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{trail.properties.name}</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {/* Riding Type */}
              <div className="flex items-center">
                <Mountain className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">אופי הרכיבה</p>
                  <p className="font-semibold">{ridingType}</p>
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="flex items-center">
                <Route className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">רמת קושי</p>
                  <p className="font-semibold">{difficultyLevel}</p>
                </div>
              </div>

              {/* Distance */}
              <div className="flex items-center">
                <Route className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">מרחק</p>
                  <p className="font-semibold">{trail.properties.distance} ק"מ</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">זמן משוער</p>
                  <p className="font-semibold">{trail.properties.time} שעות</p>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">יוצר המסלול</p>
                  <p className="font-semibold">{trail.properties.creator}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 ml-2" />
                <div>
                  <p className="text-sm text-gray-600">תאריך</p>
                  <p className="font-semibold">{trail.properties.date}</p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-blue-600 ml-2" />
                <h2 className="text-xl font-semibold">מיקום</h2>
              </div>
              <p className="text-gray-700">{trail.properties.area}</p>
            </div>

            {/* Map */}
            <div className="h-[400px] relative rounded-lg overflow-hidden">
              <MapComponent trails={[trail]} centered={true} />
            </div>
          </div>
        </div>

        {/* Weather Info */}
        <div>
          {trail.geometry && trail.geometry.coordinates && (
            <WeatherInfo coordinates={trail.geometry.coordinates} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailDetailScreen;