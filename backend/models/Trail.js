const { query } = require('../config/db');

class Trail {
  static async getTrailById(trailId) {
    const result = await query(`
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
    `, [trailId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async getAllTrails() {
    const result = await query(`
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

    return result.rows;
  }
}

module.exports = Trail;