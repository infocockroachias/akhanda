import React, { useState, useMemo } from 'react'

const TYPE_LABELS = {
  book: { label: 'Book', icon: '📖', color: 'text-blue-400 bg-blue-500/20' },
  article: { label: 'Article', icon: '📄', color: 'text-green-400 bg-green-500/20' },
  website: { label: 'Website', icon: '🌐', color: 'text-cyan-400 bg-cyan-500/20' },
  archive: { label: 'Archive', icon: '🗃️', color: 'text-amber-400 bg-amber-500/20' },
  journal: { label: 'Journal', icon: '📰', color: 'text-purple-400 bg-purple-500/20' },
  document: { label: 'Document', icon: '📋', color: 'text-slate-400 bg-slate-500/20' },
}

export default function SourceList({ sources = [], onSelect, selected }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const types = useMemo(() => {
    const t = new Set(sources.map(s => s.type).filter(Boolean))
    return ['all', ...Array.from(t)]
  }, [sources])

  const filtered = useMemo(() => {
    let result = sources
    if (typeFilter !== 'all') {
      result = result.filter(s => s.type === typeFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.author?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q) ||
        s.coverage?.toLowerCase().includes(q) ||
        s.notes?.toLowerCase().includes(q) ||
        s.publisher?.toLowerCase().includes(q)
      )
    }
    return result
  }, [sources, search, typeFilter])

  return (
    <div className="p-4">
      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`
              px-2 py-1 text-xs rounded-full transition-all duration-200
              ${typeFilter === type
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
              }
            `}
          >
            {type === 'all' ? 'All' : (TYPE_LABELS[type]?.label || type)}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'source' : 'sources'}
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((source, idx) => {
          const typeInfo = TYPE_LABELS[source.type] || TYPE_LABELS.document
          const isSelected = selected?.id === source.id

          return (
            <button
              key={source.id || idx}
              onClick={() => onSelect?.(source)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/30'
                  : 'bg-slate-700/50 border-slate-600 hover:border-blue-400 hover:bg-slate-700'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Type Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${typeInfo.color}`}>
                  {typeInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-sm font-medium text-white leading-snug">{source.title}</h3>
                  {/* Author */}
                  {source.author && (
                    <p className="text-xs text-slate-400 mt-1">{source.author}</p>
                  )}
                  {/* Volume */}
                  {source.volume && (
                    <p className="text-xs text-slate-500 mt-0.5">{source.volume}</p>
                  )}
                  {/* Coverage */}
                  {source.coverage && (
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="text-slate-400">Coverage:</span> {source.coverage}
                    </p>
                  )}
                  {/* Publisher & Year */}
                  {(source.publisher || source.year) && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {source.publisher}{source.publisher && source.year ? ', ' : ''}{source.year}
                    </p>
                  )}
                  {/* Notes */}
                  {source.notes && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 italic">{source.notes}</p>
                  )}
                  {/* ID Badge */}
                  {source.id && (
                    <span className="inline-block mt-2 px-1.5 py-0.5 bg-slate-600 rounded text-[10px] text-slate-400 font-mono">
                      {source.id}
                    </span>
                  )}
                  {/* URL */}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View source
                    </a>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No sources found</p>
        </div>
      )}
    </div>
  )
}