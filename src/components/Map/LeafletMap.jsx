import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const LeafletMap = ({ 
  territories, 
  kingdoms, 
  year, 
  onDistrictClick, 
  onKingdomHover,
  highlightKingdom,
  isWarping = false,
}) => {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const geoJSONLayerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [geoType, setGeoType] = useState('districts')

  // Kingdom color map
  const kingdomColors = useMemo(() => {
    const colors = {}
    kingdoms.forEach(k => {
      colors[k.name] = k.color || '#6366f1'
    })
    return colors
  }, [kingdoms])

  // Get the current ruling kingdom for a given year
  const getCurrentKingdom = useMemo(() => {
    if (!territories || territories.length === 0 || !kingdoms || kingdoms.length === 0) return null
    // Find the most prominent kingdom for this year (most territories)
    const kingdomCounts = {}
    territories.forEach(t => {
      if (t.startYear <= year && t.endYear >= year) {
        kingdomCounts[t.kingdomName] = (kingdomCounts[t.kingdomName] || 0) + 1
      }
    })
    const topKingdom = Object.keys(kingdomCounts).sort((a, b) => kingdomCounts[b] - kingdomCounts[a])[0]
    return kingdoms.find(k => k.name === topKingdom) || kingdoms[0]
  }, [territories, kingdoms, year])

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

  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [22.5, 78.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: true,
    })

    // Light/white tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map
    setMapReady(true)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      setMapReady(false)
    }
  }, [])

  // Load and render GeoJSON
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const loadGeoJSON = async () => {
      try {
        setLoading(true)
        // Load country outlines (India, Bangladesh, Pakistan, Nepal, Sri Lanka)
        const response = await fetch('/data/country-outlines.json')
        const geojson = await response.json()

        if (geoJSONLayerRef.current) {
          map.removeLayer(geoJSONLayerRef.current)
        }

        setGeoType('countries')

        // Get top kingdom for a given country code
        const getKingdomForCountry = (countryCode) => {
          const counts = {}
          territories.forEach(t => {
            if (t.districtCode.startsWith(countryCode + '-') && t.startYear <= year && t.endYear >= year) {
              counts[t.kingdomName] = (counts[t.kingdomName] || 0) + 1
            }
          })
          const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
          return kingdoms.find(k => k.name === top) || null
        }

        // Style function
        const styleFeature = (feature) => {
          const countryCode = feature.properties.country
          const kingdom = getKingdomForCountry(countryCode)
          const color = kingdom ? (kingdomColors[kingdom.name] || '#6366f1') : '#e2e8f0'
          return {
            fillColor: color,
            fillOpacity: 0.7,
            color: '#475569',
            weight: 2,
            opacity: 0.8,
          }
        }

        const layer = L.geoJSON(geojson, {
          style: styleFeature,
          onEachFeature: (feature, lyr) => {
            const countryCode = feature.properties.country
            const kingdom = getKingdomForCountry(countryCode)
            const countryName = countryCode === 'IN' ? 'India' : 
                               countryCode === 'BD' ? 'Bangladesh' :
                               countryCode === 'PK' ? 'Pakistan' :
                               countryCode === 'NP' ? 'Nepal' :
                               countryCode === 'LK' ? 'Sri Lanka' : countryCode

            // Tooltip
            lyr.bindTooltip(`
              <div class="font-semibold text-slate-800">${countryName}</div>
              <div class="text-sm text-slate-600">${kingdom ? kingdom.name : 'Independent'}</div>
              ${kingdom?.capital ? `<div class="text-xs text-slate-500">${kingdom.capital}</div>` : ''}
            `, {
              direction: 'top',
              offset: [0, -8],
              className: 'modern-tooltip',
            })

            // Hover effects
            lyr.on({
              mouseover: (e) => {
                lyr.setStyle({ weight: 3, fillOpacity: 0.9, color: '#1e293b' })
                lyr.bringToFront()
                if (kingdom) {
                  onKingdomHover?.(kingdom.name)
                }
              },
              mouseout: (e) => {
                lyr.setStyle(styleFeature(feature))
                if (kingdom) {
                  onKingdomHover?.(null)
                }
              },
              click: () => {
                if (kingdom) {
                  onDistrictClick?.({
                    districtCode: countryCode,
                    name: countryName,
                    kingdomName: kingdom.name,
                    capital: kingdom.capital,
                    description: kingdom.description,
                    color: kingdom.color,
                  })
                }
                if (countryCode === 'IN') {
                  map.setView([22.5, 78.5], 5, { animate: true })
                }
              },
            })

            // Popup
            lyr.bindPopup(`
              <div class="p-3 min-w-[200px]">
                <h3 class="font-bold text-lg text-slate-800">${countryName}</h3>
                <p class="text-sm text-slate-600">Ruled by: ${kingdom ? kingdom.name : 'Independent'}</p>
                ${kingdom?.capital ? `<p class="text-sm text-slate-500">Capital: ${kingdom.capital}</p>` : ''}
                <p class="text-xs text-slate-400 mt-2">Year: ${year}</p>
              </div>
            `, { maxWidth: 280 })
          },
        }).addTo(map)

        geoJSONLayerRef.current = layer

        // Fit map to show all countries
        map.fitBounds(layer.getBounds(), { padding: [20, 20] })

        setLoading(false)
      } catch (err) {
        console.error('Failed to load GeoJSON:', err)
        setLoading(false)
      }
    }

    loadGeoJSON()
  }, [mapReady, territories, kingdoms, year, getCurrentKingdom, kingdomColors])

  // Highlight kingdom
  useEffect(() => {
    const layer = geoJSONLayerRef.current
    if (!layer || !highlightKingdom) return

    layer.eachLayer(l => {
      if (geoType === 'countries') {
        // Country-based: highlight countries where this kingdom is top
        const countryCode = l.feature.properties?.country
        const countryTerritories = territories.filter(t => 
          t.districtCode.startsWith(countryCode + '-') && t.startYear <= year && t.endYear >= year
        )
        const counts = {}
        countryTerritories.forEach(t => {
          counts[t.kingdomName] = (counts[t.kingdomName] || 0) + 1
        })
        const topKingdomName = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
        
        if (topKingdomName === highlightKingdom) {
          l.setStyle({ weight: 3, fillOpacity: 1, color: '#1e293b' })
          l.bringToFront()
        } else {
          l.setStyle({ weight: 1, fillOpacity: 0.3, color: '#94a3b8' })
        }
      } else if (geoType === 'outline') {
        // Country outline — always highlight
        l.setStyle({ weight: 3, fillOpacity: 1, color: '#1e293b' })
      } else {
        const code = l.feature.properties.code
        const kName = districtKingdomMap[code]
        if (kName === highlightKingdom) {
          l.setStyle({ weight: 3, fillOpacity: 1, color: '#1e293b' })
          l.bringToFront()
        } else {
          l.setStyle({ weight: 1, fillOpacity: 0.3, color: '#94a3b8' })
        }
      }
    })
  }, [highlightKingdom, districtKingdomMap, geoType, territories, kingdoms, year])

  // Warp effect
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    const pane = map.getPane('overlayPane')
    if (!pane) return
    if (isWarping) {
      pane.classList.add('irt-blur-out')
    } else {
      pane.classList.remove('irt-blur-out')
    }
  }, [isWarping])

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full" style={{ background: '#f8fafc' }} />
    </div>
  )
}

export default LeafletMap
