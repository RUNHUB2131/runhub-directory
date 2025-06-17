-- Add structured run data to run_clubs table
-- This migration adds a structured run_sessions column alongside existing run_details for better data flexibility

-- Add new structured column for run sessions
-- Each element will contain: {day, time, location, run_type, distance, description}
ALTER TABLE run_clubs 
ADD COLUMN IF NOT EXISTS run_sessions JSONB[] NOT NULL DEFAULT '{}';

-- Create index for the new structured column to improve query performance
CREATE INDEX IF NOT EXISTS idx_run_clubs_run_sessions ON run_clubs USING GIN (run_sessions);

-- Add comment to document the new column
COMMENT ON COLUMN run_clubs.run_sessions IS 'Array of run session objects. Each object contains: {day: "monday", time: "06:00", location: "Main Park", run_type: "Easy Run", distance: "5km", description: "Details about the run"}';
