const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initializeDatabase() {
  try {
    // Read schema file
    const schema = fs.readFileSync(
      path.join(__dirname, '../db/schema.sql'),
      'utf8'
    );

    // Connect to database
    const client = await pool.connect();
    
    try {
      // Execute schema
      await client.query(schema);
      console.log('Database schema created successfully');
      
      // Verify tables
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      console.log('Created tables:', tables.rows.map(row => row.table_name));
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase();