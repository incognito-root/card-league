'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Player } from '@/types/database'

interface MatchEntryProps {
  players: Player[]
  onMatchSubmitted: () => void
}

const POINT_VALUES = [5, 3, 2, 0] // 1st, 2nd, 3rd, 4th place points

export default function MatchEntry({ players, onMatchSubmitted }: MatchEntryProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [showAddPlayer, setShowAddPlayer] = useState(false)

  const handlePlayerChange = (position: number, playerId: string) => {
    const newSelection = [...selectedPlayers]
    newSelection[position] = playerId
    setSelectedPlayers(newSelection)
  }

  const addNewPlayer = async () => {
    if (!newPlayerName.trim()) return

    try {
      const { error } = await supabase
        .from('players')
        .insert([
          {
            name: newPlayerName.trim(),
            total_points: 0,
            matches_played: 0
          }
        ])
        .select()

      if (error) throw error

      setNewPlayerName('')
      setShowAddPlayer(false)
      onMatchSubmitted() // Refresh the data
    } catch (error) {
      console.error('Error adding player:', error)
      alert('Failed to add player')
    }
  }

  const submitMatch = async () => {
    // Validate that all positions are filled and unique
    if (selectedPlayers.some(id => !id)) {
      alert('Please select a player for each position')
      return
    }

    const uniquePlayers = new Set(selectedPlayers)
    if (uniquePlayers.size !== 4) {
      alert('Please select different players for each position')
      return
    }

    setLoading(true)

    try {
      // Create a new match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert([
          {
            date: new Date().toISOString().split('T')[0]
          }
        ])
        .select()

      if (matchError) throw matchError

      const matchId = matchData[0].id

      // Create match results for each player
      const matchResults = selectedPlayers.map((playerId, position) => ({
        match_id: matchId,
        player_id: playerId,
        position: position + 1,
        points: POINT_VALUES[position]
      }))

      const { error: resultsError } = await supabase
        .from('match_results')
        .insert(matchResults)

      if (resultsError) throw resultsError

      // Update player totals
      for (let i = 0; i < selectedPlayers.length; i++) {
        const playerId = selectedPlayers[i]
        const points = POINT_VALUES[i]

        const { error: updateError } = await supabase.rpc('increment_player_stats', {
          player_id: playerId,
          points_to_add: points
        })

        if (updateError) {
          // Fallback: manually update if RPC doesn't exist
          const player = players.find(p => p.id === playerId)
          if (player) {
            await supabase
              .from('players')
              .update({
                total_points: player.total_points + points,
                matches_played: player.matches_played + 1
              })
              .eq('id', playerId)
          }
        }
      }

      // Reset form
      setSelectedPlayers(['', '', '', ''])
      onMatchSubmitted()

      alert('Match submitted successfully!')
    } catch (error) {
      console.error('Error submitting match:', error)
      alert('Failed to submit match')
    } finally {
      setLoading(false)
    }
  }

  const availablePlayersForPosition = (currentPosition: number) => {
    return players.filter(player => 
      !selectedPlayers.includes(player.id) || 
      selectedPlayers[currentPosition] === player.id
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Record Match Result</h2>
      
      <div className="space-y-4">
        {['1st Place (5 pts)', '2nd Place (3 pts)', '3rd Place (2 pts)', '4th Place (0 pts)'].map((label, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              value={selectedPlayers[index]}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select player...</option>
              {availablePlayersForPosition(index).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={submitMatch}
            disabled={loading || selectedPlayers.some(id => !id)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Match'}
          </button>
          
          <button
            onClick={() => setShowAddPlayer(!showAddPlayer)}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Add Player
          </button>
        </div>

        {showAddPlayer && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Player Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && addNewPlayer()}
              />
              <button
                onClick={addNewPlayer}
                disabled={!newPlayerName.trim()}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
