-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,  -- Plain text password for simplicity
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create default admin user (username: admin)
-- REPLACE 'your_password_here' with your desired password
INSERT INTO users (username, password, is_admin)
VALUES (
  'admin',
  'your_password_here',  -- Replace this with your password
  true
) ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public authentication (needed for login)
CREATE POLICY "Allow public to authenticate" ON users 
  FOR SELECT 
  USING (true);
