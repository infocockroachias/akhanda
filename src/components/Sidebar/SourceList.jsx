import React, { useState, useMemo } from 'react'

const TYPE_LABELS = {
  book: { label: 'Book', icon: '📖', color: 'text-blue-700 bg-blue-100' },
  article: { label: 'Article', icon: '📄', color: 'text-green-700 bg-green-100' },
  website: { label: 'Website', icon: '🌐', color: 'text-cyan-700 bg-cyan-100' },
  archive: { label: 'Archive', icon: '🗃️', color: 'text-amber-700 bg-amber-100' },
  journal: { label: 'Journal', icon: '📰', color: 'text-purple-700 bg-purple-100' },
  document: { label: 'Document', icon: '📋', color: 'text-gray-700 bg-gray-100' },
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
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search sources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-2 py-1 text-xs rounded-full transition-all duration-200 ${
              typeFilter === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All' : (TYPE_LABELS[type]?.label || type)}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'source' : 'sources'}
      </p>

      <div className="space-y-2">
        {filtered.map((source, idx) => {
          const typeInfo = TYPE_LABELS[source.type] || TYPE_LABELS.document
          const isSelected = selected?.id === source.id

          return (
            <button
              key={source.id || idx}
              onClick={() => onSelect?.(source)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-gray-50/50 border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${typeInfo.color}`}>
                  {typeInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 leading-snug">{source.title}</h3>
                  {source.author && <p className="text-xs text-gray-500 mt-1">{source.author}</p>}
                  {source.volume && <p className="text-xs text-gray-400 mt-0.5">{source.volume}</p>}
                  {source.coverage && <p className="text-xs text-gray-400 mt-1"><span className="text-gray-500">Coverage:</span> {source.coverage}</p>}
                  {(source.publisher || source.year) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {source.publisher}{source.publisher && source.year ? ', ' : ''}{source.year}
                    </p>
                  )}
                  {source.notes && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic">{source.notes}</p>}
                  {source.id && (
                    <span className="inline-block mt-2 px-1.5 py-0.5 bg-gray-200 rounded text-[10px] text-gray-600 font-mono">
                      {source.id}
                    </span>
                  )}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
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
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No sources found</p>
        </div>
      )}
    </div>
  )
}
