import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import YearPage from './pages/YearPage'
import StatePage from './pages/StatePage'
import BattlesPage from './pages/BattlesPage'
import CardsPage from './pages/CardsPage'
import CardDetailPage from './pages/CardDetailPage'
import SourcesPage from './pages/SourcesPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <nav className="shrink-0 bg-slate-900 text-white px-4 py-3 flex items-center justify-between z-50 shadow-md">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl">🇮🇳</span>
          <h1 className="font-serif text-xl font-bold">AkhandBharat</h1>
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <button className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Suggest a correction</span>
          </button>
          <a href="/battles" className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
            </svg>
            <span className="hidden sm:inline">Battles</span>
          </a>
          <a href="/sources" className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden sm:inline">Sources</span>
          </a>
          <a href="/about" className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-md transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">About</span>
          </a>
        </div>
      </nav>

      {/* Routes */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/year/:year" element={<YearPage />} />
          <Route path="/state/:slug" element={<StatePage />} />
          <Route path="/state/:slug/year/:year" element={<StatePage />} />
          <Route path="/battles" element={<BattlesPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/cards/:slug" element={<CardDetailPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
