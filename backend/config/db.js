const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
});

// Add event listeners for the pool
pool.on('connect', () => {
  console.log('Database pool connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection and database functionality
const testConnection = async () => {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT NOW()');
      console.log('Database connection test successful:', res.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error testing database connection:', err);
    throw err;
  }
};

// Helper function to handle database queries with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Error executing query', { text, error: err });
    throw err;
  }
};

// Helper function to get a client from the pool
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
};

// Test the connection when the module is loaded
testConnection()
  .then(() => console.log('Initial database connection test complete'))
  .catch(err => {
    console.error('Initial database connection test failed:', err);
    process.exit(1);
  });

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};