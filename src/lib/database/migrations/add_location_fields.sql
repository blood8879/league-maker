-- Add location fields to users table
-- Migration: Add city and district columns for user location

-- Add city column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add district column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS district TEXT;

-- Add comments for documentation
COMMENT ON COLUMN users.city IS 'User''s city/province (시/도)';
COMMENT ON COLUMN users.district IS 'User''s district/county (구/군)';

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_users_location ON users(city, district) WHERE city IS NOT NULL AND district IS NOT NULL; 