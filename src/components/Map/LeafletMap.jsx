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

  // Kingdom color map
  const kingdomColors = useMemo(() => {
    const colors = {}
    kingdoms.forEach(k => {
      colors[k.name] = k.color || '#6366f1'
    })
    return colors
  }, [kingdoms])

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

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Load and render GeoJSON
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const loadGeoJSON = async () => {
      try {
        setLoading(true)
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
            const kingdomName = districtKingdomMap[code]
            const kingdom = kingdoms.find(k => k.name === kingdomName)

            layer.on({
              mouseover: (e) => {
                layer.setStyle({ weight: 2, fillOpacity: 0.9, color: '#475569' })
                layer.bringToFront()
                if (kingdomName) {
                  onKingdomHover?.(kingdomName)
                }
              },
              mouseout: (e) => {
                layer.setStyle({ weight: 1, fillOpacity: kingdomName ? 0.7 : 0.1, color: '#94a3b8' })
              },
              click: () => {
                if (kingdom) {
                  onDistrictClick?.({
                    districtCode: code,
                    name,
                    kingdomName: kingdom.name,
                    capital: kingdom.capital,
                    description: kingdom.description,
                    color: kingdom.color,
                  })
                }
              },
            })

            if (kingdomName) {
              layer.bindTooltip(`
                <div class="font-semibold text-slate-800">${name}</div>
                <div class="text-sm text-slate-600">${kingdomName}</div>
                <div class="text-xs text-slate-500">${kingdom?.capital || ''}</div>
              `, {
                direction: 'top',
                offset: [0, -8],
                className: 'modern-tooltip',
              })

              layer.bindPopup(`
                <div class="p-3 min-w-[200px]">
                  <h3 class="font-bold text-lg text-slate-800">${kingdomName}</h3>
                  <p class="text-sm text-slate-600">District: ${name}</p>
                  <p class="text-sm text-slate-600">Capital: ${kingdom?.capital || 'N/A'}</p>
                  <p class="text-sm text-slate-500 mt-2">${kingdom?.description || ''}</p>
                  <p class="text-xs text-slate-400 mt-2">Year: ${year}</p>
                </div>
              `, { maxWidth: 280 })
            }
          },
        }).addTo(map)

        geoJSONLayerRef.current = layer
        setLoading(false)
      } catch (err) {
        console.error('Failed to load GeoJSON:', err)
        setLoading(false)
      }
    }

    loadGeoJSON()
  }, [mapInstanceRef.current, districtKingdomMap, kingdoms, year])

  // Highlight kingdom
  useEffect(() => {
    const layer = geoJSONLayerRef.current
    if (!layer || !highlightKingdom) return

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
  }, [highlightKingdom, districtKingdomMap])

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
