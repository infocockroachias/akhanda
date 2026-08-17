import React, { useState, useMemo } from 'react'

const CATEGORY_COLORS = {
  War: { bg: 'bg-red-100', text: 'text-red-700' },
  Political: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Birth: { bg: 'bg-green-100', text: 'text-green-700' },
  Death: { bg: 'bg-gray-100', text: 'text-gray-700' },
  Treaty: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Foundation: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Coronation: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Battle: { bg: 'bg-red-100', text: 'text-red-700' },
  Cultural: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Religious: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  Economic: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Exploration: { bg: 'bg-teal-100', text: 'text-teal-700' },
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

  function formatYear(year) {
    if (year == null) return '?'
    if (year < 0) return `${Math.abs(year)} BCE`
    return `${year} CE`
  }

  return (
    <div className="p-4">
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2 py-1 text-xs rounded-full transition-all duration-200 ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
      </p>

      <div className="space-y-2">
        {filtered.map((event, idx) => {
          const colors = CATEGORY_COLORS[event.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
          const isSelected = selected?.year === event.year && selected?.text === event.text

          return (
            <button
              key={`${event.year}-${idx}`}
              onClick={() => onSelect?.(event)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-gray-50/50 border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-14 text-center">
                  <span className="inline-block px-2 py-1 bg-gray-200 rounded text-xs font-bold text-gray-700">
                    {formatYear(event.year)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                    {event.category}
                  </span>
                  <p className="text-sm text-gray-700 mt-1.5 leading-snug">{event.text}</p>
                  {event.source && (
                    <p className="text-xs text-gray-400 mt-1.5">Source: {event.source}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No events found</p>
        </div>
      )}
    </div>
  )
}
