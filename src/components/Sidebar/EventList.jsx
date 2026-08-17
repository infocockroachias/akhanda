import React, { useState, useMemo } from 'react'

const CATEGORY_COLORS = {
  War: { bg: 'bg-red-500/20', text: 'text-red-400' },
  Political: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  Birth: { bg: 'bg-green-500/20', text: 'text-green-400' },
  Death: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  Treaty: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  Foundation: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  Coronation: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  Battle: { bg: 'bg-red-500/20', text: 'text-red-400' },
  Cultural: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  Religious: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  Economic: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  Exploration: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
}

export default function EventList({ events = [], onSelect, selected }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category).filter(Boolean))
    return ['all', ...Array.from(cats)]
  }, [events])

  const filtered = useMemo(() => {
    let result = events
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.category === categoryFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.text?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.year?.toString().includes(q) ||
        e.source?.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => (a.year || 0) - (b.year || 0))
  }, [events, search, categoryFilter])

  return (
    <div className="p-4">
      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`
              px-2 py-1 text-xs rounded-full transition-all duration-200
              ${categoryFilter === cat
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
              }
            `}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((event, idx) => {
          const colors = CATEGORY_COLORS[event.category] || { bg: 'bg-slate-500/20', text: 'text-slate-400' }
          const isSelected = selected?.year === event.year && selected?.text === event.text

          return (
            <button
              key={`${event.year}-${idx}`}
              onClick={() => onSelect?.(event)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/30'
                  : 'bg-slate-700/50 border-slate-600 hover:border-blue-400 hover:bg-slate-700'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Year Badge */}
                <div className="flex-shrink-0 w-14 text-center">
                  <span className="inline-block px-2 py-1 bg-slate-600 rounded text-xs font-bold text-white">
                    {formatYear(event.year)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {/* Category Badge */}
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                    {event.category}
                  </span>
                  <p className="text-sm text-slate-300 mt-1.5 leading-snug">{event.text}</p>
                  {event.source && (
                    <p className="text-xs text-slate-500 mt-1.5">Source: {event.source}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No events found</p>
        </div>
      )}
    </div>
  )
}

function formatYear(year) {
  if (year == null) return '?'
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year} CE`
}