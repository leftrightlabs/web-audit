-- Create website_audits table
CREATE TABLE IF NOT EXISTS website_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT NOT NULL,
  goal TEXT,
  industry TEXT,
  audience_type TEXT,
  brand_personality TEXT,
  marketing_status TEXT,
  help_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shared_reports table for short URLs
CREATE TABLE IF NOT EXISTS shared_reports (
  short_id TEXT PRIMARY KEY,
  audit_result JSONB NOT NULL,
  lighthouse_data JSONB,
  website TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Initially disable Row Level Security (RLS) for simplicity
-- For production, you should enable RLS and create appropriate policies
ALTER TABLE website_audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE shared_reports DISABLE ROW LEVEL SECURITY;

-- You can enable RLS and create insert-only policy with this:
-- ALTER TABLE website_audits ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow inserts for everyone" ON website_audits
--   FOR INSERT WITH CHECK (true);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS website_audits_email_idx ON website_audits (email);
CREATE INDEX IF NOT EXISTS website_audits_created_at_idx ON website_audits (created_at);
CREATE INDEX IF NOT EXISTS shared_reports_expires_at_idx ON shared_reports (expires_at); 