const pool = require('../config/db');

const trailService = {
  // Create a new trail
  createTrail: async (trailData) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert trail data
      const { rows: [trail] } = await client.query(`
        INSERT INTO trails (
          trail_id, name, area, riding_type, difficulty_level,
          distance, time, creator, date_created, has_gps, detail_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        trailData.id,
        trailData.name,
        trailData.area,
        trailData.ridingType,
        trailData.difficultyLevel,
        trailData.distance,
        trailData.time,
        trailData.creator,
        new Date(trailData.date),
        trailData.hasGps,
        trailData.detailUrl
      ]);

      // Insert coordinates if they exist
      if (trailData.coordinates && trailData.coordinates.length > 0) {
        for (let i = 0; i < trailData.coordinates.length; i++) {
          const [longitude, latitude] = trailData.coordinates[i];
          await client.query(`
            INSERT INTO trail_coordinates (trail_id, longitude, latitude, sequence_num)
            VALUES ($1, $2, $3, $4)
          `, [trailData.id, longitude, latitude, i]);
        }
      }

      await client.query('COMMIT');
      return trail;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get all trails
  getAllTrails: async () => {
    const { rows: trails } = await pool.query(`
      SELECT 
        t.*,
        json_agg(
          json_build_array(tc.longitude, tc.latitude)
          ORDER BY tc.sequence_num
        ) as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      GROUP BY t.id
    `);
    return trails;
  },

  // Get trail by ID
  getTrailById: async (trailId) => {
    const { rows } = await pool.query(`
      SELECT 
        t.*,
        json_agg(
          json_build_array(tc.longitude, tc.latitude)
          ORDER BY tc.sequence_num
        ) as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      WHERE t.trail_id = $1
      GROUP BY t.id
    `, [trailId]);
    return rows[0];
  }
};

module.exports = trailService;