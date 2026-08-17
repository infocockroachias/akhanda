import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMapData } from '../hooks/useMapData'

const BattlesPage = () => {
  const navigate = useNavigate()
  const { events } = useMapData()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const battleEvents = useMemo(() => {
    return events.filter(e => e.category === 'War' || e.category === 'Battle')
  }, [events])

  const filteredBattles = useMemo(() => {
    let result = battleEvents
    if (filter !== 'all') {
      result = result.filter(e => e.category === filter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.text?.toLowerCase().includes(q) ||
        e.year?.toString().includes(q) ||
        e.source?.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => a.year - b.year)
  }, [battleEvents, filter, searchQuery])

  const formatYear = (y) => {
    if (y < 0) return `${Math.abs(y)} BCE`
    return `${y} CE`
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-3">Battles & Wars</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            A curated timeline of military conflicts across the Indian subcontinent — from ancient campaigns to colonial wars.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'War', 'Battle'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search battles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-auto px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{battleEvents.length}</div>
            <div className="text-sm text-gray-600">Total Battles</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {new Set(battleEvents.map(e => Math.floor(e.year / 100) * 100)).size}
            </div>
            <div className="text-sm text-gray-600">Centuries Covered</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {Math.min(...battleEvents.map(e => e.year)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Earliest Record</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {filteredBattles.slice(0, 50).map((battle, i) => (
              <div
                key={i}
                className="relative pl-10 cursor-pointer group"
                onClick={() => navigate(`/year/${battle.year}`)}
              >
                {/* Dot */}
                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm group-hover:scale-125 transition-transform" />
                
                <div className="card p-4 hover:border-amber-200 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-amber-700 mb-1">{formatYear(battle.year)}</div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{battle.text}</h3>
                      {battle.source && (
                        <p className="text-sm text-gray-500 mt-1">{battle.source}</p>
                      )}
                      {battle.belligerents && (
                        <p className="text-xs text-gray-400 mt-1">{battle.belligerents}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBattles.length > 50 && (
            <div className="text-center mt-8 text-gray-500 text-sm">
              Showing 50 of {filteredBattles.length} battles. Use search to filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BattlesPage
