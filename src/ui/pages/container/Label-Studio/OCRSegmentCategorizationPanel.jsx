import React from 'react';
import { ChevronDown, Languages, BookOpen } from 'lucide-react';

const LANGUAGES = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati',
  'Punjabi', 'Bengali', 'Malayalam', 'Assamese', 'Bodo', 'Dogri', 'Kashmiri',
  'Maithili', 'Manipuri', 'Nepali', 'Odia', 'Sindhi', 'Sinhala', 'Urdu',
  'Santali', 'Sanskrit', 'Goan Konkani',
];

const DOMAINS = [
  { value: 'BO', label: 'Books' },
  { value: 'FO', label: 'Forms' },
  { value: 'OT', label: 'Others' },
  { value: 'TB', label: 'Textbooks' },
  { value: 'NV', label: 'Novels' },
  { value: 'NP', label: 'Newspapers' },
  { value: 'MG', label: 'Magazines' },
  { value: 'RP', label: 'Research Papers' },
  { value: 'FM', label: 'Form' },
  { value: 'BR', label: 'Brochure / Posters / Leaflets' },
  { value: 'AR', label: 'Acts & Rules' },
  { value: 'PB', label: 'Publication' },
  { value: 'NT', label: 'Notice' },
  { value: 'SY', label: 'Syllabus' },
  { value: 'QP', label: 'Question Papers' },
  { value: 'MN', label: 'Manual' },
];

export default function OCRSegmentCategorizationPanel({
  predictions,
  selectedL,
  ocrD,
  handleSelectChange,
  setOcrD,
  ocrDomain,
}) {
  return (
    <div className="flex flex-col gap-0 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

      {/* ── Filters row ── */}
      <div className="flex flex-wrap gap-4 items-start px-4 py-3 bg-gray-50 border-b border-gray-200">

        {/* Languages multi-select */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Languages size={13} className="text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Languages
            </span>
          </div>
          <select
            multiple
            onChange={handleSelectChange}
            value={selectedL}
            className="
              w-full rounded-lg border border-gray-200 bg-white text-sm text-gray-700
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              [&>option]:px-2 [&>option]:py-1
              [&>option:checked]:bg-orange-50 [&>option:checked]:text-orange-700
              overflow-y-auto
            "
            style={{ height: '7rem' }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="px-2 py-1">
                {lang}
              </option>
            ))}
          </select>
          {selectedL?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedL.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[10px] font-medium text-orange-700"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Domain single-select */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen size={13} className="text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Domain
            </span>
          </div>
          <div className="relative">
            <select
              value={ocrD}
              onChange={(e) => {
                setOcrD(e.target.value);
                ocrDomain.current = e.target.value;
              }}
              className="
                w-full appearance-none rounded-lg border border-gray-200 bg-white
                px-3 py-2 pr-8 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              "
            >
              <option value="" disabled>Select domain…</option>
              {DOMAINS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {ocrD && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[10px] font-medium text-orange-700 w-fit mt-1">
              {DOMAINS.find((d) => d.value === ocrD)?.label ?? ocrD}
            </span>
          )}
        </div>
      </div>

      {/* ── Predictions panel ── */}
      <div className="flex flex-col">
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Predictions
          </span>
          {(() => {
            try {
              const parsed = typeof predictions === 'string' ? JSON.parse(predictions) : predictions;
              return Array.isArray(parsed) && parsed.length > 0 ? (
                <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                  {parsed.length} region{parsed.length !== 1 ? 's' : ''}
                </span>
              ) : null;
            } catch { return null; }
          })()}
        </div>

        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300/50 [&::-webkit-scrollbar-thumb]:rounded-full">
          {(() => {
            let items;
            try {
              items = typeof predictions === 'string' ? JSON.parse(predictions) : predictions;
            } catch {
              items = predictions;
            }

            if (!Array.isArray(items) || items.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">—</span>
                  </div>
                  <p className="text-sm text-gray-400">No predictions present</p>
                </div>
              );
            }

            return items.map((pred, index) => (
              <div
                key={index}
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50/60 transition-colors"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-semibold tabular-nums text-gray-400 mt-0.5">
                  {index + 1}
                </span>
                <textarea
                  readOnly
                  value={pred.text || ''}
                  rows={2}
                  className="
                    flex-1 resize-none text-sm text-gray-700 bg-transparent border-0
                    focus:outline-none focus:ring-0 leading-relaxed
                    placeholder-gray-300
                  "
                  style={{ minHeight: '2.5rem', maxHeight: '6rem', overflow: 'auto' }}
                />
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}