import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMapData } from '../hooks/useMapData'

const StatePage = () => {
  const { slug, year: paramYear } = useParams()
  const { kingdoms, territories, dynastyRulers } = useMapData()
  const [selectedYear, setSelectedYear] = useState(parseInt(paramYear) || 1700)
  
  const stateName = decodeURIComponent(slug)
  
  // Filter territories for this state
  const stateTerritories = useMemo(() => {
    return territories.filter(t => 
      t.districtCode?.includes(stateName.toUpperCase()) || 
      t.state?.toLowerCase() === stateName.toLowerCase()
    )
  }, [territories, stateName])

  // Get unique kingdoms that ruled this state
  const stateKingdoms = useMemo(() => {
    const kingdomNames = [...new Set(stateTerritories.map(t => t.kingdomName))]
    return kingdomNames.map(name => kingdoms.find(k => k.name === name)).filter(Boolean)
  }, [stateTerritories, kingdoms])

  // Get ruler for selected year
  const currentRuler = stateTerritories.find(
    t => t.startYear <= selectedYear && t.endYear >= selectedYear
  )

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">← Back to Atlas</Link>
        
        <h1 className="text-4xl font-bold text-white font-playfair mb-2">{stateName}</h1>
        <p className="text-slate-400 mb-8">Historical timeline of kingdoms that ruled this state</p>

        {/* Year Selector */}
        <div className="mb-8">
          <label className="text-sm text-slate-400 block mb-2">Select Year</label>
          <input
            type="range"
            min={-1500}
            max={2024}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="timeline-slider w-full max-w-md"
          />
          <span className="text-white font-playfair text-xl ml-4">
            {selectedYear < 0 ? `${Math.abs(selectedYear)} BCE` : `${selectedYear} CE`}
          </span>
        </div>

        {/* Current Ruler */}
        {currentRuler && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Ruler in {selectedYear}</h2>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: kingdoms.find(k => k.name === currentRuler.kingdomName)?.color || '#6b7280' }}
              />
              <span className="text-white font-semibold">{currentRuler.kingdomName}</span>
            </div>
          </div>
        )}

        {/* Kingdoms that ruled this state */}
        <h2 className="text-2xl font-semibold text-white mb-4">Kingdoms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateKingdoms.map((kingdom) => (
            <Link
              key={kingdom.name}
              to={`/cards/${encodeURIComponent(kingdom.name)}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: kingdom.color || '#6b7280' }}
                />
                <div>
                  <h3 className="font-semibold text-white">{kingdom.name}</h3>
                  <p className="text-xs text-slate-400">{kingdom.capital}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatePage
