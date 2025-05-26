
-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create default admin user (username: admin, password: cardleague123)
-- The password hash is pre-computed for "cardleague123" using SHA-256
-- In a production environment, this would be done more securely with proper salt
INSERT INTO users (username, password_hash, is_admin)
VALUES (
  'admin', 
  '74dc0d3b82ef22cb7d21f706e45f946744ae8888fbf9a50eb4aff9ec7124bfe4',
  true
) ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Allow users to read their own data" ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy to allow public authentication (needed for login)
CREATE POLICY "Allow public to authenticate" ON users 
  FOR SELECT 
  USING (true);
