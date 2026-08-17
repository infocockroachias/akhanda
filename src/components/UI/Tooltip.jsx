import React from 'react'

const Tooltip = ({ visible, x, y, children }) => {
  if (!visible) return null

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x, top: y - 60 }}
    >
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        {children}
      </div>
    </div>
  )
}

const Popup = ({ visible, onClose, children, title }) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  )
}

const Modal = ({ visible, onClose, children, title }) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  )
}

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
      {message && <p className="text-sm text-slate-400">{message}</p>}
    </div>
  )
}

export { Tooltip, Popup, Modal, LoadingSpinner }
