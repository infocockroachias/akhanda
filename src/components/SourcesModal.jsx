import React, { useEffect, useMemo } from 'react'

/**
 * Sources & Methodology modal — BharatRajya spec.
 *
 * Full-screen overlay presenting the scholarly basis for the atlas:
 *   1. Intro paragraph
 *   2. Reading the colours
 *   3. Historical eras table (Majumdar periodization)
 *   4. Glossary
 *   5. Books (scholarly sources)
 *   6. Reference works & datasets
 *   7. Closing note
 *
 * Renders nothing when `open === false`. Closes on backdrop click or Escape.
 */

/* Static fallback eras (Majumdar's 11-volume periodization) */
const STATIC_ERAS = [
  { name: 'The Vedic Age', span: '1500 BCE – 600 BCE', detail: 'region', volume: 'Vol. 1' },
  { name: 'The Age of Imperial Unity', span: '600 BCE – 320 CE', detail: 'region', volume: 'Vol. 2' },
  { name: 'The Classical Age', span: '320 CE – 750 CE', detail: 'region', volume: 'Vol. 3' },
  { name: 'The Age of Imperial Kanauj', span: '750 CE – 1000 CE', detail: 'region', volume: 'Vol. 4' },
  { name: 'The Struggle for Empire', span: '1000 CE – 1300 CE', detail: 'region', volume: 'Vol. 5' },
  { name: 'The Delhi Sultanate', span: '1300 CE – 1526 CE', detail: 'kingdom', volume: 'Vol. 6' },
  { name: 'The Mughal Empire', span: '1526 CE – 1707 CE', detail: 'kingdom', volume: 'Vol. 7' },
  { name: 'The Maratha Supremacy', span: '1707 CE – 1818 CE', detail: 'kingdom', volume: 'Vol. 8' },
  { name: 'British Paramountcy I', span: '1818 CE – 1905 CE', detail: 'district', volume: 'Vol. 9' },
  { name: 'British Paramountcy II', span: '1905 CE – 1919 CE', detail: 'district', volume: 'Vol. 10' },
  { name: 'Struggle for Freedom', span: '1919 CE – 1947 CE', detail: 'district', volume: 'Vol. 11' },
]

/** Convert a year string from eras.json ("-1500" / "320") into "1500 BCE" / "320 CE". */
function formatEraYear(raw) {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return '—'
  const num = Number(trimmed)
  if (Number.isNaN(num)) return trimmed
  const abs = Math.abs(num)
  return num < 0 ? `${abs} BCE` : `${num} CE`
}

/** Extract the volume number from a source_id like "MAJUMDAR-V3" -> 3. */
function volumeNumberFromSource(sourceId) {
  const m = /-V(\d+)$/i.exec(sourceId ?? '')
  return m ? Number(m[1]) : null
}

const GLOSSARY = [
  {
    term: 'annexation',
    def: "The formal incorporation of a territory into another state, ending its separate political existence. Annexed districts come directly under the annexing power's administration and law.",
  },
  {
    term: 'confederacy',
    def: 'A union of polities that retain internal autonomy while coordinating external policy and defence. The Maratha confederacy (c. 1750–1818) — the Peshwa of Pune, Sindhia of Gwalior, Holkar of Indore, Bhonsle of Nagpur and Gaekwad of Baroda — is the leading Indian example.',
  },
  {
    term: 'diwani',
    def: 'The right to collect and administer the revenues of a province. In 1765 the Mughal emperor Shah Alam II granted the diwani of Bengal, Bihar and Orissa to the English East India Company, giving it the civil administration of the richest province in India.',
  },
  {
    term: 'doctrine of lapse',
    def: 'An East India Company policy applied by Lord Dalhousie (1848–1856) under which a princely state whose ruler died without a natural male heir would "lapse" to British rule rather than pass to an adopted heir. Satara, Jhansi, Nagpur and Awadh were absorbed under this doctrine.',
  },
  {
    term: 'nawab',
    def: "A Mughal-era title for a provincial governor or deputy (from Arabic na'ib). By the 18th century it denoted the Muslim ruler of a successor or princely state — e.g. the Nawab of Awadh, the Nawab of Bengal, the Nawab of Bhopal.",
  },
  {
    term: 'nizam',
    def: "Originally the Mughal title (nizam-ul-mulk) for a high-ranking governor. From Asaf Jah's appointment in 1724 it became the style of the ruler of Hyderabad, the largest and premier princely state of British India.",
  },
  {
    term: 'paramount power',
    def: 'The state that holds supreme political authority over a system of subordinate polities. After 1858 the British Crown was the paramount power in India, exercising rights over both British Indian territory and the princely states.',
  },
  {
    term: 'paramountcy',
    def: 'The doctrine and practice of British supremacy over the princely states. It included the right to recognise successions, station a Resident at each court, and intervene in internal affairs when "good government" was judged to require it — overriding treaty guarantees of autonomy.',
  },
  {
    term: 'peshwa',
    def: 'The hereditary prime minister of the Maratha Empire. Appointed by Chhatrapati Shahu in 1713, the office became effectively hereditary under the Bhat family; from the 1740s the Peshwa at Pune was the de facto head of the Maratha confederacy.',
  },
  {
    term: 'presidency',
    def: 'One of the three major administrative divisions of British India — the Bengal Presidency (Calcutta), the Bombay Presidency and the Madras Presidency — each governed from its presidency city until reorganisation in 1912 and after.',
  },
  {
    term: 'princely state',
    def: 'A nominally sovereign Indian state under the suzerainty of the British Crown, ruled by a native prince (maharaja, raja, nawab, nizam, etc.). At independence in 1947 there were 562 princely states covering about two-fifths of the subcontinent.',
  },
  {
    term: 'subsidiary alliance',
    def: 'A system devised by Lord Wellesley from 1798 under which a princely state accepted a permanent East India Company garrison within its territory, paid for by the state (the "subsidiary"), and a British Resident at its court, in exchange for British protection against external attack.',
  },
  {
    term: 'suzerainty',
    def: 'The right of a superior power to control the external relations of a subordinate state while leaving its internal affairs to itself. British suzerainty over the princely states fell short of sovereignty but reserved control of defence, foreign relations and succession.',
  },
]

