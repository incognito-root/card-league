#!/bin/bash

# This script helps set up the users table in Supabase
# It uses the SUPABASE_URL and SUPABASE_KEY from your .env.local file

echo "Setting up users table in Supabase..."

# Check if .env.local file exists
if [ ! -f .env.local ]; then
  echo "Error: .env.local file not found"
  exit 1
fi

# Extract Supabase URL and key from .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "Error: Could not find Supabase URL or key in .env.local"
  exit 1
fi

echo "Found Supabase credentials"

# Read the SQL script
SQL=$(cat users-setup.sql)

# Execute the SQL against Supabase
echo "Executing SQL..."
curl -X POST \
  "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL\"}"

echo ""
echo "Setup complete! You should now be able to log in with:"
echo "Username: admin"
echo "Password: cardleague123"
