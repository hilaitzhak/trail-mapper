const express = require('express');
const router = express.Router();
const TrailService = require('../services/trailService');

// Get trail by ID
router.get('/trails/:id', async (req, res) => {
  try {
    const trail = await TrailService.getTrailById(req.params.id);

    if (!trail) {
      return res.status(404).json({ error: 'Trail not found' });
    }

    // Format response to match GeoJSON structure
    const response = {
      type: "Feature",
      properties: {
        id: trail.trail_id,
        name: trail.name,
        area: trail.area,
        difficulty: `${trail.riding_type}${trail.difficulty_level ? `, ${trail.difficulty_level}` : ''}`,
        distance: trail.distance,
        time: trail.time,
        creator: trail.creator,
        date: trail.date_created,
        hasGps: trail.has_gps,
        detailUrl: trail.detail_url
      },
      geometry: trail.coordinates ? {
        type: "LineString",
        coordinates: trail.coordinates
      } : null
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /trails/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all trails
router.get('/trails', async (req, res) => {
  try {
    const trails = await TrailService.getAllTrails();

    const features = trails.map(trail => ({
      type: "Feature",
      properties: {
        id: trail.trail_id,
        name: trail.name,
        area: trail.area,
        difficulty: `${trail.riding_type}${trail.difficulty_level ? `, ${trail.difficulty_level}` : ''}`,
        distance: trail.distance,
        time: trail.time,
        creator: trail.creator,
        date: trail.date_created,
        hasGps: trail.has_gps,
        detailUrl: trail.detail_url
      },
      geometry: trail.coordinates ? {
        type: "LineString",
        coordinates: trail.coordinates
      } : null
    }));

    res.json({
      type: "FeatureCollection",
      features
    });
  } catch (error) {
    console.error('Error in /trails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;