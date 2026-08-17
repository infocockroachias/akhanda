// Color utilities for kingdoms
export const getKingdomColor = (kingdom) => {
  return kingdom?.color || '#6b7280'
}

export const formatYear = (year) => {
  if (year < 0) return `${Math.abs(year)} BCE`
  if (year === 0) return '0'
  return `${year} CE`
}

export const getYearRange = (minYear, maxYear) => {
  const years = []
  for (let y = minYear; y <= maxYear; y += 100) {
    years.push(y)
  }
  return years
}

// Get current ruler for a district at a specific year
export const getCurrentRuler = (territories, districtCode, year) => {
  if (!territories || !districtCode || !year) return null
  return territories.find(
    t => t.districtCode === districtCode && t.startYear <= year && t.endYear >= year
  )
}

// Get kingdom by name
export const getKingdomByName = (kingdoms, name) => {
  if (!kingdoms || !name) return null
  return kingdoms.find(k => k.name === name)
}

// Filter territories by year
export const filterTerritoriesByYear = (territories, year) => {
  if (!territories || !year) return []
  return territories.filter(t => t.startYear <= year && t.endYear >= year)
}

// Search functionality
export const searchItems = (items, query, fields = ['name', 'text', 'description']) => {
  if (!query || !items) return items
  const q = query.toLowerCase()
  return items.filter(item =>
    fields.some(field => item[field]?.toLowerCase().includes(q))
  )
}

// Sort events chronologically
export const sortEventsByYear = (events) => {
  return [...(events || [])].sort((a, b) => (a.year || 0) - (b.year || 0))
}

// Get events for a specific year
export const getEventsForYear = (events, year) => {
  if (!events || !year) return []
  return events.filter(e => e.year === year)
}

// Get events in a year range
export const getEventsInRange = (events, startYear, endYear) => {
  if (!events) return []
  return events.filter(e => e.year >= startYear && e.year <= endYear)
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Generate color palette for kingdoms
export const generateColorPalette = (count) => {
  const colors = []
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360
    colors.push(`hsl(${hue}, 70%, 50%)`)
  }
  return colors
}

// Calculate map bounds from territories
export const calculateBounds = (territories, capitalCoords) => {
  const coords = Object.values(capitalCoords || {})
  if (coords.length === 0) return [[22.5, 78.5]]
  return coords.map(c => [c.lat || c[0], c.lng || c[1]])
}

// Format date
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Get dynasty color
export const getDynastyColor = (dynasty) => {
  const colors = {
    'Mughal Empire': '#8B4513',
    'Maratha Empire': '#FF9933',
    'Rajput States': '#C8102E',
    'Sikh Empire': '#0066CC',
    'Mysore Sultanate': '#4B0082',
    'British Raj': '#1C1C1C',
    'Delhi Sultanate': '#2E8B57',
    'Gupta Empire': '#DAA520',
    'Maurya Empire': '#800080',
    'Chola Empire': '#FF6347',
  }
  return colors[dynasty] || '#6b7280'
}
