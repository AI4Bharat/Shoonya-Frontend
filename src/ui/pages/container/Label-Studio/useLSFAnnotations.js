// useLSFAnnotations.js
import { useState, useEffect, useRef } from 'react';

export function useLSFAnnotations(lsfRef, interval = 300) {
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const prevSerialRef = useRef('');

  useEffect(() => {
    const poll = () => {
      const ls = lsfRef?.current;
      if (!ls?.store?.annotationStore?.selected) return;

      const lsfAnnotation = ls.store.annotationStore.selected;
      const regions = Array.from(lsfAnnotation.regionStore?.regions ?? []);

      // Include selected state in serial so highlight updates trigger re-render
      const serial = regions
        .map(r => `${r.id}:${r.selected ? '1' : '0'}:${
          r.results?.map(res => res?.value?.text?.[0] ?? res?.value?.labels?.[0] ?? '').join('|')
        }`)
        .join(',');

      if (serial === prevSerialRef.current) return;
      prevSerialRef.current = serial;

      const mapped = regions.map(region => {
        const results = Array.from(region.results ?? []);

        const rectResult   = results.find(r => r.type === 'rectangle'  || r.from_name === 'annotation_bboxes');
        const labelResult  = results.find(r => r.type === 'labels'     || r.from_name === 'annotation_labels');
        const textResult   = results.find(r => r.type === 'textarea'   || r.from_name === 'transcription');

        const val = rectResult?.value ?? {};

        return {
          id:                region.id,
          lsfAnnotationId:   lsfAnnotation.id,
          text:              textResult?.value?.text?.[0]    ?? '',
          label:             labelResult?.value?.labels?.[0] ?? '',
          x:                 val.x,
          y:                 val.y,
          width:             val.width,
          height:            val.height,
          isSelected:        !!region.selected,
        };
      });

      setAnnotations(mapped);
      const sel = regions.find(r => r.selected);
      setSelectedId(sel?.id ?? null);
    };

    const id = setInterval(poll, interval);
    // Also poll immediately on mount
    poll();
    return () => clearInterval(id);
  }, [lsfRef, interval]);

  // Card click → select region in LSF canvas
  const selectAnnotation = (regionId) => {
    const ls = lsfRef?.current;
    if (!ls?.store?.annotationStore?.selected) return;
    const store = ls.store.annotationStore.selected;
    const regions = Array.from(store.regionStore?.regions ?? []);
    const region = regions.find(r => r.id === regionId);
    if (!region) return;

    // Deselect all first, then select target
    try {
      store.regionStore.unselectAll?.();
    } catch (_) {}

    try {
      if (typeof region.selectRegion === 'function') {
        region.selectRegion();
      } else if (typeof store.regionStore.selectRegion === 'function') {
        store.regionStore.selectRegion(region);
      } else {
        // Fallback: set selected directly and trigger re-render
        region.selected = true;
      }
    } catch (e) {
      console.warn('selectAnnotation failed:', e);
    }
  };

  return { annotations, selectedId, selectAnnotation };
}