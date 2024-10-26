// frontend/src/screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { trailService } from '../services/trailService';
import { Search, Mountain, Route } from 'lucide-react';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: '',
    distance: '',
    area: ''
  });

  // Get unique areas and difficulties from the data
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [uniqueDifficulties, setUniqueDifficulties] = useState([]);

  // Fetch all trails initially to get unique values
  useEffect(() => {
    const fetchAllTrails = async () => {
      try {
        const data = await trailService.getAllTrails();
        const areas = [...new Set(data.features.map(trail => trail.properties.area))];
        const difficulties = [...new Set(data.features.map(trail => trail.properties.difficulty))];
        
        setUniqueAreas(areas);
        setUniqueDifficulties(difficulties);
      } catch (error) {
        console.error('Error fetching trail data:', error);
      }
    };

    fetchAllTrails();
  }, []);

  const fetchTrails = async () => {
    setLoading(true);
    try {
      const data = await trailService.filterTrails(filters);
      setTrails(data.features);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrails();
  }, [filters]);

  const extractDifficultyLevel = (difficulty) => {
    // Split by comma and get the second part if it exists
    const parts = difficulty.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]" dir="rtl">
      {/* Filters Sidebar */}
      <div className="w-full md:w-80 bg-white p-4 shadow-sm overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">סינון מסלולים</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                רמת קושי
              </label>
              <select 
                className="w-full border rounded-md p-2"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="">כל הרמות</option>
                {uniqueDifficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אזור
              </label>
              <select 
                className="w-full border rounded-md p-2"
                value={filters.area}
                onChange={(e) => setFilters({...filters, area: e.target.value})}
              >
                <option value="">כל האזורים</option>
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מרחק מקסימלי (ק"מ)
              </label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={filters.distance}
                onChange={(e) => setFilters({...filters, distance: e.target.value})}
                placeholder="הכנס מרחק מקסימלי"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map and Results */}
      <div className="flex-1 flex flex-col">
        <div className="h-1/2">
          <MapComponent trails={trails} />
        </div>
        <div className="h-1/2 overflow-y-auto p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            תוצאות חיפוש ({trails.length} מסלולים נמצאו)
          </h3>
          
          {loading ? (
            <div className="text-center py-4">טוען מסלולים...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trails.map((trail) => (
                <div 
                  key={trail.properties.id}
                  className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/trail/${trail.properties.id}`)}
                >
                  <h4 className="font-semibold mb-2">{trail.properties.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mountain className="h-4 w-4 ml-1" />
                      {extractDifficultyLevel(trail.properties.difficulty)}
                    </div>
                    <div className="flex items-center">
                      <Route className="h-4 w-4 ml-1" />
                      {trail.properties.distance} ק"מ
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {trail.properties.area}
                  </div>
                  <div className="text-sm text-gray-500">
                    זמן: {trail.properties.time} שעות
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;