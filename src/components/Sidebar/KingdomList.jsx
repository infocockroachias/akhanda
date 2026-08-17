import React, { useState, useMemo } from 'react'

export default function KingdomList({ kingdoms = [], onSelect, selected }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return kingdoms
    const q = search.toLowerCase()
    return kingdoms.filter(k =>
      k.name?.toLowerCase().includes(q) ||
      k.type?.toLowerCase().includes(q) ||
      k.capital?.toLowerCase().includes(q) ||
      k.description?.toLowerCase().includes(q)
    )
  }, [kingdoms, search])

  return (
    <div className="p-4">
      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search kingdoms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'kingdom' : 'kingdoms'}
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((kingdom, idx) => (
          <button
            key={kingdom.name || idx}
            onClick={() => onSelect?.(kingdom)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all duration-200
              ${selected?.name === kingdom.name
                ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/30'
                : 'bg-slate-700/50 border-slate-600 hover:border-blue-400 hover:bg-slate-700'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Color Swatch */}
              <div
                className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ring-2 ring-slate-600"
                style={{ backgroundColor: kingdom.color || '#6b7280' }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{kingdom.name}</h3>
                {kingdom.type && (
                  <p className="text-xs text-slate-400 mt-0.5">{kingdom.type}</p>
                )}
                {kingdom.capital && (
                  <p className="text-xs text-slate-500 mt-0.5">Capital: {kingdom.capital}</p>
                )}
                {kingdom.startYear && kingdom.endYear && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatYear(kingdom.startYear)} – {formatYear(kingdom.endYear)}
                  </p>
                )}
                {kingdom.description && (
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{kingdom.description}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No kingdoms found</p>
        </div>
      )}
    </div>
  )
}

function formatYear(year) {
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year} CE`
}