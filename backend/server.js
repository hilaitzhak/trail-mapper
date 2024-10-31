const express = require('express');
const cors = require('cors');
const trailRoutes = require('./routes/trails.route');
const healthRoutes = require('./routes/health-routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', trailRoutes);
app.use('/api', healthRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Trail Mapper API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});