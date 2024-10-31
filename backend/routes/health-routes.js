const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/health', async (req, res) => {
  try {
    await db.testConnection();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

module.exports = router;