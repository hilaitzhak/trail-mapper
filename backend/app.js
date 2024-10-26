// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Function to read trails data
const getTrailsData = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'trails_geojson.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading trails data:', error);
    return null;
  }
};

// Get all trails
app.get('/api/trails', async (req, res) => {
  try {
    const trailsData = await getTrailsData();
    if (!trailsData) {
      return res.status(500).json({ error: 'Error fetching trails data' });
    }
    res.json(trailsData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Filter trails (this should come before the /:id route)
app.get('/api/trails/search', async (req, res) => {
  try {
    const { difficulty, distance, area } = req.query;
    const trailsData = await getTrailsData();
    
    if (!trailsData) {
      return res.status(500).json({ error: 'Error fetching trails data' });
    }

    let filteredTrails = trailsData.features;

    if (difficulty) {
      filteredTrails = filteredTrails.filter(
        trail => trail.properties.difficulty.toLowerCase().includes(difficulty.toLowerCase())
      );
    }

    if (distance) {
      filteredTrails = filteredTrails.filter(
        trail => parseFloat(trail.properties.distance) <= parseFloat(distance)
      );
    }

    if (area) {
      filteredTrails = filteredTrails.filter(
        trail => trail.properties.area.toLowerCase().includes(area.toLowerCase())
      );
    }

    res.json({
      type: "FeatureCollection",
      features: filteredTrails
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get trail by ID
app.get('/api/trails/:id', async (req, res) => {
  try {
    const trailsData = await getTrailsData();
    if (!trailsData) {
      return res.status(500).json({ error: 'Error fetching trails data' });
    }
    
    const trail = trailsData.features.find(
      feature => feature.properties.id === req.params.id
    );
    
    if (!trail) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    
    res.json(trail);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});