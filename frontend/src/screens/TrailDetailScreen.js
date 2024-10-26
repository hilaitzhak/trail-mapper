// frontend/src/screens/TrailDetailScreen.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trailService } from '../services/trailService';
import MapComponent from '../components/MapComponent';
import { Mountain, Route, Calendar, User } from 'lucide-react';

const TrailDetailScreen = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="text-center py-8">Loading trail information...</div>;
  }

  if (!trail) {
    return <div className="text-center py-8">Trail not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{trail.properties.name}</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <Mountain className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="font-semibold">{trail.properties.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Route className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold">{trail.properties.distance}km</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Creator</p>
                  <p className="font-semibold">{trail.properties.creator}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{trail.properties.date}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-700">{trail.properties.area}</p>
            </div>

            <div className="h-[400px] relative">
              <MapComponent trails={[trail]} centered={true} />
            </div>
          </div>
        </div>

        {/* Weather info section remains the same */}
      </div>
    </div>
  );
};

export default TrailDetailScreen;