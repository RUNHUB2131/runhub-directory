-- Fix RLS policies for club submissions
-- This ensures that anyone can submit a club (for approval workflow) but only approved clubs are readable

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for approved clubs" ON run_clubs;
DROP POLICY IF EXISTS "Enable insert for all users" ON run_clubs;
DROP POLICY IF EXISTS "Enable read access for all users" ON run_clubs;

-- Policy for public access to approved clubs only
CREATE POLICY "Enable read access for approved clubs" ON run_clubs
    FOR SELECT USING (status = 'approved');

-- Policy for inserting new club submissions (anyone can submit)
CREATE POLICY "Enable insert for all users" ON run_clubs
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions to anon and authenticated users
GRANT INSERT ON run_clubs TO anon;
GRANT INSERT ON run_clubs TO authenticated;
GRANT SELECT ON run_clubs TO anon;
GRANT SELECT ON run_clubs TO authenticated; 