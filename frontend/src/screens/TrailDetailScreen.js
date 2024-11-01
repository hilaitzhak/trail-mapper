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
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

const TrailDetailScreen = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(true);
        const data = await trailService.getTrailById(id);
        console.log('Trail data:', data);
        if (!data) {
          setError('המסלול לא נמצא');
        } else {
          setTrail(data);
        }
      } catch (error) {
        console.error('Error fetching trail:', error);
        setError('שגיאה בטעינת המסלול');
      } finally {
        setLoading(false);
      }
    };

    fetchTrail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">טוען מידע על המסלול...</div>
      </div>
    );
  }

  if (error || !trail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">{error || 'המסלול לא נמצא'}</div>
        <Link 
          to="/search"
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          חזרה לחיפוש
        </Link>
      </div>
    );
  }

  const { ridingType, difficultyLevel } = splitDifficulty(trail.properties.difficulty);
  const hasGPS = trail.geometry?.coordinates?.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">
      <Link 
        to="/search" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4 ml-1" />
        חזרה לחיפוש
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{trail.properties.name}</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {!hasGPS && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-yellow-700">
                      מסלול זה אינו כולל נתוני GPS. המיקום המדויק והתצוגה במפה אינם זמינים.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
            {hasGPS ? (
              <div className="h-[400px] relative rounded-lg overflow-hidden">
                <MapComponent trails={[trail]} centered={true} />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  מסלול זה אינו כולל נתוני GPS. תצוגת המפה אינה זמינה.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weather Info */}
        <div>
          {hasGPS && trail.geometry?.coordinates ? (
            <WeatherInfo coordinates={trail.geometry.coordinates} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">מזג אוויר</h2>
              <div className="text-center text-gray-600">
                מידע על מזג האוויר אינו זמין עבור מסלול זה
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailDetailScreen;