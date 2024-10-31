// backend/scripts/importData.js
const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/db');

// Function to convert DD/MM/YYYY to YYYY-MM-DD
function convertDateFormat(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function importTrails() {
  try {
    const jsonData = await fs.readFile(
      path.join(__dirname, '../trails_geojson.json'),
      'utf8'
    );
    const data = JSON.parse(jsonData);

    console.log(`Starting import of ${data.features.length} trails...`);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Clear existing data
      await client.query('TRUNCATE trails, trail_coordinates CASCADE');
      console.log('Cleared existing data');

      let importedCount = 0;
      for (const feature of data.features) {
        const properties = feature.properties;
        
        // Split difficulty into riding type and difficulty level
        const [ridingType, difficultyLevel] = (properties.difficulty || '').split(',').map(s => s?.trim());

        // Convert date to PostgreSQL format
        const formattedDate = convertDateFormat(properties.date);
        console.log(`Converting date from ${properties.date} to ${formattedDate}`);

        // Insert trail
        const trailQuery = `
          INSERT INTO trails (
            trail_id, name, area, riding_type, difficulty_level,
            distance, time, creator, date_created, has_gps, detail_url
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `;

        const trailResult = await client.query(trailQuery, [
          properties.id,
          properties.name,
          properties.area,
          ridingType || '',
          difficultyLevel || ridingType || '',
          properties.distance,
          properties.time,
          properties.creator,
          formattedDate, // Use the converted date
          properties.hasGps === 'Yes',
          properties.detailUrl
        ]);

        // Insert coordinates if they exist
        if (feature.geometry && feature.geometry.coordinates) {
          const coordQuery = `
            INSERT INTO trail_coordinates (trail_id, longitude, latitude, sequence_num)
            VALUES ($1, $2, $3, $4)
          `;

          for (let i = 0; i < feature.geometry.coordinates.length; i++) {
            const [longitude, latitude] = feature.geometry.coordinates[i];
            await client.query(coordQuery, [properties.id, longitude, latitude, i]);
          }
        }

        importedCount++;
        if (importedCount % 10 === 0) {
          console.log(`Imported ${importedCount} trails...`);
        }
      }

      await client.query('COMMIT');
      
      // Get final counts
      const trailCount = await client.query('SELECT COUNT(*) FROM trails');
      const coordCount = await client.query('SELECT COUNT(*) FROM trail_coordinates');
      
      console.log('\nImport completed successfully!');
      console.log(`Imported ${trailCount.rows[0].count} trails`);
      console.log(`Imported ${coordCount.rows[0].count} coordinates`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error during import:', error);
    if (error.code === 'ENOENT') {
      console.error('File not found: Make sure trails_geojson.json is in the backend directory');
    }
  } finally {
    await pool.end();
  }
}

// Run the import
console.log('Starting import process...');
importTrails()
  .then(() => {
    console.log('Import script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });