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
      case 1: return 'text-yellow-600 font-bold'
      case 2: return 'text-gray-600 font-semibold'
      case 3: return 'text-orange-600 font-semibold'
      case 4: return 'text-red-600'
      default: return 'text-gray-600'
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Match History</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches recorded yet. Submit your first match to see history!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">
                  Match on {formatDate(match.date)}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(match.created_at)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {match.match_results
                  .sort((a, b) => a.position - b.position)
                  .map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getPositionEmoji(result.position)}
                        </span>
                        <span className={getPositionColor(result.position)}>
                          {result.position === 1 ? '1st' :
                           result.position === 2 ? '2nd' :
                           result.position === 3 ? '3rd' : '4th'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {result.player?.name}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600">
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
