import React from 'react'
import { useMapData } from '../hooks/useMapData'

const SourcesPage = () => {
  const { sources, loading } = useMapData()

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading sources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white font-playfair mb-2">Sources</h1>
        <p className="text-slate-400 mb-8">Academic references and historical records used in this atlas</p>

        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{source.name || source}</h3>
                  {source.description && <p className="text-sm text-slate-400 mt-1">{source.description}</p>}
                </div>
                {source.id && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{source.id}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SourcesPage
