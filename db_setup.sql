-- Create users table (if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create files table for storing file metadata
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  file_path VARCHAR(500),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes'),
  is_processed BOOLEAN DEFAULT FALSE
);

-- Create pdf_operations table for tracking PDF operations
CREATE TABLE IF NOT EXISTS pdf_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  operation_type VARCHAR(50), -- 'split', 'rotate', 'merge', etc.
  operation_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  input_file_path VARCHAR(500),
  output_file_path VARCHAR(500),
  operation_details JSONB, -- Store parameters like rotation angle, split pages, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Create file_transfers table for tracking file transfers
CREATE TABLE IF NOT EXISTS file_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255),
  transfer_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'received', 'expired'
  transfer_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  downloaded_at TIMESTAMP
);

-- Create activity_log table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100),
  file_id UUID REFERENCES files(id) ON DELETE SET NULL,
  operation_id UUID REFERENCES pdf_operations(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON files(upload_date);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_user_id ON pdf_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_status ON pdf_operations(operation_status);
CREATE INDEX IF NOT EXISTS idx_file_transfers_user_id ON file_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- Create function to auto-delete files after 30 minutes
CREATE OR REPLACE FUNCTION delete_expired_files()
RETURNS void AS $$
BEGIN
  DELETE FROM files 
  WHERE upload_date < NOW() - INTERVAL '30 minutes';
  
  DELETE FROM pdf_operations 
  WHERE created_at < NOW() - INTERVAL '30 minutes';
  
  DELETE FROM file_transfers 
  WHERE created_at < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function periodically
CREATE OR REPLACE FUNCTION check_and_delete_expired_files()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM delete_expired_files();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth method)
CREATE POLICY "Users can view their own files"
  ON files FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own files"
  ON files FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own pdf_operations"
  ON pdf_operations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own file_transfers"
  ON file_transfers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own activity_log"
  ON activity_log FOR SELECT
  USING (user_id = auth.uid());

-- Policy to allow deletion of expired files
CREATE POLICY "Auto-delete expired files"
  ON files FOR DELETE
  USING (expires_at < NOW());

-- Alternative: Create a scheduled job on Supabase (use pg_cron extension if available)
-- This requires pg_cron extension to be enabled on your Supabase project
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup job to run every 5 minutes
SELECT cron.schedule('delete_expired_files', '*/5 * * * *', 'SELECT delete_expired_files();');