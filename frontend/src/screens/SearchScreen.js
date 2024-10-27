// src/screens/SearchScreen.js
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
    ridingType: '', // New parameter for XC, etc.
    difficultyLevel: '', // New parameter for בינוני, etc.
    distance: '',
    area: ''
  });

  // Get unique values for filters
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [uniqueRidingTypes, setUniqueRidingTypes] = useState([]);
  const [uniqueDifficultyLevels, setUniqueDifficultyLevels] = useState([]);

  // Function to split difficulty string into riding type and level
  const splitDifficulty = (difficulty) => {
    if (!difficulty) return { ridingType: '', difficultyLevel: '' };
    const parts = difficulty.split(',').map(part => part.trim());
    return {
      ridingType: parts[0] || '',
      difficultyLevel: parts[1] || parts[0] // If no comma, use the whole string as level
    };
  };

  // Fetch all trails initially to get unique values
  useEffect(() => {
    const fetchAllTrails = async () => {
      try {
        const data = await trailService.getAllTrails();
        const areas = [...new Set(data.features.map(trail => trail.properties.area))];
        
        // Get unique riding types and difficulty levels
        const difficultyPairs = data.features.map(trail => 
          splitDifficulty(trail.properties.difficulty)
        );
        
        const ridingTypes = [...new Set(difficultyPairs.map(d => d.ridingType))].filter(Boolean);
        const difficultyLevels = [...new Set(difficultyPairs.map(d => d.difficultyLevel))].filter(Boolean);
        
        setUniqueAreas(areas);
        setUniqueRidingTypes(ridingTypes);
        setUniqueDifficultyLevels(difficultyLevels);
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
      const validTrails = data.features.filter(trail => 
        trail && 
        trail.geometry && 
        trail.geometry.coordinates && 
        trail.geometry.coordinates.length > 0 &&
        trail.properties
      );
      setTrails(validTrails);
    } catch (error) {
      console.error('Error fetching trails:', error);
      setTrails([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrails();
  }, [filters]);

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
              {trails.map((trail) => {
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