export interface Player {
  id: string
  name: string
  total_points: number
  matches_played: number
  created_at: string
}

export interface Match {
  id: string
  date: string
  created_at: string
}

export interface MatchResult {
  id: string
  match_id: string
  player_id: string
  position: number
  points: number
  created_at: string
  player?: Player
}

export interface MatchWithResults extends Match {
  match_results: (MatchResult & { player: Player })[]
}
