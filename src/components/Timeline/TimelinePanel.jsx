import React, { useState, useEffect, useRef } from 'react'

const TimelinePanel = ({ 
  year, 
  onYearChange, 
  isPlaying, 
  onTogglePlay, 
  speed, 
  onSpeedChange,
  minYear = -1500,
  maxYear = 2024,
}) => {
  const [inputValue, setInputValue] = useState(year.toString())
  const intervalRef = useRef(null)

  useEffect(() => {
    setInputValue(year.toString())
  }, [year])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onYearChange(prev => {
          const next = prev + 1
          return next > maxYear ? minYear : next
        })
      }, speed)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, maxYear, minYear, onYearChange])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    let val = parseInt(inputValue)
    if (isNaN(val)) {
      setInputValue(year.toString())
      return
    }
    val = Math.max(minYear, Math.min(maxYear, val))
    onYearChange(val)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }

  const handleSliderChange = (e) => {
    onYearChange(parseInt(e.target.value))
  }

  const handleBackward = () => {
    onYearChange(Math.max(minYear, year - 1))
  }

  const handleForward = () => {
    onYearChange(Math.min(maxYear, year + 1))
  }

  const formatYear = (y) => {
    if (y < 0) return `${Math.abs(y)} BCE`
    return `${y} CE`
  }

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-lg animate-fade-in">
      <div className="card p-5 shadow-lg">
        {/* Year Display */}
        <div className="text-center mb-4">
          <span className="text-4xl font-display font-bold text-gray-800">
            {formatYear(year)}
          </span>
        </div>

        {/* Slider */}
        <div className="mb-4">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={handleSliderChange}
            className="timeline-slider w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatYear(minYear)}</span>
            <span>{formatYear(maxYear)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onYearChange(Math.max(minYear, year - 10))}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Go back 10 years"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleBackward}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Previous year"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={onTogglePlay}
            className="play-button"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleForward}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Next year"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => onYearChange(Math.min(maxYear, year + 10))}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Go forward 10 years"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Speed & Year Input */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="filter text-xs"
            >
              <option value={200}>0.5x</option>
              <option value={100}>1x</option>
              <option value={50}>2x</option>
              <option value={25}>4x</option>
              <option value={10}>10x</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="year-selector w-24 filter text-xs text-center"
              min={minYear}
              max={maxYear}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelinePanel
