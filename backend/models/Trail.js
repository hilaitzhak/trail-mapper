const db = require('../config/db');

class Trail {
  static async createTrail(trailData) {
    const { 
      trail_id, name, area, difficulty, 
      distance, time, creator, date_created, 
      has_gps, detail_url 
    } = trailData;

    const query = `
      INSERT INTO trails (
        trail_id, name, area, difficulty, distance, 
        time, creator, date_created, has_gps, detail_url
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      trail_id, name, area, difficulty, distance,
      time, creator, date_created, has_gps, detail_url
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating trail:', error);
      throw error;
    }
  }

  static async addCoordinates(trailId, coordinates) {
    const query = `
      INSERT INTO trail_coordinates (trail_id, longitude, latitude, sequence_num)
      VALUES ($1, $2, $3, $4)
    `;

    try {
      await db.query('BEGIN');
      
      for (let i = 0; i < coordinates.length; i++) {
        const [longitude, latitude] = coordinates[i];
        await db.query(query, [trailId, longitude, latitude, i]);
      }
      
      await db.query('COMMIT');
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error adding coordinates:', error);
      throw error;
    }
  }

  static async getTrailById(trailId) {
    const query = `
      SELECT t.*, 
        json_agg(json_build_array(tc.longitude, tc.latitude)) as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      WHERE t.trail_id = $1
      GROUP BY t.id
    `;

    try {
      const result = await db.query(query, [trailId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting trail:', error);
      throw error;
    }
  }

 static async getAllTrails() {
    const query = `
      SELECT 
        t.*,
        CASE 
          WHEN COUNT(tc.id) = 0 THEN '[]'::json
          ELSE json_agg(
            json_build_array(tc.longitude, tc.latitude)
            ORDER BY tc.sequence_num
          )
        END as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      GROUP BY t.id
      ORDER BY t.id
    `;

    try {
      console.log('Executing getAllTrails query...');
      const result = await db.query(query);
      console.log(`Retrieved ${result.rows.length} trails from database`);
      return result.rows;
    } catch (error) {
      console.error('Error in getAllTrails:', error);
      throw error;
    }
  }
  

  static async filterTrails(filters) {
    let query = `
      SELECT t.*, 
        json_agg(json_build_array(tc.longitude, tc.latitude)) as coordinates
      FROM trails t
      LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.area) {
      query += ` AND t.area = $${paramCount}`;
      values.push(filters.area);
      paramCount++;
    }

    if (filters.difficulty) {
      query += ` AND t.difficulty = $${paramCount}`;
      values.push(filters.difficulty);
      paramCount++;
    }

    if (filters.distance) {
      query += ` AND t.distance <= $${paramCount}`;
      values.push(filters.distance);
      paramCount++;
    }

    query += ` GROUP BY t.id`;

    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error filtering trails:', error);
      throw error;
    }
  }
}

module.exports = Trail;