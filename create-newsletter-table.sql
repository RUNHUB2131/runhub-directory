-- Create newsletter signups table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact info
  email TEXT NOT NULL UNIQUE,
  
  -- Optional fields
  first_name TEXT,
  source TEXT, -- Where they signed up from (e.g., 'footer', 'homepage')
  
  -- Verification status (simplified - no verification needed for now)
  is_verified BOOLEAN DEFAULT true,
  
  -- System fields
  ip_address INET, -- For basic rate limiting
  user_agent TEXT, -- For bot detection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_signups(created_at);

-- Enable Row Level Security
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Admin read access" ON newsletter_signups;
DROP POLICY IF EXISTS "Public insert access" ON newsletter_signups;
DROP POLICY IF EXISTS "Allow public newsletter signups" ON newsletter_signups;
DROP POLICY IF EXISTS "No public read access" ON newsletter_signups;

-- Create simple policies that work
CREATE POLICY "Allow anyone to insert newsletter signups" ON newsletter_signups
    FOR INSERT 
    WITH CHECK (true);

-- No public read access (only service role can read)
CREATE POLICY "No public read access" ON newsletter_signups
    FOR SELECT 
    USING (false);

-- Grant permissions to anon users (website visitors)
GRANT INSERT ON newsletter_signups TO anon;
GRANT INSERT ON newsletter_signups TO authenticated; 