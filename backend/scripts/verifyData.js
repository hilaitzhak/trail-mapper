// const { pool } = require('../config/db');

// async function verifyData() {
//   const client = await pool.connect();
//   try {
//     // Check trails count
//     const trailsCount = await client.query('SELECT COUNT(*) FROM trails');
//     console.log(`Total trails in database: ${trailsCount.rows[0].count}`);

//     // Check coordinates count
//     const coordsCount = await client.query('SELECT COUNT(*) FROM trail_coordinates');
//     console.log(`Total coordinates in database: ${coordsCount.rows[0].count}`);

//     // Sample some trails
//     const sample = await client.query(`
//       SELECT t.*, COUNT(tc.id) as coord_count 
//       FROM trails t 
//       LEFT JOIN trail_coordinates tc ON t.trail_id = tc.trail_id 
//       GROUP BY t.id 
//       LIMIT 3
//     `);

//     console.log('\nSample trails:');
//     sample.rows.forEach(trail => {
//       console.log(`
//         ID: ${trail.trail_id}
//         Name: ${trail.name}
//         Area: ${trail.area}
//         Coordinates: ${trail.coord_count}
//         -------------------
//       `);
//     });

//   } finally {
//     client.release();
//     await pool.end();
//   }
// }

// verifyData().catch(console.error);