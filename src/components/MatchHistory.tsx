import { MatchWithResults } from '@/types/database'

interface MatchHistoryProps {
  matches: MatchWithResults[]
}

const MatchHistory = ({ matches }: MatchHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-600 dark:text-yellow-400 font-bold'
      case 2: return 'text-gray-600 dark:text-gray-400 font-semibold'
      case 3: return 'text-orange-600 dark:text-orange-400 font-semibold'
      case 4: return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      case 4: return '😞'
      default: return ''
    }
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-lg shadow-md p-4 sm:p-6 border border-[var(--card-border)]">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">Match History</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">No matches recorded yet. Submit your first match to see history!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border border-[var(--card-border)] rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">
                  Match on {formatDate(match.date)}
                </h3>
                <span className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 sm:mt-0">
                  {formatDate(match.created_at)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {match.match_results
                  .sort((a, b) => a.position - b.position)
                  .map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center justify-between p-2 bg-[var(--hover-bg)] rounded"
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-base sm:text-lg">
                          {getPositionEmoji(result.position)}
                        </span>
                        <span className={getPositionColor(result.position)}>
                          {result.position === 1 ? '1st' :
                           result.position === 2 ? '2nd' :
                           result.position === 3 ? '3rd' : '4th'}
                        </span>
                        <span className="font-medium text-[var(--text-primary)] text-sm sm:text-base truncate max-w-[100px] sm:max-w-[160px]">
                          {result.player?.name}
                        </span>
                      </div>
                      <span className="font-semibold text-[var(--accent-blue)] text-sm sm:text-base">
                        {result.points} pts
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MatchHistory
