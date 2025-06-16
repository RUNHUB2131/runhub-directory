-- Updated run_clubs table schema with approval workflow
-- Run this in Supabase SQL Editor to update your database

-- Drop existing table if you need to start fresh (BE CAREFUL - this deletes data!)
-- DROP TABLE IF EXISTS run_clubs CASCADE;

-- Create the updated run_clubs table
CREATE TABLE IF NOT EXISTS run_clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic club info
  club_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  
  -- URLs
  website_url TEXT,
  instagram_url TEXT,
  strava_url TEXT,
  additional_url TEXT,
  
  -- Location
  suburb_or_town TEXT NOT NULL,
  postcode TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Run details - up to 7 different runs
  run_details TEXT[] NOT NULL DEFAULT '{}',
  
  -- Schedule
  run_days TEXT[] NOT NULL DEFAULT '{}', -- Array of days: 'monday', 'tuesday', etc.
  
  -- Club characteristics
  club_type TEXT CHECK (club_type IN ('everyone', 'women-only', 'men-only')) NOT NULL DEFAULT 'everyone',
  is_paid TEXT CHECK (is_paid IN ('free', 'paid')) NOT NULL DEFAULT 'free',
  
  -- Activities
  extracurriculars TEXT[] NOT NULL DEFAULT '{}', -- Array from specified options
  terrain TEXT[] NOT NULL DEFAULT '{}', -- Array from specified options
  
  -- Media
  club_photo TEXT, -- URL to uploaded photo
  
  -- Private contact info (admin only)
  leader_name TEXT,
  contact_mobile TEXT,
  contact_email TEXT NOT NULL,
  
  -- Approval workflow
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
  approval_token TEXT UNIQUE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  rejection_reason TEXT,
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_run_clubs_status ON run_clubs(status);
CREATE INDEX IF NOT EXISTS idx_run_clubs_state ON run_clubs(state);
CREATE INDEX IF NOT EXISTS idx_run_clubs_club_name ON run_clubs(club_name);
CREATE INDEX IF NOT EXISTS idx_run_clubs_suburb_or_town ON run_clubs(suburb_or_town);
CREATE INDEX IF NOT EXISTS idx_run_clubs_run_days ON run_clubs USING GIN (run_days);
CREATE INDEX IF NOT EXISTS idx_run_clubs_club_type ON run_clubs(club_type);
CREATE INDEX IF NOT EXISTS idx_run_clubs_is_paid ON run_clubs(is_paid);
CREATE INDEX IF NOT EXISTS idx_run_clubs_approval_token ON run_clubs(approval_token);

-- Enable Row Level Security (RLS)
ALTER TABLE run_clubs ENABLE ROW LEVEL SECURITY;

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

-- Create or replace function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_run_clubs_updated_at ON run_clubs;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_run_clubs_updated_at 
  BEFORE UPDATE ON run_clubs 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate approval token
CREATE OR REPLACE FUNCTION generate_approval_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ language 'plpgsql';

-- Function to auto-generate approval token on insert
CREATE OR REPLACE FUNCTION set_approval_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.approval_token IS NULL THEN
    NEW.approval_token = generate_approval_token();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_approval_token_trigger ON run_clubs;

-- Create trigger to auto-generate approval token
CREATE TRIGGER set_approval_token_trigger
  BEFORE INSERT ON run_clubs
  FOR EACH ROW
  EXECUTE PROCEDURE set_approval_token(); 