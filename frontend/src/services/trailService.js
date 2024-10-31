import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const trailService = {
  getAllTrails: async () => {
    try {
      console.log('Fetching trails from API...');
      const response = await axios.get(`${API_BASE_URL}/trails`);
      console.log('Raw API response:', response.data);
      console.log('Received trails:', response.data.features.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching trails:', error);
      throw error;
    }
  },

  filterTrails: async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.ridingType) params.append('ridingType', filters.ridingType);
      if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
      if (filters.distance) params.append('distance', filters.distance);
      if (filters.area) params.append('area', filters.area);
      
      const response = await axios.get(`${API_BASE_URL}/trails/search?${params}`);
      console.log('Filter response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error filtering trails:', error);
      throw error;
    }
  },

  getTrailById: async (id) => {
    try {
      console.log(`Fetching trail with ID: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/trails/${id}`);
      console.log('Received trail data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching trail by id:', error);
      throw error;
    }
  }
};