# Trail Mapper

A web application for finding and exploring hiking and biking trails in Israel. This application provides trail information, GPS tracks, and real-time weather data for trails.

## Features

- Interactive map display of trails
- Trail filtering by:
  - Riding type
  - Difficulty level
  - Area
  - Distance
- Real-time weather information for trails
- Detailed trail information including:
  - GPS tracks
  - Distance
  - Estimated time
  - Area information
  - Creator details

## Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- QGIS (for map data processing)

### Frontend
- React
- Tailwind CSS
- OpenLayers (for map display)
- Lucide React (for icons)
- Axios (for API calls)

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [QGIS](https://qgis.org/) (for map data processing)

## Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd trail-mapper
```

2. **Database Setup**
```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE trail_mapper;

# Connect to the new database
\c trail_mapper

# Run the schema script
\i backend/db/schema.sql
```

3. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
DB_USER=your_username
DB_HOST=localhost
DB_NAME=trail_mapper
DB_PASSWORD=your_password
DB_PORT=5432
```

4. **Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for frontend
cp .env.example .env
```

5. **Import Trail Data**
```bash
# From the backend directory
node scripts/importData.js
```

## Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm start
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
trail-mapper/
├── backend/
│   ├── config/          # Database and server configuration
│   ├── database/        # Database schema and migrations
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── scripts/         # Data import scripts
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static files
│   │   └── Tracks/      # QGIS generated files
│   └── src/
│       ├── components/  # React components
│       ├── screens/     # Screen components
│       ├── services/    # API services
│       └── styles/      # CSS styles
```

## QGIS Integration

The application uses QGIS-generated files for map display. These files are located in:
```
frontend/public/Tracks/qgis2web_2024_09/
```

## Weather API Integration

The application uses OpenWeatherMap API for real-time weather data. You'll need to:
1. Sign up at [OpenWeatherMap](https://openweathermap.org/)
2. Get an API key
3. Add the key to your frontend `.env` file:
```
REACT_APP_WEATHER_API_KEY=your_api_key
```

## Database Schema

The application uses two main tables:
- `trails`: Stores trail information
- `trail_coordinates`: Stores GPS coordinates for trails

View table structures using PostgreSQL commands:
```sql
\d trails
\d trail_coordinates
```

## Development Commands

```bash
# Backend
npm start          # Start the server
npm run import     # Import trail data

# Frontend
npm start          # Start development server
npm run build      # Build for production
```

## Useful PostgreSQL Commands

```sql
# Connect to database
psql trail_mapper

# List all tables
\dt

# View table content
SELECT * FROM trails LIMIT 5;
SELECT * FROM trail_coordinates LIMIT 5;

# Count entries
SELECT COUNT(*) FROM trails;
```