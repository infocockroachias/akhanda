import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white font-playfair mb-8">About AkhandBharat</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-slate-300 mb-6">
            AkhandBharat is an interactive historical atlas of India. It lets you explore 
            5,000 years of Indian history by showing which kingdom ruled every district 
            of the Indian subcontinent, in any year of history.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How It Works</h2>
          <p className="text-slate-300 mb-4">
            Select any year from 1500 BCE to 2024 CE, and the map recolors to show 
            the political landscape of that era. Click any district to see its ruler, 
            capital, and history.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Sources</h2>
          <p className="text-slate-300 mb-4">
            Our data is compiled from academic sources including historical atlases, 
            gazettesers, and peer-reviewed research. Each kingdom, territory, and event 
            is cited with its original source.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Features</h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Interactive map with district-level detail</li>
            <li>Timeline with play/pause animation</li>
            <li>Kingdom cards with detailed information</li>
            <li>Battle cards with map markers</li>
            <li>Dynasty ruler timelines</li>
            <li>Search and filter</li>
            <li>Video export</li>
            <li>State-wise comparison</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
