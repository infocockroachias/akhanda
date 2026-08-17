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
    <div className="h-full w-full overflow-hidden">
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
  )
}

export default App
