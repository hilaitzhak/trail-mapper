// frontend/src/services/trailService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const trailService = {
  getAllTrails: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trails`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all trails:', error);
      throw error;
    }
  },

  getTrailById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trails/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trail by id:', error);
      throw error;
    }
  },

  filterTrails: async (filters) => {
    try {
      const params = new URLSearchParams();
      // Add the new split parameters
      if (filters.ridingType) params.append('ridingType', filters.ridingType);
      if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
      if (filters.distance) params.append('distance', filters.distance);
      if (filters.area) params.append('area', filters.area);
      
      const response = await axios.get(`${API_BASE_URL}/trails/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering trails:', error);
      throw error;
    }
  }
};