// LSFAnnotationPanel.jsx
import React, { useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { LSFAnnotationCard } from './LSFAnnotationCard';
import { useLSFAnnotations } from './useLSFAnnotations';
import {
  patchAnnotation,
  deleteAnnotation,
} from '../../../../redux/actions/api/LSFAPI/LSFAPI';

export function LSFAnnotationPanel({
  lsfRef,
  annotationsRaw,
  taskId,
  projectId,
  selectedLanguages,
  ocrDomain,
  annotationNotesRef,
  load_time,
  annotation_status,
  readOnly,
  taskData,
  userData,
}) {
  const panelRef = useRef(null);
  const { annotations, selectedId, selectAnnotation } = useLSFAnnotations(lsfRef);

  // Auto-scroll selected card into view
  useEffect(() => {
    if (!selectedId || !panelRef.current) return;
    const card = panelRef.current.querySelector(`[data-region-id="${selectedId}"]`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getSerializedAnnotation = () => {
    const ls = lsfRef?.current;
    if (!ls?.store?.annotationStore?.selected) return null;
    try {
      return ls.store.annotationStore.selected.serializeAnnotation();
    } catch { return null; }
  };

  // Match the currently-loaded LSF annotation to its raw API record
  const findRawAnnotation = () => {
    if (!annotationsRaw?.length) return null;
    const serialized = getSerializedAnnotation();
    if (!serialized) return null;

    // Try to match by first result id
    const firstId = serialized[0]?.id;
    if (firstId) {
      const match = annotationsRaw.find(a => a.result?.[0]?.id === firstId);
      if (match) return match;
    }
    // Fallback: return first annotation with type 1 (annotator annotation)
    return annotationsRaw.find(a => a.annotation_type === 1) ?? annotationsRaw[0];
  };

  // Works for both ReactQuill ref (has .getEditor()) and plain inputRef (has .value)
  const getNotesValue = () => {
    const ref = annotationNotesRef?.current;
    if (!ref) return '';
    try {
      if (typeof ref.getEditor === 'function') {
        return JSON.stringify(ref.getEditor().getContents());
      }
    } catch { /* fall through */ }
    return ref.value ?? '';
  };

  // ── Debounce timer ─────────────────────────────────────────────────────────
  const debounceTimer = useRef(null);

  const doPatch = (serialized, rawAnnotation) => {
    if (!serialized || !rawAnnotation) return;

    // Normalise text arrays (same logic as LSF.jsx autoSaveAnnotation)
    const temp = serialized.map(item => {
      if (item.type === 'relation') return item;
      if (item.value?.text) {
        return { ...item, value: { ...item.value, text: [item.value.text[0]] } };
      }
      return item;
    });

    patchAnnotation(
      taskId,
      temp,
      rawAnnotation.id,
      load_time?.current ?? load_time,   // supports both ref and plain value
      rawAnnotation.lead_time,
      annotation_status?.current ?? rawAnnotation.annotation_status ?? 'labeled',
      getNotesValue(),
      true,                              // isAutoSave = silent
      selectedLanguages,
      ocrDomain,
    );
  };

  // ── Text change → update LSF region text → debounced patch ────────────────
  const handleTextChange = (regionId, newText) => {
    const ls = lsfRef?.current;
    if (!ls?.store?.annotationStore?.selected) return;

    const regions = Array.from(
      ls.store.annotationStore.selected.regionStore?.regions ?? []
    );
    const region = regions.find(r => r.id === regionId);
    if (region) {
      const textResult = Array.from(region.results ?? []).find(
        r => r.type === 'textarea' || r.from_name === 'transcription'
      );
      if (textResult) {
        try { textResult.setValue?.([newText]); } catch { /* LSF may not expose setValue */ }
        // Fallback: mutate value directly
        if (textResult.value) textResult.value.text = [newText];
      }
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      doPatch(getSerializedAnnotation(), findRawAnnotation());
    }, 800);
  };

  // ── Label change → update LSF region label → immediate patch ──────────────
  const handleLabelChange = (regionId, newLabel) => {
    const ls = lsfRef?.current;
    if (!ls?.store?.annotationStore?.selected) return;

    const regions = Array.from(
      ls.store.annotationStore.selected.regionStore?.regions ?? []
    );
    const region = regions.find(r => r.id === regionId);
    if (region) {
      const labelResult = Array.from(region.results ?? []).find(
        r => r.type === 'labels' || r.from_name === 'annotation_labels'
      );
      if (labelResult) {
        try { labelResult.setValue?.([newLabel]); } catch { /* */ }
        if (labelResult.value) labelResult.value.labels = [newLabel];
      }
    }

    doPatch(getSerializedAnnotation(), findRawAnnotation());
  };

  // ── Delete → remove LSF region → deleteAnnotation API ────────────────────
  const handleDelete = (regionId) => {
    const ls = lsfRef?.current;
    if (!ls?.store?.annotationStore?.selected) return;

    const store = ls.store.annotationStore.selected;
    const regions = Array.from(store.regionStore?.regions ?? []);
    const region = regions.find(r => r.id === regionId);

    if (region) {
      try {
        store.regionStore.deleteRegion?.(region);
      } catch {
        // Fallback: filter it out manually
        store.regionStore.regions = regions.filter(r => r.id !== regionId);
      }
    }

    // deleteAnnotation takes the raw annotation id (the API record), NOT the region id
    const rawAnnotation = findRawAnnotation();
    if (rawAnnotation) {
      deleteAnnotation(rawAnnotation.id);
    }
  };

  // ── Card click → select region in canvas ─────────────────────────────────
  const handleCardClick = (regionId) => {
    selectAnnotation(regionId);
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!annotations.length) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '120px', gap: '10px',
        color: '#9ca3af', fontSize: '13px', padding: '32px', textAlign: 'center',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Pencil size={18} color="#9ca3af" />
        </div>
        <p style={{ margin: 0 }}>No annotations yet</p>
        <p style={{ fontSize: '11px', color: '#d1d5db', margin: 0 }}>
          {readOnly ? 'No bounding boxes on this task' : 'Draw a bounding box on the image to add one'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{
        height: '100%', minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
        background: '#f3f4f6', padding: '10px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 2px 6px', flexShrink: 0,
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, color: '#9ca3af',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Annotations
        </span>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
          {annotations.length} region{annotations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {annotations.map((ann, idx) => (
        <div key={ann.id} data-region-id={ann.id}>
          <LSFAnnotationCard
            annotation={ann}
            index={idx + 1}
            isSelected={ann.id === selectedId}
            onClick={() => handleCardClick(ann.id)}
            onTextChange={handleTextChange}
            onLabelChange={handleLabelChange}
            onDelete={handleDelete}
            readOnly={readOnly}
          />
        </div>
      ))}

      {/* Draw new box button — hidden when read-only */}
      {!readOnly && (
        <button
          style={{
            width: '100%', padding: '8px', borderRadius: '10px',
            border: 'none', background: '#fff', cursor: 'pointer',
            fontSize: '12px', color: '#f97316', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginTop: '2px',
          }}
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'r', bubbles: true })
            );
          }}
        >
          <Pencil size={11} />
          Draw a new box
        </button>
      )}
    </div>
  );
}