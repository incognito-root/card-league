"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Player, MatchWithResults } from "@/types/database";
import LeagueTable from "@/components/LeagueTable";
import MatchEntry from "@/components/MatchEntry";
import MatchHistory from "@/components/MatchHistory";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<MatchWithResults[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSupabaseConnection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkSupabaseConnection = async () => {
    try {
      // Try to fetch data to test connection
      await fetchData();
    } catch (error) {
      console.error("Supabase connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .order("total_points", { ascending: false });

      if (playersError) throw playersError;

      // Fetch matches with results
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(
          `
          *,
          match_results (
            *,
            player:players (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (matchesError) throw matchesError;

      setPlayers(playersData || []);
      setMatches(matchesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const handleMatchSubmitted = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--accent-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <header className="text-center mb-6 sm:mb-8 relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            Card Game League
          </h1>
          <p className="text-[var(--text-secondary)]">
            Track your game results and see who&apos;s leading!
          </p>
        </header>

        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {/* League Table */}
          <div className="md:col-span-2">
            <LeagueTable players={players} />
          </div>

          {/* Match Entry */}
          <div className="w-full">
            <MatchEntry
              players={players}
              onMatchSubmitted={handleMatchSubmitted}
            />
          </div>

          {/* Match History */}
          <div className="w-full">
            <MatchHistory matches={matches} />
          </div>
        </div>
      </div>
    </div>
  );
}
