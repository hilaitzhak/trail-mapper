const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get trail by ID
router.get('/trails/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        CASE 
          WHEN COUNT(tc.id) = 0 THEN NULL
          ELSE json_agg(
            json_build_array(tc.longitude, tc.latitude)
            ORDER BY tc.sequence_num
          )
        END as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      WHERE t.trail_id = $1
      GROUP BY t.id, t.trail_id, t.name, t.area, t.riding_type, t.difficulty_level,
               t.distance, t.time, t.creator, t.date_created, t.has_gps, t.detail_url
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trail not found' });
    }

    const trail = result.rows[0];

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
    const result = await pool.query(`
      SELECT 
        t.*,
        CASE 
          WHEN COUNT(tc.id) = 0 THEN NULL
          ELSE json_agg(
            json_build_array(tc.longitude, tc.latitude)
            ORDER BY tc.sequence_num
          )
        END as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      GROUP BY t.id, t.trail_id, t.name, t.area, t.riding_type, t.difficulty_level,
               t.distance, t.time, t.creator, t.date_created, t.has_gps, t.detail_url
    `);

    const features = result.rows.map(trail => ({
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