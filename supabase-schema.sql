-- Create the run_clubs table
CREATE TABLE run_clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  suburb TEXT NOT NULL,
  coordinates JSONB NOT NULL, -- Store as {"lat": number, "lng": number}
  meeting_day TEXT NOT NULL,
  meeting_time TEXT NOT NULL,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  distance_focus TEXT[] NOT NULL, -- Array of strings
  contact_email TEXT,
  website TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on commonly searched fields
CREATE INDEX idx_run_clubs_name ON run_clubs(name);
CREATE INDEX idx_run_clubs_location ON run_clubs(location);
CREATE INDEX idx_run_clubs_state ON run_clubs(state);
CREATE INDEX idx_run_clubs_suburb ON run_clubs(suburb);
CREATE INDEX idx_run_clubs_meeting_day ON run_clubs(meeting_day);
CREATE INDEX idx_run_clubs_time_of_day ON run_clubs(time_of_day);
CREATE INDEX idx_run_clubs_difficulty ON run_clubs(difficulty);

-- Enable Row Level Security (RLS)
ALTER TABLE run_clubs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read run_clubs (public access)
CREATE POLICY "Enable read access for all users" ON run_clubs
    FOR SELECT USING (true);

-- If you want to allow authenticated users to insert/update/delete:
-- CREATE POLICY "Enable insert for authenticated users only" ON run_clubs
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_run_clubs_updated_at 
  BEFORE UPDATE ON run_clubs 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column(); 