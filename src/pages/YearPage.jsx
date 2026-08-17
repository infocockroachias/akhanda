import React, { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LeafletMap from '../components/Map/LeafletMap'
import TimelinePanel from '../components/Timeline/TimelinePanel'
import MapLegend from '../components/Map/MapLegend'
import TimeWarpOverlay from '../components/Map/TimeWarpOverlay'
import Sidebar from '../components/Sidebar/Sidebar'
import { useMapData } from '../hooks/useMapData'

const YearPage = () => {
  const { year: paramYear } = useParams()
  const navigate = useNavigate()
  const initialYear = parseInt(paramYear) || 1700

  const [year, setYear] = useState(initialYear)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [isWarping, setIsWarping] = useState(false)
  const [selectedKingdom, setSelectedKingdom] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('kingdoms')
  const [highlightKingdom, setHighlightKingdom] = useState(null)

  const {
    kingdoms,
    territories,
    events,
    milestones,
    eras,
    dynastyRulers,
    capitals,
    capitalCoords,
    sources,
    loading,
    error,
  } = useMapData()

  const changeYear = useCallback((newYear) => {
    setIsWarping(true)
    setYear(newYear)
    setTimeout(() => setIsWarping(false), 400)
  }, [])

  const handleYearChange = useCallback((newYear) => {
    setYear(newYear)
    navigate(`/year/${newYear}`)
  }, [navigate])

  const handleKingdomClick = useCallback((kingdom) => {
    setSelectedKingdom(kingdom)
    setHighlightKingdom(kingdom.name)
  }, [])

  const handleDistrictClick = useCallback((district) => {
    setSelectedDistrict(district)
  }, [])

  const handleKingdomHover = useCallback((kingdomName) => {
    setHighlightKingdom(kingdomName)
  }, [])

  const rulers = useMemo(() => {
    const result = []
    Object.entries(dynastyRulers).forEach(([dynasty, dynastyRulers]) => {
      dynastyRulers.forEach(ruler => {
        result.push({ ...ruler, dynasty })
      })
    })
    return result
  }, [dynastyRulers])

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

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error loading data</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-white">
      {/* Map */}
      <div className="absolute inset-0">
        <LeafletMap
          territories={territories}
          kingdoms={kingdoms}
          year={year}
          onDistrictClick={handleDistrictClick}
          onKingdomHover={handleKingdomHover}
          highlightKingdom={highlightKingdom}
          isWarping={isWarping}
          warpedYear={year}
        />
      </div>

      {/* Map Legend */}
      <MapLegend
        kingdoms={kingdoms}
        onKingdomClick={handleKingdomClick}
        selectedKingdom={selectedKingdom?.name}
      />

      {/* Time Warp Overlay */}
      <TimeWarpOverlay isActive={isWarping} year={year} />

      {/* Timeline Panel */}
      <TimelinePanel
        year={year}
        onYearChange={handleYearChange}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        kingdoms={kingdoms}
        events={events}
        rulers={rulers}
        sources={sources}
        onKingdomSelect={handleKingdomClick}
        onEventSelect={(event) => handleYearChange(event.year)}
        selectedKingdom={selectedKingdom}
      />

      {/* District Detail Popup */}
      {selectedDistrict && (
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
          <div className="card p-5 min-w-[280px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-gray-800">{selectedDistrict.kingdomName}</h3>
                <p className="text-sm text-gray-600 mt-1">District: {selectedDistrict.name}</p>
                <p className="text-sm text-gray-600">Capital: {selectedDistrict.capital || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">{selectedDistrict.description}</p>
              </div>
              <button
                onClick={() => setSelectedDistrict(null)}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YearPage
