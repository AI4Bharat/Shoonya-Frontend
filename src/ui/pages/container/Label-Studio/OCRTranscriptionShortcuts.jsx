import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Wand2, Check } from 'lucide-react';

/**
 * OCRTranscriptionShortcuts
 *
 * Drop-in replacement for the MUI Button + Menu combo in LSF.jsx.
 * Keeps all original functionality:
 *   - Clicking a menu item calls handleOcrFormatting(type) → copies formula to clipboard
 *   - Keyboard shortcuts still work the same (handled by the parent LSF.jsx)
 *   - copiedFormula ✨ indicator shown when something is copied
 *
 * Props:
 *   handleOcrFormatting(type)  — original handler from LSF (copies formula & closes menu)
 *   copiedFormula              — string from LSF state; truthy = show sparkle
 */

const SHORTCUTS = [
  {
    type: 'superscript',
    label: 'Superscript',
    shortcut: '^',
    formula: '${}^{}$',
  },
  {
    type: 'subscript',
    label: 'Subscript',
    shortcut: '_',
    formula: '${}_{}$',
  },
  {
    type: 'fraction',
    label: 'Fraction',
    shortcut: '/',
    formula: '\\fraction{}{}',
  },
  {
    type: 'footnote',
    label: 'Footnote',
    shortcut: 'Shift+F',
    formula: '\\footnote{}',
  },
  {
    type: 'dropcap',
    label: 'Dropcap',
    shortcut: 'Shift+D',
    formula: '\\dropcap{}',
  },
];

export function OCRTranscriptionShortcuts({ handleOcrFormatting, copiedFormula }) {
  const [open, setOpen] = useState(false);
  const [justCopied, setJustCopied] = useState(null); // type string or null
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = (type) => {
    handleOcrFormatting(type);
    setJustCopied(type);
    setTimeout(() => setJustCopied(null), 1500);
    setOpen(false);
  };

  return (
    <div className="relative flex-shrink-0" ref={wrapperRef}>
      {/* Trigger button — matches Arena toolbar pill style */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="OCR Shortcuts: ^ _ / Shift+F Shift+D (direct insert)"
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
          border transition-all duration-150 select-none
          ${open
            ? 'bg-orange-50 border-orange-300 text-orange-600 shadow-sm'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }
        `}
      >
        <Wand2 size={13} />
        OCR Shortcuts
        {copiedFormula && <span className="ml-0.5">✨</span>}
        <ChevronDown
          size={11}
          className={`ml-0.5 text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="
            absolute top-full mt-2 left-0 z-50
            bg-white border border-gray-100 rounded-xl shadow-xl
            py-1 w-72 origin-top-left
          "
        >
          {/* Header hint */}
          <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
            <p className="text-[10px] text-gray-400 italic">
              Menu: copies to clipboard &nbsp;·&nbsp; Shortcuts: direct insert
            </p>
          </div>

          {SHORTCUTS.map(({ type, label, shortcut, formula }) => {
            const copied = justCopied === type;
            return (
              <button
                key={type}
                onClick={() => handleClick(type)}
                className="
                  w-full flex items-center justify-between gap-3
                  px-3 py-2 text-sm text-left
                  hover:bg-gray-50 transition-colors
                "
              >
                {/* Left: label + shortcut */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-gray-800 text-[13px]">{label}</span>
                  <span className="text-[10px] text-gray-400">
                    Shortcut:&nbsp;
                    {shortcut.split('+').map((k, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-gray-300 mx-0.5">+</span>}
                        <kbd className="px-1 py-px rounded bg-gray-100 border border-gray-200 font-mono text-gray-600 text-[9px]">
                          {k}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </span>
                </div>

                {/* Right: formula or copied check */}
                {copied ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-green-500 flex-shrink-0">
                    <Check size={11} />
                    Copied
                  </span>
                ) : (
                  <code className="text-[11px] font-mono text-gray-400 flex-shrink-0 text-right leading-snug">
                    {formula}
                  </code>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}