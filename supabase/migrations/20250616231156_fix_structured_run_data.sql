-- Fix structured run data approach
-- Remove separate arrays and replace with single JSONB array that maintains run relationships

-- Remove the separate array columns that don't maintain run relationships
ALTER TABLE run_clubs 
DROP COLUMN IF EXISTS run_times,
DROP COLUMN IF EXISTS run_locations,
DROP COLUMN IF EXISTS run_types,
DROP COLUMN IF EXISTS run_distances;

-- Drop the corresponding indexes
DROP INDEX IF EXISTS idx_run_clubs_run_times;
DROP INDEX IF EXISTS idx_run_clubs_run_locations;
DROP INDEX IF EXISTS idx_run_clubs_run_types;
DROP INDEX IF EXISTS idx_run_clubs_run_distances;

-- Add the correct structured column for run sessions
-- Each element will contain all details for one complete run session
ALTER TABLE run_clubs 
ADD COLUMN IF NOT EXISTS run_sessions JSONB[] NOT NULL DEFAULT '{}';

-- Create index for the new structured column
CREATE INDEX IF NOT EXISTS idx_run_clubs_run_sessions ON run_clubs USING GIN (run_sessions);

-- Add comment to document the new column structure
COMMENT ON COLUMN run_clubs.run_sessions IS 'Array of run session objects. Each object contains: {day: "monday", time: "06:00", location: "Main Park Entrance", run_type: "Easy Run", distance: "5km", description: "Additional details about the run"}';


