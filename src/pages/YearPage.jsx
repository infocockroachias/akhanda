import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapData } from '../hooks/useMapData'

// --- Leaflet Setup ---
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const MIN_YEAR = -1500
const MAX_YEAR = 2024

const YearPage = () => {
  const { year: paramYear } = useParams()
  const navigate = useNavigate()
  const initialYear = parseInt(paramYear) || 1707

  const [year, setYear] = useState(initialYear)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [isWarping, setIsWarping] = useState(false)
  const [selectedKingdom, setSelectedKingdom] = useState(null)
  const [highlightKingdom, setHighlightKingdom] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Map refs
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const geoJSONLayerRef = useRef(null)
  const battleMarkersRef = useRef([])
  const playIntervalRef = useRef(null)

  const {
    kingdoms,
    territories,
    events,
    milestones,
    dynastyRulers,
    capitals,
    capitalCoords,
    loading,
    error,
  } = useMapData()

  // Build district-to-kingdom mapping for selected year
  const districtKingdomMap = useMemo(() => {
    const map = {}
    territories.forEach(t => {
      if (t.startYear <= year && t.endYear >= year) {
        map[t.districtCode] = t.kingdomName
      }
    })
    return map
  }, [territories, year])

  // Kingdom color map
  const kingdomColors = useMemo(() => {
    const colors = {}
    kingdoms.forEach(k => {
      colors[k.name] = k.color || '#6366f1'
    })
    return colors
  }, [kingdoms])

  // Filtered kingdoms for current year with area
  const kingdomsForYear = useMemo(() => {
    const result = []
    const seen = new Set()
    territories.forEach(t => {
      if (t.startYear <= year && t.endYear >= year && !seen.has(t.kingdomName)) {
        seen.add(t.kingdomName)
        const kingdom = kingdoms.find(k => k.name === t.kingdomName)
        if (kingdom) {
          result.push(kingdom)
        }
      }
    })
    return result.sort((a, b) => (b.endYear - b.startYear) - (a.endYear - a.startYear))
  }, [territories, kingdoms, year])

  // Events for current year
  const eventsForYear = useMemo(() => {
    return events.filter(e => e.year === year)
  }, [events, year])

  // Milestones for current year
  const milestonesForYear = useMemo(() => {
    return milestones.filter(m => m.year === year)
  }, [milestones, year])

  // All events with coordinates for battle markers
  const battleEvents = useMemo(() => {
    return events.filter(e => e.year === year && e.lat && e.lng)
  }, [events, year])

  // Filtered kingdoms based on search
  const filteredKingdoms = useMemo(() => {
    if (!searchQuery) return kingdomsForYear
    const q = searchQuery.toLowerCase()
    return kingdomsForYear.filter(k =>
      k.name?.toLowerCase().includes(q) ||
      k.description?.toLowerCase().includes(q) ||
      k.capital?.toLowerCase().includes(q)
    )
  }, [kingdomsForYear, searchQuery])

  // --- Map Initialization ---
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [22.5, 78.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[6.5, 68.0], [37.0, 97.5]],
      maxBoundsViscosity: 0.8,
    })

    // Simple light background
    map.getContainer().style.backgroundColor = '#f8fafc'

    L.control.zoom({ position: 'bottomleft' }).addTo(map)

    mapInstanceRef.current = map

    // Fix map size after layout settles
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // --- Load GeoJSON (once) ---
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const loadGeoJSON = async () => {
      try {
        const response = await fetch('/data/districts.geojson')
        const geojson = await response.json()

        if (geoJSONLayerRef.current) {
          map.removeLayer(geoJSONLayerRef.current)
        }

        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const code = feature.properties.code
            const kingdomName = districtKingdomMap[code]
            const color = kingdomColors[kingdomName] || '#e2e8f0'
            return {
              fillColor: color,
              fillOpacity: kingdomName ? 0.7 : 0.1,
              color: '#94a3b8',
              weight: 1,
              opacity: 0.6,
            }
          },
          onEachFeature: (feature, layer) => {
            const code = feature.properties.code
            const name = feature.properties.name || feature.properties.NAME_2 || code

            layer.on({
              mouseover: (e) => {
                const kingdomName = districtKingdomMap[code]
                const kingdom = kingdoms.find(k => k.name === kingdomName)
                layer.setStyle({ weight: 2, fillOpacity: 0.9, color: '#475569' })
                layer.bringToFront()
              },
              mouseout: (e) => {
                const kingdomName = districtKingdomMap[code]
                const color = kingdomColors[kingdomName] || '#e2e8f0'
                layer.setStyle({ weight: 1, fillOpacity: kingdomName ? 0.7 : 0.1, color: '#94a3b8', fillColor: color })
              },
              click: () => {
                const kingdomName = districtKingdomMap[code]
                const kingdom = kingdoms.find(k => k.name === kingdomName)
                if (kingdom) {
                  setSelectedKingdom(kingdom)
                  setHighlightKingdom(kingdom.name)
                }
              },
            })
          },
        }).addTo(map)

        geoJSONLayerRef.current = layer
      } catch (err) {
        console.error('Failed to load GeoJSON:', err)
      }
    }

    loadGeoJSON()
  }, [mapInstanceRef.current])

  // --- Update map size on window resize ---
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // --- Update styles when year changes ---
  useEffect(() => {
    const layer = geoJSONLayerRef.current
    if (!layer) return

    layer.eachLayer(l => {
      const code = l.feature.properties.code
      const kName = districtKingdomMap[code]
      const color = kingdomColors[kName] || '#e2e8f0'
      l.setStyle({ weight: 1, fillOpacity: kName ? 0.7 : 0.1, color: '#94a3b8', fillColor: color })
    })
  }, [districtKingdomMap, kingdomColors])

  // --- Highlight Kingdom ---
  useEffect(() => {
    const layer = geoJSONLayerRef.current
    if (!layer) return

    if (highlightKingdom) {
      layer.eachLayer(l => {
        const code = l.feature.properties.code
        const kName = districtKingdomMap[code]
        if (kName === highlightKingdom) {
          l.setStyle({ weight: 3, fillOpacity: 1, color: '#1e293b' })
          l.bringToFront()
        } else {
          l.setStyle({ weight: 1, fillOpacity: 0.3, color: '#94a3b8' })
        }
      })
    } else {
      layer.eachLayer(l => {
        const code = l.feature.properties.code
        const kName = districtKingdomMap[code]
        const color = kingdomColors[kName] || '#e2e8f0'
        l.setStyle({ weight: 1, fillOpacity: kName ? 0.7 : 0.1, color: '#94a3b8', fillColor: color })
      })
    }
  }, [highlightKingdom, districtKingdomMap, kingdomColors])

  // --- Battle Markers ---
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove old markers
    battleMarkersRef.current.forEach(m => map.removeLayer(m))
    battleMarkersRef.current = []

    // Add new battle markers
    battleEvents.forEach(event => {
      const icon = L.divIcon({
        className: 'battle-pin',
        html: `<div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:#dc2626;color:#fff;border:2px solid #fff;border-radius:50%;font-size:12px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.45);cursor:pointer;"><span>⚔</span></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([event.lat, event.lng], { icon })
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h4 class="font-bold text-sm text-slate-800">${event.text}</h4>
            <p class="text-xs text-slate-500 mt-1">Year: ${event.year}</p>
            ${event.source ? `<p class="text-xs text-slate-400 mt-1">Source: ${event.source}</p>` : ''}
          </div>
        `)
        .addTo(map)

      battleMarkersRef.current.push(marker)
    })
  }, [battleEvents])

  // --- Playback ---
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setYear(prev => {
          const next = prev + 1
          return next > MAX_YEAR ? MIN_YEAR : next
        })
      }, speed)
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, speed])

  // --- Handlers ---
  const handleYearChange = useCallback((newYear) => {
    setYear(newYear)
    navigate(`/year/${newYear}`)
  }, [navigate])

  const handleKingdomClick = useCallback((kingdom) => {
    setSelectedKingdom(kingdom)
    setHighlightKingdom(kingdom.name)
  }, [])

  const handleSearchSelect = useCallback((kingdom) => {
    handleKingdomClick(kingdom)
    setSearchQuery('')
    setShowSearch(false)
  }, [handleKingdomClick])

  const formatYear = (y) => {
    if (y < 0) return `${Math.abs(y)} BCE`
    return `${y} CE`
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading historical data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar - Rulers & Events */}
        <div className="w-[320px] border-r border-gray-200 flex flex-col bg-white overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search district, kingdom, king, battle..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true) }}
                onFocus={() => setShowSearch(true)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
              />
              {showSearch && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredKingdoms.length > 0 ? (
                    filteredKingdoms.slice(0, 10).map(k => (
                      <button
                        key={k.name}
                        onClick={() => handleSearchSelect(k)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 text-sm"
                      >
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: k.color }} />
                        <span className="truncate">{k.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Who Ruled Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.562 3.266a.5.5 0 01.876 0l2.952 5.604a1 1 0 001.516.294l4.277-3.664a.5.5 0 01.798.519l-2.834 10.246a1 1 0 01-.956.734H5.81a1 1 0 01-.957-.734L2.02 6.02a.5.5 0 01.798-.519l4.276 3.664a1 1 0 001.516-.294l2.952-5.604z" />
                </svg>
                <h2 className="font-serif text-xl font-semibold text-gray-900">Who Ruled</h2>
              </div>
              <p className="text-xs text-gray-500 mb-3">Reigning powers in {year}</p>

              <ul className="space-y-2">
                {kingdomsForYear.slice(0, 12).map(kingdom => (
                  <li
                    key={kingdom.name}
                    className={`flex items-start gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                      highlightKingdom === kingdom.name ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleKingdomClick(kingdom)}
                    onMouseEnter={() => setHighlightKingdom(kingdom.name)}
                    onMouseLeave={() => setHighlightKingdom(null)}
                  >
                    <span className="mt-0.5 shrink-0">
                      <span
                        className="inline-block rounded-[2px] border border-black/10"
                        style={{ width: 20, height: 13, backgroundColor: kingdom.color }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-sm font-semibold leading-tight truncate" style={{ color: kingdom.color ? `color-mix(in srgb, ${kingdom.color} 32%, #1e293b)` : '#1e293b' }}>
                          {kingdom.name}
                        </span>
                        <span className="shrink-0 text-[11px] font-bold text-slate-500">
                          ≈{((kingdom.endYear - kingdom.startYear) * 100 / (MAX_YEAR - MIN_YEAR)).toFixed(0)}k km²
                        </span>
                      </div>
                      {kingdom.capital && (
                        <div className="text-xs text-gray-700 leading-tight">
                          <span className="font-medium text-gray-900">{kingdom.capital}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {kingdomsForYear.length > 12 && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mt-2 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
                >
                  ▼ Show all {kingdomsForYear.length} powers
                </button>
              )}

              <p className="mt-3 text-[10px] text-gray-400">De-facto rulers; post-1947 shows elected leaders / military rulers.</p>
            </div>

            {/* Events of the Year */}
            {(eventsForYear.length > 0 || milestonesForYear.length > 0) && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
                  </svg>
                  <h2 className="font-serif text-xl font-semibold text-gray-900">That Year in History</h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">Notable events across India in {year}</p>

                {eventsForYear.filter(e => e.category === 'War').length > 0 && (
                  <div className="rounded-md bg-red-50/70 border border-red-100 p-2.5 mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <svg className="w-4 h-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
                      </svg>
                      <span className="font-serif font-bold text-sm text-red-900">Battles & Wars</span>
                      <span className="text-[10px] text-red-700/70">{eventsForYear.filter(e => e.category === 'War').length}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {eventsForYear.filter(e => e.category === 'War').slice(0, 5).map((event, i) => (
                        <li key={i} className="text-sm leading-snug">
                          <div className="flex gap-1.5 text-gray-900 font-semibold">
                            <span className="text-red-500 mt-[3px] text-[8px]">●</span>
                            <span>{event.text}</span>
                          </div>
                          {event.source && (
                            <div className="pl-3.5 text-xs font-normal text-gray-600 leading-tight">{event.source}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {milestonesForYear.length > 0 && (
                  <div className="rounded-md bg-blue-50/70 border border-blue-100 p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="font-serif font-bold text-sm text-blue-900">Milestones</span>
                      <span className="text-[10px] text-blue-700/70">{milestonesForYear.length}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {milestonesForYear.slice(0, 3).map((m, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-snug">{m.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-3 text-[10px] text-gray-400">Curated from our cited sources, supplemented by Wikipedia</p>
              </div>
            )}
          </div>
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative min-h-[400px]">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

          {/* Year Display Overlay */}
          <div className="absolute top-3 right-3 z-[720] pointer-events-none">
            <div className="rounded-md backdrop-blur-sm border border-gray-200 shadow px-3 py-1 font-serif font-bold text-2xl tabular-nums leading-none bg-white/85 text-gray-900">
              {year}
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-3 left-2 z-[950] flex flex-row gap-0.5 rounded-lg border border-gray-200 bg-white/90 p-0.5 shadow-sm backdrop-blur-sm">
            <button onClick={() => mapInstanceRef.current?.zoomIn()} className="p-2 hover:bg-gray-100 rounded" title="Zoom in">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
              </svg>
            </button>
            <button onClick={() => mapInstanceRef.current?.zoomOut()} className="p-2 hover:bg-gray-100 rounded" title="Zoom out">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" />
              </svg>
            </button>
            <button onClick={() => mapInstanceRef.current?.setView([22.5, 78.5], 5)} className="p-2 hover:bg-gray-100 rounded" title="Reset view">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Warp Overlay */}
          {isWarping && (
            <div className="absolute inset-0 z-[600] pointer-events-none bg-white/50 animate-pulse" />
          )}

          {/* Watermark */}
          <div className="pointer-events-none absolute left-4 top-[72%] z-[620] select-none text-[11px] font-semibold tracking-[0.18em] text-slate-500/50">
            akhandbharat
          </div>
        </div>

        {/* Right Sidebar - Kingdom Details */}
        <div className={`w-[280px] border-l border-gray-200 bg-white overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="p-4">
            {selectedKingdom ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-4 h-4 rounded-sm border border-black/10" style={{ backgroundColor: selectedKingdom.color }} />
                  <h3 className="font-serif text-lg font-semibold text-gray-900">{selectedKingdom.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  {selectedKingdom.capital && (
                    <p><span className="font-medium text-gray-900">Capital:</span> {selectedKingdom.capital}</p>
                  )}
                  {selectedKingdom.type && (
                    <p><span className="font-medium text-gray-900">Type:</span> {selectedKingdom.type}</p>
                  )}
                  {selectedKingdom.founded && (
                    <p><span className="font-medium text-gray-900">Founded:</span> {selectedKingdom.founded}</p>
                  )}
                  {selectedKingdom.ended && (
                    <p><span className="font-medium text-gray-900">Ended:</span> {selectedKingdom.ended}</p>
                  )}
                  {selectedKingdom.description && (
                    <p className="mt-3 text-gray-600 leading-relaxed">{selectedKingdom.description}</p>
                  )}
                  {selectedKingdom.notableRulers && (
                    <p className="mt-2"><span className="font-medium text-gray-900">Notable Rulers:</span> {selectedKingdom.notableRulers}</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-500 text-sm">Click a region on the map to read its story.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {/* Year Input & Controls */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <input
              type="number"
              value={year}
              onChange={(e) => handleYearChange(Math.max(MIN_YEAR, Math.min(MAX_YEAR, parseInt(e.target.value) || MIN_YEAR)))}
              className="w-20 text-center text-xl font-bold border border-gray-200 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <div className="flex flex-col gap-0.5">
              <button onClick={() => handleYearChange(Math.min(MAX_YEAR, year + 1))} className="p-0.5 hover:bg-gray-100 rounded" title="Next year">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button onClick={() => handleYearChange(Math.max(MIN_YEAR, year - 1))} className="p-0.5 hover:bg-gray-100 rounded" title="Previous year">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isPlaying ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isPlaying ? (
                <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg> Pause</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Time Machine</>
              )}
            </button>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatYear(MIN_YEAR)}</span>
              <span>{formatYear(MAX_YEAR)}</span>
            </div>
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-xs text-gray-500">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              <option value={200}>0.5x</option>
              <option value={100}>1x</option>
              <option value={50}>2x</option>
              <option value={25}>4x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearPage
