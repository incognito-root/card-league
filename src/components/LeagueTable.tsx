import { Player } from '@/types/database'

interface LeagueTableProps {
  players: Player[]
}

export default function LeagueTable({ players }: LeagueTableProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-lg shadow-md p-4 sm:p-6 border border-[var(--card-border)]">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">League Table</h2>
      
      {players.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-[var(--text-secondary)]">No players found. Add some match results to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--card-border)]">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[var(--text-secondary)] hidden sm:table-cell">Position</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[var(--text-secondary)]">Player</th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[var(--text-secondary)]">Matches</th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[var(--text-secondary)]">Points</th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[var(--text-secondary)] hidden sm:table-cell">Avg Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr 
                  key={player.id} 
                  className={`border-b border-[var(--card-border)] hover:bg-[var(--hover-bg)] ${
                    index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                    index === 1 ? 'bg-gray-50 dark:bg-gray-700/20' : 
                    index === 2 ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                  }`}
                >
                  <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                    <div className="flex items-center">
                      <span className={`
                        w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-100' :
                          index === 1 ? 'bg-gray-400 text-gray-900 dark:bg-gray-500 dark:text-gray-100' :
                          index === 2 ? 'bg-orange-400 text-orange-900 dark:bg-orange-500 dark:text-orange-100' :
                          'bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-blue-100'}
                      `}>
                        {index + 1}
                      </span>
                      {index === 0 && <span className="ml-1 sm:ml-2 text-yellow-600 dark:text-yellow-400">👑</span>}
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex items-center">
                      <span className={`sm:hidden mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-100' :
                          index === 1 ? 'bg-gray-400 text-gray-900 dark:bg-gray-500 dark:text-gray-100' :
                          index === 2 ? 'bg-orange-400 text-orange-900 dark:bg-orange-500 dark:text-orange-100' :
                          'bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-blue-100'}
                      `}>{index + 1}</span>
                      <span className="font-medium text-[var(--text-primary)] text-sm sm:text-base">{player.name}</span>
                      {index === 0 && <span className="ml-1 sm:hidden text-yellow-600 dark:text-yellow-400">👑</span>}
                    </div>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                    <span className="text-[var(--text-secondary)] text-sm sm:text-base">{player.matches_played}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                    <span className="font-semibold text-[var(--accent-blue)] text-sm sm:text-base">{player.total_points}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center hidden sm:table-cell">
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
