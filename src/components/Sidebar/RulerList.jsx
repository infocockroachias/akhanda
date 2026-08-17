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

  // Calculate total span for the ruler timeline bar
  const getTimelineSpan = (rulerList) => {
    const allYears = rulerList.flatMap(r => [r.start, r.end].filter(Boolean))
    if (allYears.length === 0) return null
    return { min: Math.min(...allYears), max: Math.max(...allYears) }
  }

  const toggleDynasty = (name) => {
    setExpandedDynasty(prev => prev === name ? null : name)
  }

  return (
    <div className="p-4">
      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search rulers & dynasties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 mb-3">
        {dynastyEntries.length} {dynastyEntries.length === 1 ? 'dynasty' : 'dynasties'}
      </p>

      {/* Dynasty Groups */}
      <div className="space-y-2">
        {dynastyEntries.map(([dynastyName, rulerList]) => {
          const isExpanded = expandedDynasty === dynastyName || search.trim() !== ''
          const span = getTimelineSpan(rulerList)
          const totalYears = span ? span.max - span.min : 1

          return (
            <div key={dynastyName} className="bg-slate-700/50 border border-slate-600 rounded-lg overflow-hidden">
              {/* Dynasty Header */}
              <button
                onClick={() => toggleDynasty(dynastyName)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white text-sm">{dynastyName}</h3>
                  {span && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatYear(span.min)} – {formatYear(span.max)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{rulerList.length} rulers</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Ruler Timeline */}
              {isExpanded && (
                <div className="px-3 pb-3">
                  {/* Timeline visualization */}
                  {span && (
                    <div className="relative h-2 bg-slate-600 rounded-full mb-3 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {rulerList.map((ruler, idx) => {
                      const isSelected = selected?.ruler === ruler.ruler && selected?.dynasty === dynastyName
                      const rulerSpan = ruler.end && ruler.start ? ruler.end - ruler.start : 0
                      const rulerPercent = span ? (rulerSpan / totalYears) * 100 : 100

                      return (
                        <button
                          key={`${ruler.ruler}-${idx}`}
                          onClick={() => onSelect?.({ ...ruler, dynasty: dynastyName })}
                          className={`
                            w-full text-left p-2.5 rounded-lg border transition-all duration-200
                            ${isSelected
                              ? 'bg-blue-500/20 border-blue-500'
                              : 'bg-slate-800/50 border-slate-700 hover:border-blue-400 hover:bg-slate-700/80'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {/* Timeline dot */}
                            <div className="relative flex-shrink-0">
                              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-800" />
                              {idx < rulerList.length - 1 && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-4 bg-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-white truncate">{ruler.ruler}</span>
                                {ruler.title && (
                                  <span className="text-xs text-slate-500 flex-shrink-0">{ruler.title}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {ruler.start && (
                                  <span className="text-xs text-slate-400">
                                    {formatYear(ruler.start)} – {ruler.end ? formatYear(ruler.end) : 'present'}
                                  </span>
                                )}
                                {rulerSpan > 0 && (
                                  <span className="text-xs text-slate-600">
                                    ({rulerSpan} yrs)
                                  </span>
                                )}
                              </div>
                              {/* Duration bar */}
                              {span && rulerSpan > 0 && (
                                <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500/50 rounded-full"
                                    style={{ width: `${rulerPercent}%` }}
                                  />
                                </div>
                              )}
                              {ruler.note && (
                                <p className="text-xs text-slate-500 mt-1 italic">{ruler.note}</p>
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
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No rulers found</p>
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