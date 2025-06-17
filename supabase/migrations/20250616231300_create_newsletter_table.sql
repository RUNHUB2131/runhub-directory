-- Create newsletter signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact info
  email TEXT NOT NULL UNIQUE,
  
  -- Optional fields
  first_name TEXT,
  source TEXT, -- Where they signed up from (e.g., 'homepage', 'club-page', 'contact')
  
  -- Verification status
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT UNIQUE,
  
  -- System fields
  ip_address INET, -- For basic rate limiting
  user_agent TEXT, -- For bot detection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_ip_address ON newsletter_signups(ip_address);
CREATE INDEX IF NOT EXISTS idx_newsletter_verification_token ON newsletter_signups(verification_token);

-- Enable Row Level Security
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Policy for reading (admin only - no public access needed)
CREATE POLICY "Admin read access" ON newsletter_signups
    FOR SELECT USING (false); -- No public read access

-- Policy for inserting (anyone can sign up)
CREATE POLICY "Public insert access" ON newsletter_signups
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT INSERT ON newsletter_signups TO anon;
GRANT INSERT ON newsletter_signups TO authenticated;

-- Function to generate verification token
CREATE OR REPLACE FUNCTION generate_verification_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ language 'plpgsql';

-- Function to auto-generate verification token on insert
CREATE OR REPLACE FUNCTION set_verification_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_token IS NULL THEN
    NEW.verification_token = generate_verification_token();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-generate verification token
CREATE TRIGGER set_verification_token_trigger
  BEFORE INSERT ON newsletter_signups
  FOR EACH ROW
  EXECUTE PROCEDURE set_verification_token(); 