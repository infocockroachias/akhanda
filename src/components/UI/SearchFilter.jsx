import React, { useState, useMemo } from 'react'

const SearchFilter = ({ 
  kingdoms, 
  events, 
  onKingdomSelect, 
  onYearSelect,
  onEventSelect,
}) => {
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    if (!query || query.length < 2) return { kingdoms: [], events: [] }
    
    const q = query.toLowerCase()
    let matchedKingdoms = []
    let matchedEvents = []

    if (filterType === 'all' || filterType === 'kingdoms') {
      matchedKingdoms = kingdoms.filter(k =>
        k.name?.toLowerCase().includes(q) ||
        k.capital?.toLowerCase().includes(q) ||
        k.type?.toLowerCase().includes(q)
      ).slice(0, 5)
    }

    if (filterType === 'all' || filterType === 'events') {
      matchedEvents = events.filter(e =>
        e.text?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.year?.toString().includes(q)
      ).slice(0, 5)
    }

    return { kingdoms: matchedKingdoms, events: matchedEvents }
  }, [query, kingdoms, events, filterType])

  const hasResults = results.kingdoms.length > 0 || results.events.length > 0

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-80">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search kingdoms, events, years..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-xl"
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false) }}
            className="absolute right-3 top-3 p-0.5 rounded hover:bg-slate-700"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {isOpen && query && (
        <div className="flex gap-2 mt-2">
          {['all', 'kingdoms', 'events'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && hasResults && (
        <div className="mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {results.kingdoms.length > 0 && (
            <div className="p-2">
              <span className="text-xs text-slate-500 px-2 py-1 block">Kingdoms</span>
              {results.kingdoms.map(kingdom => (
                <button
                  key={kingdom.name}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-left"
                  onClick={() => { onKingdomSelect?.(kingdom); setIsOpen(false) }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: kingdom.color || '#6b7280' }}
                  />
                  <div>
                    <span className="text-sm text-white">{kingdom.name}</span>
                    {kingdom.capital && (
                      <span className="text-xs text-slate-500 ml-2">{kingdom.capital}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          {results.events.length > 0 && (
            <div className="p-2 border-t border-slate-700">
              <span className="text-xs text-slate-500 px-2 py-1 block">Events</span>
              {results.events.map((event, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-left"
                  onClick={() => { onEventSelect?.(event); onYearSelect?.(event.year); setIsOpen(false) }}
                >
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 min-w-[60px] text-center">
                    {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                  </span>
                  <span className="text-sm text-white truncate">{event.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter
