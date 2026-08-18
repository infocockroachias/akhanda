import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for loading and managing map data
 */
export function useMapData() {
  const [kingdoms, setKingdoms] = useState([])
  const [territories, setTerritories] = useState([])
  const [events, setEvents] = useState([])
  const [milestones, setMilestones] = useState([])
  const [eras, setEras] = useState([])
  const [dynastyRulers, setDynastyRulers] = useState({})
  const [capitals, setCapitals] = useState({})
  const [capitalCoords, setCapitalCoords] = useState({})
  const [districtAreas, setDistrictAreas] = useState({})
  const [sources, setSources] = useState([])
  const [districtGeo, setDistrictGeo] = useState(null)
  const [territoryMeta, setTerritoryMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const endpoints = [
          { url: '/data/kingdoms.json', setter: setKingdoms },
          { url: '/data/territories.json', setter: setTerritories },
          { url: '/data/events.json', setter: setEvents },
          { url: '/data/milestones.json', setter: setMilestones },
          { url: '/data/eras.json', setter: setEras },
          { url: '/data/dynasty_rulers.json', setter: setDynastyRulers },
          { url: '/data/capitals.json', setter: setCapitals },
          { url: '/data/capital_coords.json', setter: setCapitalCoords },
          { url: '/data/district_areas.json', setter: setDistrictAreas },
          { url: '/data/sources.json', setter: setSources },
          { url: '/data/india-districts.geojson', setter: setDistrictGeo },
          { url: '/data/territory-meta.json', setter: setTerritoryMeta },
        ]

        const results = await Promise.allSettled(
          endpoints.map(async ({ url, setter }) => {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`Failed to fetch ${url}`)
            const data = await response.json()
            setter(data)
          })
        )

        const failures = results.filter(r => r.status === 'rejected')
        if (failures.length > 0) {
          console.warn(`Failed to load ${failures.length} data files`)
        }

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return {
    kingdoms,
    territories,
    events,
    milestones,
    eras,
    dynastyRulers,
    capitals,
    capitalCoords,
    districtAreas,
    sources,
    districtGeo,
    territoryMeta,
    loading,
    error,
  }
}

/**
 * Custom hook for managing the selected year
 */
export function useYear(initialYear = 1700) {
  const [year, setYear] = useState(initialYear)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(100) // ms per year
  const [isWarping, setIsWarping] = useState(false)

  const changeYear = useCallback((newYear) => {
    setIsWarping(true)
    setYear(newYear)
    setTimeout(() => setIsWarping(false), 400)
  }, [])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const togglePlay = useCallback(() => setIsPlaying(p => !p), [])

  return {
    year,
    setYear: changeYear,
    isPlaying,
    play,
    pause,
    togglePlay,
    speed,
    setSpeed,
    isWarping,
  }
}

/**
 * Custom hook for timeline animation
 */
export function useTimeline(onYearChange, minYear = -1500, maxYear = 2024) {
  const [currentYear, setCurrentYear] = useState(1700)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(100)
  const intervalRef = React.useRef(null)

  const startPlayback = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
    } else {
      startPlayback()
    }
  }, [isPlaying, startPlayback, stopPlayback])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentYear(prev => {
          const next = prev + 1
          if (next > maxYear) return minYear
          onYearChange?.(next)
          return next
        })
      }, speed)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, maxYear, minYear, onYearChange])

  return {
    currentYear,
    setCurrentYear,
    isPlaying,
    togglePlayback,
    speed,
    setSpeed,
  }
}

/**
 * Hook for fetching GeoJSON data
 */
export function useGeoJSON() {
  const [geoJSON, setGeoJSON] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch('/data/districts.geojson')
        const data = await response.json()
        setGeoJSON(data)
      } catch (err) {
        console.error('Failed to load GeoJSON:', err)
      } finally {
        setLoading(false)
      }
    }
    loadGeoJSON()
  }, [])

  return { geoJSON, loading }
}

/**
 * Hook for filtering territories by year
 */
export function useFilteredTerritories(territories, year) {
  return React.useMemo(() => {
    if (!territories || !year) return []
    return territories.filter(
      t => t.startYear <= year && t.endYear >= year
    )
  }, [territories, year])
}

/**
 * Hook for getting kingdom by name
 */
export function useKingdomByName(kingdoms, name) {
  return React.useMemo(() => {
    if (!kingdoms || !name) return null
    return kingdoms.find(k => k.name === name)
  }, [kingdoms, name])
}

/**
 * Hook for searching events/milestones
 */
export function useSearch(items, query) {
  return React.useMemo(() => {
    if (!query || !items) return items
    const q = query.toLowerCase()
    return items.filter(item =>
      item.text?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.year?.toString().includes(q)
    )
  }, [items, query])
}
