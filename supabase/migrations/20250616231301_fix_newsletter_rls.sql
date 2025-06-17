-- Fix RLS policy for newsletter signups
-- Drop existing policies
DROP POLICY IF EXISTS "Admin read access" ON newsletter_signups;
DROP POLICY IF EXISTS "Public insert access" ON newsletter_signups;

-- Create new policies that work properly
CREATE POLICY "Allow public inserts" ON newsletter_signups
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- No read access needed for public (admin can access via service role)
CREATE POLICY "No public read access" ON newsletter_signups
    FOR SELECT 
    TO anon, authenticated
    USING (false);

-- Ensure proper grants
GRANT INSERT ON newsletter_signups TO anon;
GRANT INSERT ON newsletter_signups TO authenticated; 