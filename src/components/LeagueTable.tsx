import { Player } from '@/types/database'

interface LeagueTableProps {
  players: Player[]
}

export default function LeagueTable({ players }: LeagueTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">League Table</h2>
      
      {players.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No players found. Add some match results to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Matches</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Points</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr 
                  key={player.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index === 0 ? 'bg-yellow-50' : 
                    index === 1 ? 'bg-gray-50' : 
                    index === 2 ? 'bg-orange-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-orange-400 text-orange-900' :
                          'bg-blue-100 text-blue-900'}
                      `}>
                        {index + 1}
                      </span>
                      {index === 0 && <span className="ml-2 text-yellow-600">👑</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700">{player.matches_played}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-blue-600">{player.total_points}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-700">
                      {player.matches_played > 0 
                        ? (player.total_points / player.matches_played).toFixed(1)
                        : '0.0'
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
