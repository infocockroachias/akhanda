import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMapData } from '../hooks/useMapData'

const CardsPage = () => {
  const { kingdoms, loading } = useMapData()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const filteredKingdoms = useMemo(() => {
    let result = [...kingdoms]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(k =>
        k.name?.toLowerCase().includes(q) ||
        k.capital?.toLowerCase().includes(q) ||
        k.type?.toLowerCase().includes(q) ||
        k.description?.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'name') {
      result.sort((a, b) => a.name?.localeCompare(b.name))
    } else if (sortBy === 'capital') {
      result.sort((a, b) => a.capital?.localeCompare(b.capital))
    }
    return result
  }, [kingdoms, searchQuery, sortBy])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading kingdoms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Kingdom Cards</h1>
        <p className="text-gray-600 mb-8">Explore all kingdoms that ruled the Indian subcontinent</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <input type="text" placeholder="Search kingdoms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 min-w-[200px] filter" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter">
            <option value="name">Sort by Name</option>
            <option value="capital">Sort by Capital</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKingdoms.map((kingdom) => (
            <Link key={kingdom.name} to={`/cards/${encodeURIComponent(kingdom.name)}`} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: kingdom.color || '#6b7280' }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{kingdom.name}</h3>
                  {kingdom.capital && <p className="text-xs text-gray-500 mt-0.5">Capital: {kingdom.capital}</p>}
                  {kingdom.type && <p className="text-xs text-gray-400 mt-0.5">{kingdom.type}</p>}
                  {kingdom.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{kingdom.description}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardsPage
