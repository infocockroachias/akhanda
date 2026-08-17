import React from 'react'
import KingdomList from './KingdomList'
import EventList from './EventList'
import RulerList from './RulerList'
import SourceList from './SourceList'

const TABS = [
  { id: 'kingdoms', label: 'Kingdoms', icon: '🏰' },
  { id: 'events', label: 'Events', icon: '⚔️' },
  { id: 'rulers', label: 'Rulers', icon: '👑' },
  { id: 'sources', label: 'Sources', icon: '📚' },
]

export default function Sidebar({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  kingdoms = [],
  events = [],
  rulers = [],
  sources = [],
  onKingdomSelect,
  onEventSelect,
  onRulerSelect,
  onSourceSelect,
  selectedKingdom,
  selectedEvent,
  selectedRuler,
  selectedSource,
}) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 shadow-md transition-all duration-200"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white border-l border-gray-200
          shadow-xl z-[999] transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium
                transition-all duration-200 border-b-2
                ${activeTab === tab.id
                  ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="h-[calc(100%-49px)] overflow-y-auto">
          {activeTab === 'kingdoms' && (
            <KingdomList
              kingdoms={kingdoms}
              onSelect={onKingdomSelect}
              selected={selectedKingdom}
            />
          )}
          {activeTab === 'events' && (
            <EventList
              events={events}
              onSelect={onEventSelect}
              selected={selectedEvent}
            />
          )}
          {activeTab === 'rulers' && (
            <RulerList
              rulers={rulers}
              onSelect={onRulerSelect}
              selected={selectedRuler}
            />
          )}
          {activeTab === 'sources' && (
            <SourceList
              sources={sources}
              onSelect={onSourceSelect}
              selected={selectedSource}
            />
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[998] md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
