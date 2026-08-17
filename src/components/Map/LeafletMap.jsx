import React, { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
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
  showDistrictBorders = true,
  isWarping = false,
  warpedYear = null,
}) => {
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const geoJSONLayerRef = useRef(null)
  const markersLayerRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)

  // Create a map of kingdom colors
  const kingdomColors = useMemo(() => {
    const colors = {}
    kingdoms.forEach(k => {
      colors[k.name] = k.color || '#' + Math.floor(Math.random()*16777215).toString(16)
    })
    return colors
  }, [kingdoms])

  // Get current ruler for a district code
  const getCurrentRuler = useCallback((districtCode) => {
    if (!territories || !year) return null
    return territories.find(
      t => t.districtCode === districtCode && t.startYear <= year && t.endYear >= year
    )
  }, [territories, year])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance) return

    const map = L.map(mapContainerRef.current, {
      center: [22.5, 78.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    })

    // Add tile layer (dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to bottom right
    L.control.zoom({
      position: 'bottomright',
    }).addTo(map)

    // Add attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: false,
    }).addTo(map)

    mapRef.current = map
    setMapInstance(map)

    return () => {
      map.remove()
    }
  }, [])

  // Update GeoJSON layer when territories/year changes
  useEffect(() => {
    if (!mapInstance || !territories || !year) return

    // Remove existing GeoJSON layer
    if (geoJSONLayerRef.current) {
      mapInstance.removeLayer(geoJSONLayerRef.current)
    }

    // Create features from territories data
    // Group territories by district and get current ruler
    const districtRulers = {}
    territories.forEach(t => {
      if (t.startYear <= year && t.endYear >= year) {
        districtRulers[t.districtCode] = t.kingdomName
      }
    })

    // Create GeoJSON features
    const features = Object.entries(districtRulers).map(([districtCode, kingdomName]) => {
      const kingdom = kingdoms.find(k => k.name === kingdomName)
      return {
        type: 'Feature',
        properties: {
          districtCode,
          kingdomName,
          color: kingdom?.color || '#6b7280',
          capital: kingdom?.capital || '',
          description: kingdom?.description || '',
        },
        geometry: {
          type: 'Point',
          coordinates: [78.5, 22.5], // Placeholder - actual GeoJSON would have real coordinates
        },
      }
    })

    const geoJSONData = {
      type: 'FeatureCollection',
      features,
    }

    // Add GeoJSON layer
    const geoJSONLayer = L.geoJSON(geoJSONData, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: feature.properties.color,
          color: '#1e293b',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        })
      },
      onEachFeature: (feature, layer) => {
        const { districtCode, kingdomName, capital, description, color } = feature.properties
        
        // Tooltip on hover
        layer.bindTooltip(
          `<div class="font-semibold">${districtCode}</div>
           <div class="text-sm text-gray-300">${kingdomName}</div>
           <div class="text-xs text-gray-400">Capital: ${capital}</div>`,
          {
            direction: 'top',
            offset: [0, -10],
            className: 'custom-tooltip',
          }
        )

        // Popup on click
        layer.bindPopup(
          `<div class="p-2">
            <h3 class="font-bold text-lg" style="color: ${color}">${kingdomName}</h3>
            <p class="text-sm text-gray-300">District: ${districtCode}</p>
            <p class="text-sm text-gray-300">Capital: ${capital}</p>
            <p class="text-sm mt-2">${description}</p>
            <p class="text-xs text-gray-400 mt-2">Year: ${year}</p>
          </div>`,
          {
            maxWidth: 300,
            className: 'custom-popup',
          }
        )

        // Hover effects
        layer.on('mouseover', (e) => {
          layer.setStyle({ weight: 3, fillOpacity: 1 })
          layer.bringToFront()
          onKingdomHover?.(kingdomName)
        })

        layer.on('mouseout', (e) => {
          layer.setStyle({ weight: 1, fillOpacity: 0.8 })
        })

        layer.on('click', (e) => {
          onDistrictClick?.({ districtCode, kingdomName, capital, description, color })
        })
      },
    }).addTo(mapInstance)

    geoJSONLayerRef.current = geoJSONLayer
  }, [mapInstance, territories, year, kingdoms, onDistrictClick, onKingdomHover])

  // Handle time warp animation
  useEffect(() => {
    if (!mapInstance) return
    
    const mapPane = mapInstance.getPane('overlayPane')
    if (!mapPane) return

    if (isWarping) {
      mapPane.classList.add('irt-blur-out')
    } else {
      mapPane.classList.remove('irt-blur-out')
    }
  }, [mapInstance, isWarping])

  // Highlight specific kingdom
  useEffect(() => {
    if (!geoJSONLayerRef.current || !highlightKingdom) return
    
    geoJSONLayerRef.current.eachLayer(layer => {
      if (layer.feature.properties.kingdomName === highlightKingdom) {
        layer.setStyle({ weight: 4, fillOpacity: 1, stroke: '#fff', strokeWidth: 2 })
        layer.bringToFront()
      } else {
        layer.setStyle({ weight: 1, fillOpacity: 0.4 })
      }
    })
  }, [highlightKingdom])

  return (
    <div 
      ref={mapContainerRef} 
      className="h-full w-full"
      style={{ background: '#0f172a' }}
    />
  )
}

export default LeafletMap
