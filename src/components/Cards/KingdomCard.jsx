import React from 'react'
import { Link } from 'react-router-dom'

const KingdomCard = ({ kingdom, onClick, isSelected }) => {
  if (!kingdom) return null

  return (
    <div
      className={`bg-card p-4 rounded-lg border transition-all cursor-pointer hover:border-blue-500 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700'
      }`}
      onClick={() => onClick?.(kingdom)}
    >
      <div className="flex items-start gap-3">
        {/* Color swatch */}
        <div
          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: kingdom.color || '#6b7280' }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{kingdom.name}</h3>
          {kingdom.capital && (
            <p className="text-xs text-slate-400 mt-0.5">Capital: {kingdom.capital}</p>
          )}
          {kingdom.type && (
            <p className="text-xs text-slate-500 mt-0.5">{kingdom.type}</p>
          )}
          {kingdom.description && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{kingdom.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const BattleCard = ({ battle, onClick }) => {
  if (!battle) return null

  const categoryColors = {
    War: '#ef4444',
    Birth: '#22c55e',
    Death: '#6b7280',
    Treaty: '#3b82f6',
    Foundation: '#f59e0b',
    Coronation: '#a855f7',
    Battle: '#ef4444',
  }

  return (
    <div
      className="bg-card p-4 rounded-lg border border-slate-700 transition-all cursor-pointer hover:border-blue-500"
      onClick={() => onClick?.(battle)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: (categoryColors[battle.category] || '#6b7280') + '20',
                color: categoryColors[battle.category] || '#6b7280',
              }}
            >
              {battle.category}
            </span>
            <span className="text-xs text-slate-500">{battle.year}</span>
          </div>
          <p className="text-sm text-white mt-2">{battle.text}</p>
          {battle.source && (
            <p className="text-xs text-slate-500 mt-2">Source: {battle.source}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const EventCard = ({ event, onClick }) => {
  if (!event) return null

  return (
    <div
      className="bg-card p-4 rounded-lg border border-slate-700 transition-all cursor-pointer hover:border-blue-500"
      onClick={() => onClick?.(event)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-16 text-center">
          <span className="text-lg font-bold text-white">{event.year}</span>
        </div>
        <div className="flex-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
            {event.category}
          </span>
          <p className="text-sm text-slate-300 mt-1">{event.text}</p>
        </div>
      </div>
    </div>
  )
}

export { KingdomCard, BattleCard, EventCard }
export default KingdomCard
