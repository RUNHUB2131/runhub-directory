-- Fix RLS policy for newsletter signups
-- This will allow public inserts to the newsletter_signups table

-- Drop existing policies that are blocking inserts
DROP POLICY IF EXISTS "Admin read access" ON newsletter_signups;
DROP POLICY IF EXISTS "Public insert access" ON newsletter_signups;

-- Create new policy that allows anyone to insert newsletter signups
CREATE POLICY "Allow public newsletter signups" ON newsletter_signups
    FOR INSERT 
    WITH CHECK (true);

-- Keep read access restricted (no one can read the emails except service role)
CREATE POLICY "No public read access" ON newsletter_signups
    FOR SELECT 
    USING (false);

-- Ensure the anon role can insert
GRANT INSERT ON newsletter_signups TO anon;
GRANT INSERT ON newsletter_signups TO authenticated; 