import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const featuredYears = [
    { year: -326, title: "Alexander's Invasion", description: 'Battle of the Hydaspes' },
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
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Hero */}
      <div className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-white to-white">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #444 1px, transparent 0)', backgroundSize: '24px 24px'}} />
        <div className="text-center px-4 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-amber-100/60 border border-amber-200 rounded-full">
            <span className="text-amber-700 text-sm font-medium">🇮🇳 AkhandBharat</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-4 tracking-tight">
            Who ruled your district?
          </h1>
          <p className="text-xl text-gray-600 mb-2 font-body max-w-2xl mx-auto">
            Explore 5,000 years of Indian history on an interactive map. See which kingdom held power in every district, in any year — from Alexander to Independence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              to="/year/1707"
              className="btn btn-primary text-base px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-semibold shadow-lg shadow-amber-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Start Exploring
            </Link>
            <Link
              to="/about"
              className="btn btn-secondary text-base px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50"
            >
              About the Project
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-display font-bold text-amber-700">269</div>
            <div className="text-sm text-gray-600">Kingdoms</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-amber-700">8,340+</div>
            <div className="text-sm text-gray-600">Territory Records</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-amber-700">746</div>
            <div className="text-sm text-gray-600">Historical Events</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-amber-700">149</div>
            <div className="text-sm text-gray-600">Dynasties</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-4">How to Read the Map</h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">Polities are coloured by the origin of their ruling dynasty — Maratha houses in saffron, Mughal and Islamic-ruled states in green, and so on.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Click a District</h3>
            <p className="text-gray-600 text-sm">Click any district to see its kingdom, capital, rulers, and historical notes.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Drag the Timeline</h3>
            <p className="text-gray-600 text-sm">Move the year slider and watch borders shift. Play to animate through centuries.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Search & Filter</h3>
            <p className="text-gray-600 text-sm">Find kingdoms, battles, or districts by name. Filter by era or region.</p>
          </div>
        </div>
      </div>

      {/* Featured Years */}
      <div className="bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-4">Explore Key Years</h2>
          <p className="text-center text-gray-500 mb-12">Jump to pivotal moments in Indian history</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredYears.map(({ year, title, description }) => (
              <Link
                key={year}
                to={`/year/${year}`}
                className="card p-4 hover:shadow-md transition-all hover:border-amber-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-display font-bold text-amber-600 min-w-[80px] group-hover:text-amber-700">
                    {year < 0 ? `${Math.abs(year)} BCE` : year}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 group-hover:text-amber-700">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Eras */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-4">Historical Eras</h2>
        <p className="text-center text-gray-500 mb-12">Following the periodization of R. C. Majumdar's The History and Culture of the Indian People</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { era: 'The Vedic Age', span: '1500–600 BCE' },
            { era: 'Imperial Unity', span: '600 BCE–320 CE' },
            { era: 'Classical Age', span: '320–750 CE' },
            { era: 'Imperial Kanauj', span: '750–1000 CE' },
            { era: 'Struggle for Empire', span: '1000–1300 CE' },
            { era: 'Delhi Sultanate', span: '1300–1526 CE' },
            { era: 'Mughal Empire', span: '1526–1707 CE' },
            { era: 'Maratha Supremacy', span: '1707–1818 CE' },
          ].map(e => (
            <div key={e.era} className="card p-3 text-center">
              <div className="font-semibold text-sm text-gray-900">{e.era}</div>
              <div className="text-xs text-gray-500 mt-1">{e.span}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">AkhandBharat</h3>
          <p className="text-gray-400 text-sm mb-4">Interactive Historical Atlas of the Indian Subcontinent</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <Link to="/sources" className="hover:text-white transition-colors">Sources</Link>
            <span>·</span>
            <Link to="/battles" className="hover:text-white transition-colors">Battles</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </div>
          <p className="text-gray-500 text-xs mt-4">Created for educational and historical research purposes.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
