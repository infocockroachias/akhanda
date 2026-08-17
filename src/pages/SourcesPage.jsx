import React, { useState } from 'react'
import { useMapData } from '../hooks/useMapData'

const SourcesPage = () => {
  const { sources } = useMapData()
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Sources' },
    { id: 'book', label: 'Books' },
    { id: 'reference', label: 'Reference Works' },
    { id: 'dataset', label: 'Datasets & Maps' },
    { id: 'online', label: 'Online Sources' },
  ]

  const filteredSources = activeCategory === 'all'
    ? sources
    : sources.filter(s => s.type === activeCategory)

  const glossary = [
    { term: 'annexation', def: 'The act of a state taking over the territory of another — here, the British absorbing Indian kingdoms into directly-ruled territory.' },
    { term: 'confederacy', def: 'A loose union of semi-independent chiefs under a common head — as in the Maratha Confederacy, led nominally by the Peshwa.' },
    { term: 'diwani', def: 'The right to collect land revenue. The grant of the Diwani of Bengal (1765) made the East India Company the real power in the east.' },
    { term: 'doctrine of lapse', def: 'A British annexation policy: if a ruler died without a natural heir, his state "lapsed" to the British rather than passing to an adopted heir.' },
    { term: 'nawab', def: 'A Muslim ruler or governor of a province or princely state (e.g. the Nawab of Awadh).' },
    { term: 'nizam', def: 'The title of the ruler of Hyderabad, the largest and richest princely state.' },
    { term: 'paramountcy', def: 'The supreme authority the British Crown held over the princely states — it controlled their defence and foreign affairs while leaving internal rule to the prince.' },
    { term: 'peshwa', def: 'The hereditary prime minister of the Maratha Empire, who became its effective ruler from the early 18th century.' },
    { term: 'presidency', def: 'One of the three main administrative units of British India — Bengal, Madras and Bombay.' },
    { term: 'princely state', def: 'A semi-autonomous Indian kingdom ruled by a local prince under British paramountcy, not directly governed by the British. ~565 existed at Independence.' },
    { term: 'subsidiary alliance', def: 'A system devised by Lord Wellesley: an Indian ruler hosted (and paid for) British troops and gave up an independent foreign policy.' },
    { term: 'suzerainty', def: 'A relationship where a dominant state controls the foreign affairs of a subordinate one that otherwise governs itself.' },
  ]

  const eras = [
    { name: 'The Vedic Age', span: '1500 BCE – 600 BCE', detail: 'region', vol: 'Vol. 1' },
    { name: 'The Age of Imperial Unity', span: '600 BCE – 320 CE', detail: 'region', vol: 'Vol. 2' },
    { name: 'The Classical Age', span: '320 CE – 750 CE', detail: 'region', vol: 'Vol. 3' },
    { name: 'The Age of Imperial Kanauj', span: '750 CE – 1000 CE', detail: 'region', vol: 'Vol. 4' },
    { name: 'The Struggle for Empire', span: '1000 CE – 1300 CE', detail: 'region', vol: 'Vol. 5' },
    { name: 'The Delhi Sultanate', span: '1300 CE – 1526 CE', detail: 'kingdom', vol: 'Vol. 6' },
    { name: 'The Mughal Empire', span: '1526 CE – 1707 CE', detail: 'kingdom', vol: 'Vol. 7' },
    { name: 'The Maratha Supremacy', span: '1707 CE – 1818 CE', detail: 'kingdom', vol: 'Vol. 8' },
    { name: 'British Paramountcy I', span: '1818 CE – 1905 CE', detail: 'district', vol: 'Vol. 9' },
    { name: 'British Paramountcy II', span: '1905 CE – 1919 CE', detail: 'district', vol: 'Vol. 10' },
    { name: 'Struggle for Freedom', span: '1919 CE – 1947 CE', detail: 'district', vol: 'Vol. 11' },
  ]

  return (
    <div className="h-full w-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-3">Sources & Methodology</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            AkhandBharya maps who held power across the Indian subcontinent, year by year. It is a careful reconstruction — each territorial record is built with reference to the standard scholarly histories listed below.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Methodology */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Reading the Colours</h2>
          <p className="text-gray-600 mb-4">
            Polities are coloured by the origin of their ruling dynasty, as a purely descriptive aid to reading the map — the Maratha houses in shades of saffron, the Mughal and other Islamic-ruled states in green, and so on. The colours describe who held power in a given place and time; they are not a judgement about any people or faith.
          </p>
        </section>

        {/* Historical Eras */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Historical Eras</h2>
          <p className="text-gray-600 mb-6">
            We follow the periodization of R. C. Majumdar's eleven-volume The History and Culture of the Indian People.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Era</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Span</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Detail</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Volume</th>
                </tr>
              </thead>
              <tbody>
                {eras.map(e => (
                  <tr key={e.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900">{e.name}</td>
                    <td className="py-2 px-3 text-gray-600">{e.span}</td>
                    <td className="py-2 px-3 text-gray-600 capitalize">{e.detail}</td>
                    <td className="py-2 px-3 text-gray-600">{e.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Glossary */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Glossary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {glossary.map(g => (
              <div key={g.term} className="card p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{g.term}</h4>
                <p className="text-sm text-gray-600">{g.def}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Sources</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sources List */}
          <div className="space-y-4">
            {filteredSources.map(source => (
              <div key={source.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-700 capitalize">{source.type}</span>
                      {source.volume && <span className="text-xs text-gray-500">{source.volume}</span>}
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {source.author && <>{source.author}. </>}
                      <em>{source.title}</em>
                    </h4>
                    {source.coverage && <p className="text-sm text-gray-500 mt-1">Coverage: {source.coverage}</p>}
                    {source.notes && <p className="text-sm text-gray-600 mt-2">{source.notes}</p>}
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Citing a source does not imply endorsement by its authors or publishers. Facts are summarized and attributed; no copyrighted text is reproduced. Corrections are welcome.
          </p>
        </section>
      </div>
    </div>
  )
}

export default SourcesPage
