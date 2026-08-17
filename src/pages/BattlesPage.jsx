import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMapData } from '../hooks/useMapData'

const BattlesPage = () => {
  const { events, loading } = useMapData()
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const battles = events.filter(e => e.category === 'War' || e.category === 'Battle')
  
  const filteredBattles = useMemo(() => {
    let result = battles
    if (filter !== 'All') {
      result = result.filter(b => b.category === filter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.text?.toLowerCase().includes(q) || 
        b.year?.toString().includes(q) ||
        b.source?.toLowerCase().includes(q)
      )
    }
    return result
  }, [battles, filter, searchQuery])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading battles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Battles & Wars</h1>
        <p className="text-gray-600 mb-8">Major conflicts and wars in Indian history</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search battles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] filter"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter"
          >
            <option value="All">All Categories</option>
            <option value="War">Wars</option>
            <option value="Battle">Battles</option>
            <option value="Treaty">Treaties</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBattles.map((battle, index) => (
            <Link
              key={index}
              to={`/year/${battle.year}`}
              className="card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  {battle.category}
                </span>
                <span className="text-xs text-gray-500">
                  {battle.year < 0 ? `${Math.abs(battle.year)} BCE` : `${battle.year} CE`}
                </span>
              </div>
              <p className="text-sm text-gray-800">{battle.text}</p>
              {battle.source && (
                <p className="text-xs text-gray-500 mt-2">Source: {battle.source}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BattlesPage
