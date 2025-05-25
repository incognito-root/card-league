# Card Game League Tracker

A Next.js web application for tracking card game league standings among friends. Built with TypeScript, Tailwind CSS, and Supabase for data persistence.

## Features

- **League Table**: View player standings with points and match statistics
- **Match Entry**: Record game results with automatic point calculation
- **Match History**: See all previous matches and results
- **Player Management**: Add new players on the fly
- **Point System**: 
  - 1st place: 5 points
  - 2nd place: 3 points
  - 3rd place: 2 points
  - 4th place: 0 points

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  total_points INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create match_results table
CREATE TABLE match_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 4),
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment player stats
CREATE OR REPLACE FUNCTION increment_player_stats(player_id UUID, points_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE players 
  SET 
    total_points = total_points + points_to_add,
    matches_played = matches_played + 1
  WHERE id = player_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on match_results" ON match_results FOR ALL USING (true);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1. **Add Players**: Use the "Add Player" button in the match entry form
2. **Record Matches**: Select players for each position (1st through 4th place)
3. **View Standings**: The league table automatically updates with each match
4. **Check History**: See all previous matches in the match history section

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── LeagueTable.tsx   # Player standings table
│   ├── MatchEntry.tsx    # Match recording form
│   └── MatchHistory.tsx  # Match history display
├── lib/
│   └── supabase.ts       # Supabase client configuration
└── types/
    └── database.ts       # TypeScript type definitions
```

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Contributing

Feel free to fork this project and customize it for your own league needs!
