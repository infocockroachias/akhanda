import React from 'react'

const TimeWarpOverlay = ({ isActive, year, mapCenter }) => {
  if (!isActive) return null

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* Flash overlay */}
      <div className="absolute inset-0 bg-white animate-warp-flash" />

      {/* Expanding ring */}
      <div
        className="absolute animate-warp-ring"
        style={{
          left: '50%',
          top: '50%',
          width: '200px',
          height: '200px',
          marginLeft: '-100px',
          marginTop: '-100px',
          borderRadius: '50%',
          border: '3px solid rgba(59, 130, 246, 0.6)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
        }}
      />

      {/* Year label */}
      <div
        className="absolute animate-warp-label"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/50 rounded-xl px-8 py-4 shadow-2xl">
          <span className="text-5xl font-bold text-white font-playfair">
            {year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TimeWarpOverlay