const BOOKS = [
  {
    title: 'The History and Culture of the Indian People, Vols. I–XI',
    author: 'R. C. Majumdar (ed.)',
    coverage: 'Bharatiya Vidya Bhavan — the eleven-volume periodization that sets this map’s eras and granularity',
  },
  {
    title: 'India: A History, Revised and updated edition (2010)',
    author: 'John Keay',
    coverage: 'HarperCollins / Atlantic — single-volume political narrative, Vedic period to the present',
  },
  {
    title: 'Military History of India (1960)',
    author: 'Jadunath Sarkar',
    coverage: 'Orient Longman — campaigns, armies and statecraft across two millennia',
  },
  {
    title: 'A History of South India (1955)',
    author: 'K. A. Nilakanta Sastri',
    coverage: 'Oxford University Press — peninsular dynasties: Sangam age through Vijayanagara',
  },
  {
    title: 'A History of Ancient and Early Medieval India (2008)',
    author: 'Upinder Singh',
    coverage: 'Pearson — prehistory to the twelfth century, with sustained attention to sources',
  },
  {
    title: 'Medieval India: From Sultanat to the Mughals, Parts I–II (1997)',
    author: 'Satish Chandra',
    coverage: 'Har-Anand — Delhi Sultanate and Mughal Empire, thirteenth to eighteenth centuries',
  },
  {
    title: 'The Marathas 1600–1818 (1993)',
    author: 'Stewart Gordon',
    coverage: 'Cambridge University Press — the New Cambridge History of India volume on the Maratha polity',
  },
  {
    title: 'India in the Persianate Age (2019)',
    author: 'Richard M. Eaton',
    coverage: 'Penguin / UC Press — the Indo-Persian world, eleventh to eighteenth centuries',
  },
  {
    title: 'A History of India (1986)',
    author: 'Hermann Kulke & Dietmar Rothermund',
    coverage: 'Routledge — broad survey emphasising state-formation and regional patterns',
  },
  {
    title: 'A Historical Atlas of South Asia (1978)',
    author: 'Joseph E. Schwartzberg (ed.)',
    coverage: 'University of Chicago Press — the reference atlas for the cartography of the subcontinent',
  },
  {
    title: 'Imperial Gazetteer of India (1908)',
    author: 'Clarendon Press / Oxford',
    coverage: 'provincial and district gazetteers compiled by the colonial administration — the principal primary source for British-era boundaries',
  },
]

const REFERENCES = [
  { title: 'Imperial Gazetteer of India (1908)', note: 'digitised provincial & district gazetteers', host: 'dsal.uchicago.edu' },
  { title: 'Survey of India — Political map of India', note: 'official political boundaries', host: 'surveyofindia.gov.in' },
  { title: 'Joseph E. Schwartzberg — A Historical Atlas of South Asia (1978)', note: 'digitised historical maps', host: 'dsal.uchicago.edu' },
  { title: 'geoBoundaries (William & Mary geoLab) — ADM2', note: 'open administrative-boundary shapes', host: 'geoboundaries.org' },
  { title: 'Wikipedia contributors', note: 'cross-check for ruler dates, battles, succession', host: 'en.wikipedia.org' },
]

function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-amber-700 mt-8 mb-3 tracking-tight">
      {children}
    </h2>
  )
}

