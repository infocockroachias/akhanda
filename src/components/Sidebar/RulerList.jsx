import React, { useState, useMemo } from 'react'

export default function RulerList({ rulers = [], onSelect, selected }) {
  const [search, setSearch] = useState('')
  const [expandedDynasty, setExpandedDynasty] = useState(null)

  // rulers is expected to be { dynastyName: [ { ruler, start, end, title, note } ] }
  const dynastyEntries = useMemo(() => {
    if (!rulers) return []
    const entries = Object.entries(rulers)
    if (!search.trim()) return entries

    const q = search.toLowerCase()
    return entries.map(([name, rulerList]) => {
      const filteredRulers = rulerList.filter(r =>
        r.ruler?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.note?.toLowerCase().includes(q)
      )
      return [name, filteredRulers]
    }).filter(([_, list]) => list.length > 0)
  }, [rulers, search])

  function formatYear(year) {
    if (year == null) return '?'
    if (year < 0) return `${Math.abs(year)} BCE`
    return `${year} CE`
  }

  function toggleDynasty(name) {
    setExpandedDynasty(prev => prev === name ? null : name)
  }

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search rulers & dynasties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>

      <p className="text-xs text-gray-500 mb-3">
        {dynastyEntries.length} {dynastyEntries.length === 1 ? 'dynasty' : 'dynasties'}
      </p>

      <div className="space-y-2">
        {dynastyEntries.map(([dynastyName, rulerList]) => {
          const isExpanded = expandedDynasty === dynastyName || search.trim() !== ''

          return (
            <div key={dynastyName} className="bg-gray-50/50 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDynasty(dynastyName)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">{dynastyName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{rulerList.length} rulers</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3">
                  <div className="space-y-1.5">
                    {rulerList.map((ruler, idx) => {
                      const isSelected = selected?.ruler === ruler.ruler && selected?.dynasty === dynastyName

                      return (
                        <button
                          key={`${ruler.ruler}-${idx}`}
                          onClick={() => onSelect?.({ ...ruler, dynasty: dynastyName })}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative flex-shrink-0">
                              <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white" />
                              {idx < rulerList.length - 1 && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-200" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-gray-800 truncate">{ruler.ruler}</span>
                                {ruler.title && (
                                  <span className="text-xs text-gray-500 flex-shrink-0">{ruler.title}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {ruler.start && (
                                  <span className="text-xs text-gray-500">
                                    {formatYear(ruler.start)} – {ruler.end ? formatYear(ruler.end) : 'present'}
                                  </span>
                                )}
                              </div>
                              {ruler.note && (
                                <p className="text-xs text-gray-400 mt-1 italic">{ruler.note}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {dynastyEntries.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No rulers found</p>
        </div>
      )}
    </div>
  )
}
