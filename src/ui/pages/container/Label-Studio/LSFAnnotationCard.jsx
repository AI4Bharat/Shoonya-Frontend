// LSFAnnotationCard.jsx
// A single annotation card rendered in the right panel.
// Calls patchAnnotation on text/label change, deleteAnnotation on delete.

import React, { useRef, useEffect, useState } from 'react';
import { Trash2, GripVertical, Check } from 'lucide-react';

// Label colour map — matches labelConfigJSX.js colours
const LABEL_COLORS = {
  'paragraph':           '#55EFC4',
  'headline':            '#D35400',
  'header':              '#8CC0DE',
  'footer':              '#81ECEC',
  'table':               '#FAB1A0',
  'figure':              '#8E44AD',
  'figure-caption':      '#FDCB6E',
  'section-title':       '#F39C12',
  'sub-headline':        '#8E44AD',
  'ordered-list':        '#2C3E50',
  'unordered-list':      '#8E44AD',
  'footnote':            '#A29BFE',
  'page-number':         '#A0BCC2',
  'advertisement':       '#1ABC9C',
  'dateline':            '#16A085',
  'formula':             '#2ECC71',
  'quote':               '#8CC0DE',
  'sidebar':             '#F1C40F',
  'table-caption':       '#E17055',
  'index':               '#FFCCB3',
  'reference':           '#27AE60',
  'unsure':              '#D35400',
};

function getLabelColor(label) {
  return LABEL_COLORS[label] || '#9ca3af';
}

// Minimal label selector — shows only a coloured badge + click to cycle
// Full label list from labelConfigJSX.js
const ALL_LABELS = Object.keys(LABEL_COLORS).concat([
  'answer','author','chapter-title','contact-info','first-level-question',
  'flag','folio','jumpline','options','placeholder-text',
  'second-level-question','sub-ordered-list','sub-section-title',
  'subsub-ordered-list','subsub-section-title','sub-unordered-list',
  'subsub-headline','subsub-unordered-list','table-of-contents',
  'third-level-question','website-link',
]).filter((v, i, a) => a.indexOf(v) === i);

function LabelBadge({ label, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const color = getLabelColor(label);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '2px 7px', borderRadius: '6px', border: `1px solid ${color}55`,
          background: `${color}18`, cursor: 'pointer', fontSize: '11px', fontWeight: 600, color,
        }}
      >
        {label || 'unlabelled'}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M1.5 3L4 5.5L6.5 3"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          padding: '4px', maxHeight: '240px', overflowY: 'auto', minWidth: '160px',
        }}
          // Position below the badge
          ref={el => {
            if (el && ref.current) {
              const rect = ref.current.getBoundingClientRect();
              el.style.top = (rect.bottom + 4) + 'px';
              el.style.left = rect.left + 'px';
            }
          }}
        >
          {ALL_LABELS.map(l => (
            <button
              key={l}
              onClick={(e) => { e.stopPropagation(); onChange(l); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 10px', border: 'none', borderRadius: '6px',
                background: l === label ? '#f9fafb' : 'transparent',
                cursor: 'pointer', fontSize: '11px', fontWeight: 500,
                color: l === label ? getLabelColor(l) : '#374151', textAlign: 'left',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getLabelColor(l), flexShrink: 0 }} />
              {l}
              {l === label && <Check size={10} style={{ marginLeft: 'auto', color: getLabelColor(l) }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LSFAnnotationCard({
  annotation,       // { id, text, label, isSelected }
  index,
  isSelected,
  onClick,
  onTextChange,     // (id, newText) => void
  onLabelChange,    // (id, newLabel) => void
  onDelete,         // (id) => void
  readOnly,
}) {
  const textareaRef = useRef(null);
  const color = getLabelColor(annotation.label);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [annotation.text]);

  const cardStyle = {
    position: 'relative',
    borderRadius: '10px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
    boxShadow: isSelected
      ? `0 0 0 2px ${color}, 0 4px 16px ${color}40`
      : '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px 4px' }}>
        {/* Drag handle (visual only for Phase 2) */}
        <span style={{ color: '#d1d5db', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <GripVertical size={13} />
        </span>

        {/* Index bubble */}
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: '1px solid #d1d5db', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '10px', fontWeight: 600,
          color: '#9ca3af', flexShrink: 0,
        }}>
          {index}
        </span>

        {/* Label badge */}
        <LabelBadge
          label={annotation.label}
          onChange={(label) => !readOnly && onLabelChange(annotation.id, label)}
        />

        {/* Delete — visible on hover/selected */}
        {!readOnly && (
          <button
            title="Delete annotation"
            onClick={(e) => { e.stopPropagation(); onDelete(annotation.id); }}
            style={{
              marginLeft: 'auto', width: '22px', height: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', border: 'none', background: 'transparent',
              cursor: 'pointer', color: '#d1d5db',
              opacity: isSelected ? 1 : 0,
            }}
            className="lsf-ann-delete"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Text body */}
      <div style={{ padding: '0 10px 10px' }}>
        <textarea
          ref={textareaRef}
          value={annotation.text}
          readOnly={readOnly}
          onChange={(e) => !readOnly && onTextChange(annotation.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="No text — draw a box on the canvas"
          rows={1}
          style={{
            width: '100%', resize: 'none', border: 0, background: 'transparent',
            fontSize: '13px', lineHeight: 1.6, color: '#374151',
            outline: 'none', fontFamily: 'inherit',
            minHeight: '1.5rem', maxHeight: '10rem', overflow: 'auto',
          }}
        />
      </div>

      {/* Hover delete visibility fix */}
      <style>{`.lsf-ann-delete:hover { opacity: 1 !important; color: #ef4444 !important; background: #fef2f2 !important; }`}</style>
    </div>
  );
}