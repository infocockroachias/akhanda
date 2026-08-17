# AkhandBharat — Interactive Historical Atlas of India

A replica of BharatRajya.com, built with React + Vite + Leaflet + Tailwind CSS.

## Features

- 🗺️ **Interactive Map** — Click any district to see its ruler
- ⏱️ **Timeline Travel** — Scrub through 5,000 years of history
- 🎬 **Time Warp Animation** — Smooth visual transitions between years
- 🏰 **Kingdom Cards** — Detailed information for 269 kingdoms
- ⚔️ **Battle Cards** — 746 historical events with map markers
- 👑 **Dynasty Rulers** — 149 dynasties with chronological timelines
- 🔍 **Search & Filter** — Find kingdoms, events, and years
- 📱 **Responsive** — Works on mobile and desktop
- 🎥 **Video Export** — Record map animations (MP4/WebM)

## Tech Stack

- React 18 + Vite
- Leaflet.js for maps
- Tailwind CSS for styling
- D3.js for data visualization
- React Router for navigation

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Data

All historical data is stored as JSON files in `public/data/`. The dataset includes:

- 269 kingdoms with colors, capitals, and descriptions
- 8,340+ territory records mapping districts to rulers by year
- 746 historical events with sources
- 622 milestones with detailed descriptions
- 149 dynasties with ruler timelines
- 30 academic sources

## Project Structure

```
src/
├── components/
│   ├── Map/          # Leaflet map, legend, time warp overlay
│   ├── Timeline/     # Year selector, slider, play/pause
│   ├── Cards/        # Kingdom and battle cards
│   ├── Sidebar/      # Tabbed sidebar with search
│   └── UI/           # Tooltips, popups, modals, search
├── pages/            # Route pages (Home, Year, State, etc.)
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── App.jsx           # Router setup
├── main.jsx          # Entry point
└── index.css         # Global styles + Tailwind
```

## License

MIT
