-- Trails table
CREATE TABLE trails (
    id SERIAL PRIMARY KEY,
    trail_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(100),
    riding_type VARCHAR(50),    -- For XC, etc.
    difficulty_level VARCHAR(50), -- For בינוני, etc.
    distance NUMERIC,
    time VARCHAR(20),
    creator VARCHAR(100),
    date_created DATE,
    has_gps BOOLEAN DEFAULT false,
    detail_url VARCHAR(255)
);

-- Trail coordinates table
CREATE TABLE trail_coordinates (
    id SERIAL PRIMARY KEY,
    trail_id VARCHAR(50) REFERENCES trails(trail_id),
    longitude NUMERIC NOT NULL,
    latitude NUMERIC NOT NULL,
    sequence_num INTEGER NOT NULL
);

-- Add indexes
CREATE INDEX idx_trail_id ON trail_coordinates(trail_id);