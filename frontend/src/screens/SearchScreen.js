import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { trailService } from '../services/trailService';
import { Search, Mountain, Route } from 'lucide-react';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTrails, setAllTrails] = useState([]);
  const [filteredTrails, setFilteredTrails] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    ridingType: '',
    difficultyLevel: '',
    distance: '',
    area: ''
  });

  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [uniqueRidingTypes, setUniqueRidingTypes] = useState([]);
  const [uniqueDifficultyLevels, setUniqueDifficultyLevels] = useState([]);

// Initial data fetch
useEffect(() => {
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      console.log('Fetching initial data...');
      const data = await trailService.getAllTrails();
      console.log('Initial data received:', data);

      if (data && data.features) {
        // Only include trails with GPS data
        const trailsWithGPS = data.features.filter(trail => 
          trail && 
          trail.properties && 
          trail.geometry?.coordinates?.length > 0  // Only trails with GPS
        );
        
        console.log(`Found ${trailsWithGPS.length} trails with GPS data`);
        
        setAllTrails(trailsWithGPS);
        setFilteredTrails(trailsWithGPS);

        // Process unique values from GPS trails only
        const areas = [...new Set(trailsWithGPS.map(trail => trail.properties.area))];
        const difficultyPairs = trailsWithGPS.map(trail => splitDifficulty(trail.properties.difficulty));
        
        const ridingTypes = [...new Set(difficultyPairs.map(d => d.ridingType))].filter(Boolean);
        const difficultyLevels = [...new Set(difficultyPairs.map(d => d.difficultyLevel))].filter(Boolean);

        console.log('Unique values:', { areas, ridingTypes, difficultyLevels });
        
        setUniqueAreas(areas);
        setUniqueRidingTypes(ridingTypes);
        setUniqueDifficultyLevels(difficultyLevels);
      } else {
        console.error('Invalid data format:', data);
        setError('No trail data available');
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load trails');
    } finally {
      setLoading(false);
    }
  };

  fetchInitialData();
}, []);
     // Apply filters whenever they change
  useEffect(() => {
    if (!allTrails.length) return;

    console.log('Applying filters:', filters);
    const filtered = allTrails.filter(trail => {
      const { ridingType: trailRidingType, difficultyLevel: trailDifficultyLevel } = 
        splitDifficulty(trail.properties.difficulty);

      // Check riding type
      if (filters.ridingType && trailRidingType !== filters.ridingType) {
        return false;
      }

      // Check difficulty level
      if (filters.difficultyLevel && trailDifficultyLevel !== filters.difficultyLevel) {
        return false;
      }

      // Check area
      if (filters.area && trail.properties.area !== filters.area) {
        return false;
      }

      // Check distance
      if (filters.distance && parseFloat(trail.properties.distance) > parseFloat(filters.distance)) {
        return false;
      }

      return true;
    });

    console.log(`Filtered trails: ${filtered.length} trails match criteria`);
    setFilteredTrails(filtered);
  }, [filters, allTrails]);
  
  const splitDifficulty = (difficulty) => {
    if (!difficulty) return { ridingType: '', difficultyLevel: '' };
    const parts = difficulty.split(',').map(part => part.trim());
    return {
      ridingType: parts[0] || '',
      difficultyLevel: parts[1] || parts[0]
    };
  };

  // Debug rendering
  console.log('Current state:', {
    trailsCount: trails.length,
    loading,
    error,
    uniqueAreas,
    uniqueRidingTypes,
    uniqueDifficultyLevels
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">טוען מסלולים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]" dir="rtl">
      {/* Filters Sidebar */}
      <div className="w-full md:w-80 bg-white p-4 shadow-sm overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">סינון מסלולים</h2>
          
          <div className="space-y-4">
            {/* Riding Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סוג רכיבה
              </label>
              <select 
                className="w-full border rounded-md p-2"
                value={filters.ridingType}
                onChange={(e) => setFilters({...filters, ridingType: e.target.value})}
              >
                <option value="">כל הסוגים</option>
                {uniqueRidingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                רמת קושי
              </label>
              <select 
                className="w-full border rounded-md p-2"
                value={filters.difficultyLevel}
                onChange={(e) => setFilters({...filters, difficultyLevel: e.target.value})}
              >
                <option value="">כל הרמות</option>
                {uniqueDifficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Area Filter */}
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

            {/* Distance Filter */}
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
          {filteredTrails.length > 0 && (
            <div className="h-full">
              <MapComponent trails={filteredTrails} />
            </div>
          )}
        </div>
        <div className="h-1/2 overflow-y-auto p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            תוצאות חיפוש ({filteredTrails.length} מסלולים נמצאו)
          </h3>
          
          {filteredTrails.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              לא נמצאו מסלולים התואמים את החיפוש
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTrails.map((trail) => {
                const { ridingType, difficultyLevel } = splitDifficulty(trail.properties.difficulty);
                
                return (
                  <div 
                    key={trail.properties.id}
                    className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/trail/${trail.properties.id}`)}
                  >
                    <h4 className="font-semibold mb-2">{trail.properties.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mountain className="h-4 w-4 ml-1" />
                        <span>{ridingType}</span>
                      </div>
                      <div>
                        <span>{difficultyLevel}</span>
                      </div>
                      <div className="flex items-center">
                        <Route className="h-4 w-4 ml-1" />
                        <span>{trail.properties.distance} ק"מ</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {trail.properties.area}
                    </div>
                    <div className="text-sm text-gray-500">
                      זמן: {trail.properties.time} שעות
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;