import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMapData } from '../hooks/useMapData'

const CardDetailPage = () => {
  const { slug } = useParams()
  const { kingdoms, dynastyRulers, territories } = useMapData()
  
  const kingdomName = decodeURIComponent(slug)
  const kingdom = kingdoms.find(k => k.name === kingdomName)
  const rulers = dynastyRulers[kingdomName] || []
  const kingdomTerritories = territories.filter(t => t.kingdomName === kingdomName)

  if (!kingdom) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Kingdom Not Found</h2>
          <p className="text-slate-400 mb-4">The kingdom "{kingdomName}" could not be found.</p>
          <Link to="/cards" className="text-blue-400 hover:text-blue-300">← Back to Cards</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/cards" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">← Back to Cards</Link>
        
        <div className="flex items-start gap-4 mb-8">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: kingdom.color || '#6b7280' }} />
          <div>
            <h1 className="text-4xl font-bold text-white font-playfair">{kingdom.name}</h1>
            {kingdom.type && <p className="text-slate-400">{kingdom.type}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
            <div className="space-y-3">
              {kingdom.capital && (
                <div>
                  <span className="text-slate-400 text-sm">Capital</span>
                  <p className="text-white">{kingdom.capital}</p>
                </div>
              )}
              {kingdom.founded && (
                <div>
                  <span className="text-slate-400 text-sm">Founded</span>
                  <p className="text-white">{kingdom.founded}</p>
                </div>
              )}
              <div>
                <span className="text-slate-400 text-sm">Territories</span>
                <p className="text-white">{kingdomTerritories.length} districts</p>
              </div>
            </div>
            {kingdom.description && (
              <div className="mt-4">
                <span className="text-slate-400 text-sm">Description</span>
                <p className="text-slate-300 mt-1">{kingdom.description}</p>
              </div>
            )}
          </div>

          {rulers.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Rulers</h2>
              <div className="space-y-2">
                {rulers.map((ruler, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                    <span className="text-white">{ruler.ruler}</span>
                    <span className="text-slate-400 text-sm">{ruler.start} - {ruler.end}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardDetailPage
