import React, { useState } from 'react'

const MapLegend = ({ kingdoms, onKingdomClick, selectedKingdom }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredKingdoms = kingdoms.filter(k =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="absolute top-4 left-4 z-20 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl w-64 max-h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h3 className="font-semibold text-white text-sm">Kingdoms</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
        >
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Search */}
          <div className="px-3 py-2">
            <input
              type="text"
              placeholder="Search kingdoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Kingdom List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {filteredKingdoms.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No kingdoms found</p>
            ) : (
              <div className="space-y-1">
                {filteredKingdoms.map((kingdom) => (
                  <div
                    key={kingdom.name}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      selectedKingdom === kingdom.name
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'hover:bg-slate-700/50'
                    }`}
                    onClick={() => onKingdomClick?.(kingdom)}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: kingdom.color || '#6b7280' }}
                    />
                    <span className="text-xs text-white truncate">{kingdom.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MapLegend