function EraTable({ rows }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-2 pr-3 font-medium">Era</th>
            <th className="py-2 pr-3 font-medium whitespace-nowrap">Span</th>
            <th className="py-2 pr-3 font-medium">Detail</th>
            <th className="py-2 font-medium">Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${row.name}-${i}`}
              className="border-b border-slate-100 align-top hover:bg-amber-50/40 transition-colors"
            >
              <td className="py-2 pr-3 font-medium text-slate-800">{row.name}</td>
              <td className="py-2 pr-3 text-slate-600 whitespace-nowrap tabular-nums">{row.span}</td>
              <td className="py-2 pr-3 text-slate-600 italic">{row.detail}</td>
              <td className="py-2 text-slate-600 whitespace-nowrap">{row.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SourcesModal({ open, onClose, eras }) {
  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Build the era rows: prefer the passed-in eras, fall back to STATIC_ERAS.
  const eraRows = useMemo(() => {
    if (!eras || eras.length === 0) return STATIC_ERAS
    return eras.map((era, idx) => {
      const volNum = volumeNumberFromSource(era.source_id) ?? idx + 1
      return {
        name: era.name,
        span: `${formatEraYear(era.start_year)} – ${formatEraYear(era.end_year)}`,
        detail: era.granularity || '—',
        volume: `Vol. ${volNum}`,
      }
    })
  }, [eras])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close sources & methodology"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] cursor-default"
      />

      {/* Panel */}
      <div
        className="
          relative bg-white text-slate-700
          w-full sm:max-w-3xl
          h-[100dvh] sm:h-auto sm:max-h-[85vh]
          sm:rounded-xl shadow-2xl
          flex flex-col
          overflow-hidden
          border border-slate-200
        "
      >
        {/* Sticky header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div>
            <h1
              id="sources-modal-title"
              className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight"
            >
              Sources &amp; Methodology
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              BharatRajya — historical political atlas of the Indian subcontinent
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              shrink-0 w-9 h-9 inline-flex items-center justify-center
              rounded-full text-slate-500 hover:text-slate-900
              hover:bg-slate-100 active:bg-slate-200
              transition-colors text-xl leading-none
            "
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 sm:px-7 pb-8">
          {/* 1. Intro */}
          <section className="pt-5">
            <p className="text-[15px] leading-7 text-slate-700">
              BharatRajya maps who held power across the Indian subcontinent, year by
              year. It is a careful reconstruction — not a claim that every district has
              been checked against an original manuscript. Each territorial record is
              built with reference to the standard scholarly histories and historical
              atlases listed below, carries a named reference and a confidence level, and
              can be corrected. Historical borders were rarely sharp lines and specialists
              often disagree; where the evidence is thin or contested we mark the record
              approximate and show our reasoning in the source note. Spotted something
              off? Every district has a &lsquo;suggest a correction&rsquo; link.
            </p>
          </section>

          {/* 2. Reading the colours */}
          <section>
            <SectionHeading>Reading the colours</SectionHeading>
            <p className="text-[15px] leading-7 text-slate-700">
              Polities are coloured by the origin of their ruling dynasty, as a purely
              descriptive aid to reading the map — the Maratha houses in shades of
              saffron, the Mughal and other Islamic-ruled states in shades of green, and
              so on. The colours describe who held power in a given place and time; they
              are not a judgement about any people or faith.
            </p>
          </section>

          {/* 3. Historical eras */}
          <section>
            <SectionHeading>Historical eras</SectionHeading>
            <EraTable rows={eraRows} />
            <p className="text-sm text-slate-500 italic mt-3 leading-6">
              We follow the periodization of R. C. Majumdar&rsquo;s eleven-volume{' '}
              <span className="font-serif italic">The History and Culture of the Indian People</span>,
              which also sets the map&rsquo;s level of detail for each era.
            </p>
          </section>

          {/* 4. Glossary */}
          <section>
            <SectionHeading>Glossary</SectionHeading>
            <dl className="divide-y divide-slate-100">
              {GLOSSARY.map(({ term, def }) => (
                <div key={term} className="py-2.5 grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-1 sm:gap-4">
                  <dt className="font-semibold text-slate-800 capitalize">{term}</dt>
                  <dd className="text-[14px] leading-6 text-slate-600">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 5. Books */}
          <section>
            <SectionHeading>Books</SectionHeading>
            <ul className="space-y-3">
              {BOOKS.map((book, i) => (
                <li
                  key={`${book.author}-${i}`}
                  className="border-l-2 border-amber-300 pl-3 py-1"
                >
                  <div className="font-serif text-[15px] font-medium text-slate-900 leading-snug">
                    {book.title}
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">{book.author}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-5">{book.coverage}</div>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Reference works & datasets */}
          <section>
            <SectionHeading>Reference works &amp; datasets</SectionHeading>
            <ul className="space-y-2">
              {REFERENCES.map((ref, i) => (
                <li
                  key={`${ref.host}-${i}`}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4 py-1.5 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <span className="text-[14px] text-slate-800 font-medium">{ref.title}</span>
                    <span className="text-slate-400 mx-1.5 hidden sm:inline">·</span>
                    <span className="text-xs text-slate-500 sm:inline">{ref.note}</span>
                  </div>
                  <span className="font-mono text-xs text-amber-700 whitespace-nowrap sm:text-right">
                    {ref.host}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Footer */}
          <footer className="mt-8 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 leading-6">
              Citing a source does not imply endorsement by its authors or publishers.
              Facts are summarized and attributed; no copyrighted text is reproduced.
              Corrections are welcome.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
