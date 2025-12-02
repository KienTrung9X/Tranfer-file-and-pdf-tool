-- Create sessions table for file sharing
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  file_count INTEGER NOT NULL,
  file_names TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read sessions" ON sessions;
DROP POLICY IF EXISTS "Allow public insert sessions" ON sessions;

-- Sessions policies for public file sharing
CREATE POLICY "Allow public read sessions"
  ON sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

-- Storage policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files');

CREATE POLICY "Allow public downloads" ON storage.objects
  FOR SELECT USING (bucket_id = 'files');