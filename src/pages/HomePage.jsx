import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const featuredYears = [
    { year: -326, title: 'Alexander\'s Invasion', description: 'Battle of the Hydaspes' },
    { year: 320, title: 'Gupta Empire Rise', description: 'Golden Age of India begins' },
    { year: 712, title: 'Arab Invasion of Sindh', description: 'Muhammad bin Qasim arrives' },
    { year: 1206, title: 'Delhi Sultanate Founded', description: 'Mamluk dynasty begins' },
    { year: 1526, title: 'Mughal Empire Founded', description: 'Babur defeats Ibrahim Lodi' },
    { year: 1674, title: 'Maratha Empire Rise', description: 'Shivaji crowned Chhatrapati' },
    { year: 1757, title: 'Battle of Plassey', description: 'British East India Company rises' },
    { year: 1857, title: 'First War of Independence', description: 'The Great Rebellion' },
    { year: 1947, title: 'Independence', description: 'India becomes free' },
  ]

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-playfair mb-4">
            AkhandBharat
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            India's Interactive Historical Atlas
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Explore 5,000 years of Indian history. See which kingdom ruled every district,
            in any year — from the Mahabharata era to Independence.
          </p>
          <Link
            to="/year/1700"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Explore the Atlas
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Map</h3>
            <p className="text-slate-400 text-sm">
              Click any district to see which kingdom ruled it. Hover for quick details.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Timeline Travel</h3>
            <p className="text-slate-400 text-sm">
              Use the timeline to see how borders changed year by year. Play animation.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Kingdom Cards</h3>
            <p className="text-slate-400 text-sm">
              Detailed cards for each kingdom with capitals, rulers, and history.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Years */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12 font-playfair">
          Explore Key Years
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredYears.map(({ year, title, description }) => (
            <Link
              key={year}
              to={`/year/${year}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white font-playfair min-w-[80px]">
                  {year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm text-slate-400">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/30 border-t border-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">269</div>
              <div className="text-sm text-slate-400">Kingdoms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">8,340+</div>
              <div className="text-sm text-slate-400">Territory Records</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">746</div>
              <div className="text-sm text-slate-400">Historical Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">149</div>
              <div className="text-sm text-slate-400">Dynasties</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            AkhandBharat — Interactive Historical Atlas of India
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Data sourced from academic references and historical records
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
