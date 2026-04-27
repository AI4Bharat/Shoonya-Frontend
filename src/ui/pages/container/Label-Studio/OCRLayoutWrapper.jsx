// OCRLayoutWrapper.jsx
// Phase 1: Presentation-layer override for OCR project types.
// Drop-in wrapper — zero logic changes, only UI is replaced for OCR.

import React, { useEffect, useRef, useState } from 'react';
import OCRSegmentCategorizationPanel from './OCRSegmentCategorizationPanel';
import { OCRTranscriptionShortcuts } from './OCRTranscriptionShortcuts';
import {
  ZoomIn, ZoomOut, MousePointer2, Pencil, ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import { LSFAnnotationPanel } from './LSFAnnotationPanel';
// ─── CSS injected into <head> to suppress LSF chrome inside OCR layout ────────
const LSF_SUPPRESS_ID = 'ocr-lsf-suppress';

const LSF_SUPPRESS_CSS = `
/* ── OCR layout: suppress LSF chrome, keep only the canvas ── */

/* Topbar — Submit / Update / Skip row */
.ocr-layout-active .lsf-topbar,
.ocr-layout-active [class*="TopBar__"],
.ocr-layout-active [class*="Topbar__"],
.ocr-layout-active [class*="header__"],
.ocr-layout-active [class*="Header__"] { display: none !important; }

/* Side panels — regions list, labels panel */
.ocr-layout-active .lsf-sidepanels,
.ocr-layout-active [class*="SidePanel"],
.ocr-layout-active [class*="side-panel"],
.ocr-layout-active [class*="RegionList"],
.ocr-layout-active [class*="regionList"],
.ocr-layout-active [class*="LabelsPanel"],
.ocr-layout-active [class*="labelsPanel"],
.ocr-layout-active [class*="Tabs__"],
.ocr-layout-active [class*="tabs__"] { display: none !important; }

/* Bottom info bar */
.ocr-layout-active [class*="InfoBar"],
.ocr-layout-active [class*="infobar__"],
.ocr-layout-active [class*="statusbar__"],
.ocr-layout-active [class*="StatusBar"] { display: none !important; }

/* Submit / Skip / Update controls */
.ocr-layout-active [class*="Controls__"],
.ocr-layout-active [class*="controls__"],
.ocr-layout-active [class*="BottomBar"],
.ocr-layout-active [class*="bottomBar"],
.ocr-layout-active [class*="bottombar"] { display: none !important; }

/* Toolbar inside LSF (brush, zoom, etc.) */
.ocr-layout-active [class*="toolbar__"],
.ocr-layout-active [class*="Toolbar__"] { display: none !important; }

/* Remove outer padding — let canvas fill container */
.ocr-layout-active .label-studio-root > div,
.ocr-layout-active [class*="App__"] > div:first-child {
  padding: 0 !important;
}

/* Workspace fills height */
/* Workspace fills height */
.ocr-layout-active [class*="workspace__"],
.ocr-layout-active [class*="Workspace__"],
.ocr-layout-active [class*="MainContent"],
.ocr-layout-active [class*="mainContent"] {
  height: 100% !important;
  max-height: 100% !important;
  overflow: hidden !important;
}

/* Prevent LSF root from expanding beyond its container */
.ocr-layout-active .label-studio-root {
  height: 100% !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}

/* Kill any full-viewport-width elements inside LSF */
.ocr-layout-active .label-studio-root * {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

`;

function injectCSS() {
  if (!document.getElementById(LSF_SUPPRESS_ID)) {
    const el = document.createElement('style');
    el.id = LSF_SUPPRESS_ID;
    el.textContent = LSF_SUPPRESS_CSS;
    document.head.appendChild(el);
  }
}

function removeCSS() {
  document.getElementById(LSF_SUPPRESS_ID)?.remove();
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

// Replace the entire OCRToolbar function in OCRLayoutWrapper.jsx

function OCRToolbar({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  mode,
  onModeChange,
  isTranscription,
  handleOcrFormatting,
  copiedFormula,
  onNextAnnotation,
  onClearMergings,
  onParentImage,
  hasParentImage,
  assignedUsers,
  disableBtns,
  disableButton,
  onDraft,
  isAnnotator,
  role,            // 'annotator' | 'reviewer' | 'superchecker'

  // Reviewer-specific
  onRevise,
  onAccept,        // (status) => void — status: 'accepted'|'accepted_with_minor_changes'|'accepted_with_major_changes'
  isReviewer,

  // SuperChecker-specific
  onValidate,      // (status) => void — status: 'validated'|'validated_with_changes'
  isSuperChecker,
  onReject,
}) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAcceptMenu, setShowAcceptMenu] = useState(false);
  const [showValidateMenu, setShowValidateMenu] = useState(false);
  const infoRef = useRef(null);
  const acceptRef = useRef(null);
  const validateRef = useRef(null);

  useEffect(() => {
    if (!showShortcuts) return;
    const h = (e) => { if (!infoRef.current?.contains(e.target)) setShowShortcuts(false); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [showShortcuts]);

  useEffect(() => {
    if (!showAcceptMenu) return;
    const h = (e) => { if (!acceptRef.current?.contains(e.target)) setShowAcceptMenu(false); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [showAcceptMenu]);

  useEffect(() => {
    if (!showValidateMenu) return;
    const h = (e) => { if (!validateRef.current?.contains(e.target)) setShowValidateMenu(false); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [showValidateMenu]);

  const zoomPct = Math.round(zoomLevel * 100);

  const btnBase = {
    padding: '4px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
    background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 12px', borderBottom: '1px solid #e5e7eb',
      background: '#fff', flexShrink: 0, flexWrap: 'wrap', minHeight: '44px',
    }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '2px' }}>
        {['select', 'draw'].map(m => (
          <button key={m} title={m === 'select' ? 'Select / Move / Resize' : 'Draw a new box'}
            onClick={() => onModeChange(m)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 500,
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? (m === 'draw' ? '#ea580c' : '#111827') : '#6b7280',
              boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {m === 'select'
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-7 1-4 7L5 3z"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            }
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', height: '20px', background: '#e5e7eb' }} />

      {/* Zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button onClick={onZoomOut} disabled={zoomLevel <= 0.2}
          style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151', minWidth: '38px', textAlign: 'center' }}>
          {zoomPct}%
        </span>
        <button onClick={onZoomIn} disabled={zoomLevel >= 3.0}
          style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
        </button>
      </div>

      <div style={{ width: '1px', height: '20px', background: '#e5e7eb' }} />

      {/* OCR Shortcuts — transcription only */}
      {isTranscription && (
        <OCRTranscriptionShortcuts
          handleOcrFormatting={handleOcrFormatting}
          copiedFormula={copiedFormula}
        />
      )}

      <div style={{ flex: 1 }} />

      {/* ── Annotator buttons ── */}
      {!isReviewer && !isSuperChecker && (
        <>
          {isAnnotator && !disableBtns && (
            <button onClick={onDraft} style={{ ...btnBase, color: '#e67e00' }}>Draft</button>
          )}
          <button onClick={onClearMergings} style={{ ...btnBase, color: '#ef4444', borderColor: '#fca5a5', background: '#fff5f5' }}>
            Clear Mergings
          </button>
        </>
      )}

      {/* ── Reviewer buttons ── */}
      {isReviewer && !disableBtns && (
        <>
          <button onClick={onDraft} style={{ ...btnBase, color: '#e67e00' }}>Draft</button>

          {!disableButton && (
            <button onClick={onRevise} style={{ ...btnBase, color: '#ef4444', borderColor: '#fca5a5' }}>
              Revise
            </button>
          )}

          {/* Accept dropdown */}
          <div ref={acceptRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAcceptMenu(v => !v)}
              style={{ ...btnBase, color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Accept
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3.5L5 6.5L8 3.5"/>
              </svg>
            </button>
            {showAcceptMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, zIndex: 100, marginTop: '4px',
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '4px', minWidth: '200px',
              }}>
                {[
                  ['accepted', 'with No Changes'],
                  ['accepted_with_minor_changes', 'with Minor Changes'],
                  ['accepted_with_major_changes', 'with Major Changes'],
                ].map(([status, label]) => (
                  <button key={status} onClick={() => { onAccept(status); setShowAcceptMenu(false); }}
                    style={{ width: '100%', padding: '7px 12px', border: 'none', borderRadius: '7px', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#374151', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onClearMergings} style={{ ...btnBase, color: '#ef4444', borderColor: '#fca5a5', background: '#fff5f5' }}>
            Clear Mergings
          </button>
        </>
      )}

      {/* ── SuperChecker buttons ── */}
{/* ── SuperChecker buttons ── */}
      {isSuperChecker && !disableBtns && (
        <>
          {/* Draft */}
          <button onClick={onDraft} style={{ ...btnBase, color: '#e67e00' }}>Draft</button>

          {/* Reject */}
          {onReject && (
            <button onClick={onReject} style={{ ...btnBase, color: '#ef4444', borderColor: '#fca5a5', background: '#fff5f5' }}>
              Reject
            </button>
          )}

          {/* Validate dropdown */}
          <div ref={validateRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowValidateMenu(v => !v)}
              style={{ ...btnBase, color: '#7c3aed', borderColor: '#c4b5fd', background: '#faf5ff', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Validate
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3.5L5 6.5L8 3.5"/>
              </svg>
            </button>
            {showValidateMenu && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, zIndex: 100, marginTop: '4px',
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '4px', minWidth: '200px',
              }}>
                {[
                  ['validated', 'Validated No Changes'],
                  ['validated_with_changes', 'Validated with Changes'],
                ].map(([status, label]) => (
                  <button key={status}
                    onClick={() => { onValidate(status); setShowValidateMenu(false); }}
                    style={{ width: '100%', padding: '7px 12px', border: 'none', borderRadius: '7px', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#374151', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf5ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onClearMergings} style={{ ...btnBase, color: '#ef4444', borderColor: '#fca5a5', background: '#fff5f5' }}>
            Clear Mergings
          </button>
        </>
      )}

      {/* Parent Image */}
      {hasParentImage && (
        <button onClick={onParentImage} style={{ ...btnBase, color: '#0099ff' }}>Parent Image</button>
      )}

      {/* Next */}
      <button onClick={onNextAnnotation}
        style={{ padding: '4px 16px', borderRadius: '8px', border: '1px solid #0099ff', background: '#0099ff', cursor: 'pointer', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
        Next →
      </button>

      {/* Shortcuts info */}
      <div style={{ position: 'relative' }} ref={infoRef}>
        <button onClick={() => setShowShortcuts(v => !v)} title="Keyboard shortcuts"
          style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: 'none', background: showShortcuts ? '#fff7ed' : 'transparent', cursor: 'pointer', color: showShortcuts ? '#ea580c' : '#9ca3af' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </button>
        {showShortcuts && (
          <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 100, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '12px', width: '220px', marginTop: '6px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Keyboard Shortcuts</p>
            {[['Ctrl+Z','Undo'],['Ctrl+Y','Redo'],['Del','Delete box'],['Esc','Deselect']].map(([key, desc]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>{desc}</span>
                <kbd style={{ fontSize: '10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', padding: '1px 5px', fontFamily: 'monospace', color: '#374151' }}>{key}</kbd>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Main wrapper ─────────────────────────────────────────────────────────────

/**
 * OCRLayoutWrapper
 *
 * Props:
 *   isOCR          {boolean}  — true when project_type includes OCR
 *   isTranscription{boolean}  — true for OCRTranscriptionEditing
 *   isSegCat       {boolean}  — true for OCRSegmentCategorization
 *   rootRef        {ref}      — ref to the label-studio-root div (passed through)
 *   loader         {node}     — full-page loader node from parent
 *   children       {node}     — non-canvas UI from parent (snackbar, etc.)
 *
 *   — Toolbar props (forwarded unchanged from LabelStudioWrapper state) —
 *   disableBtns, assignedUsers, onDraft, onNextAnnotation, onClearMergings,
 *   parentMetadata, handleOcrFormatting, copiedFormula, isAnnotator
 *
 *   — OCRSegmentCategorization props —
 *   predictions, selectedL, ocrD, handleSelectChange, setOcrD, ocrDomain
 */
export default function OCRLayoutWrapper({
  isOCR,
  isTranscription,
  isSegCat,
  rootRef,
  loader,
  children,

  // toolbar
  disableBtns,
  assignedUsers,
  onDraft,
  onNextAnnotation,
  onClearMergings,
  parentMetadata,
  handleOcrFormatting,
  copiedFormula,
  isAnnotator,

  // reviewer
  isReviewer,
  onRevise,
  onAccept,
  disableButton,

  // supercheckercracker
  isSuperChecker,
  onValidate,
  onReject,

  // seg-cat panel
  predictions,
  selectedL,
  ocrD,
  handleSelectChange,
  setOcrD,
  ocrDomain,

  // ── NEW Phase 2 props ──
  lsfRef,
  annotationsRaw,
  taskId,
  projectId,
  selectedLanguages,
  annotationNotesRef,
  load_time,
  annotation_status,
  readOnly,
  taskData,
  userData,
}) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [mode, setMode] = useState('select'); // 'select' | 'draw'
  const lsfContainerRef = useRef(null);

  // Inject / remove suppress CSS based on OCR mode
  useEffect(() => {
    if (isOCR) {
      injectCSS();
      document.body.classList.add('ocr-layout-active');
    }
    return () => {
      document.body.classList.remove('ocr-layout-active');
      removeCSS();
    };
  }, [isOCR]);

  // Sync zoom to LSF image element
  useEffect(() => {
    if (!isOCR || !lsfContainerRef.current) return;
    // Target the LSF workspace wrapper — more stable than hunting for img
    const workspace = lsfContainerRef.current.querySelector(
      '[class*="workspace__"], [class*="MainContent"], .lsf-main-content, .lsf-workspace'
    );
    const target = workspace || lsfContainerRef.current.firstElementChild;
    if (target) {
      target.style.transform = `scale(${zoomLevel})`;
      target.style.transformOrigin = 'top left';
      // Expand scroll container to fit scaled content
      const natural = target.scrollWidth / zoomLevel;
      lsfContainerRef.current.style.overflowX = zoomLevel > 1 ? 'auto' : 'hidden';
    }
  }, [zoomLevel, isOCR]);


  // Mode change: toggle LSF draw/select via existing LSF keyboard shortcut dispatch
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // LSF uses 'v' for select and 'r' for rectangle draw — simulate keypress
    const key = newMode === 'draw' ? 'r' : 'v';
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  // ── Non-OCR: render nothing — caller renders everything as-is ────────────
  if (!isOCR) {
    return null; // caller handles its own render
  }

  // ── OCR layout ───────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: '#f9fafb',
      }}
    >
      {/* Top toolbar */}
      {!loader && (
        <OCRToolbar
            zoomLevel={zoomLevel}
            onZoomIn={() => setZoomLevel(z => Math.min(3.0, +(z + 0.15).toFixed(2)))}
            onZoomOut={() => setZoomLevel(z => Math.max(0.2, +(z - 0.15).toFixed(2)))}
            mode={mode}
            onModeChange={handleModeChange}
            isTranscription={isTranscription}
            handleOcrFormatting={handleOcrFormatting}
            copiedFormula={copiedFormula}
            onNextAnnotation={onNextAnnotation}
            onClearMergings={onClearMergings}
            onParentImage={() => window.open(parentMetadata?.image_url, '_blank')}
            hasParentImage={!!parentMetadata}
            disableBtns={disableBtns}
            disableButton={disableButton}
            onDraft={onDraft}
            isAnnotator={isAnnotator}
            isReviewer={isReviewer}
            onRevise={onRevise}
            onAccept={onAccept}
            isSuperChecker={isSuperChecker}
            onValidate={onValidate}
            onReject={onReject}
        />
      )}

      {/* Main two-panel area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Left: LSF canvas */}
        <div
          ref={lsfContainerRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            position: 'relative',
            background: '#f3f4f6',
            borderRight: '1px solid #e5e7eb',
          }}
        >
          {/* rootRef div is rendered here by the caller — see integration below */}
          <div ref={rootRef} style={{ height: '100%', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }} />
        </div>

        {/* Right: annotation panel */}
        {/* Right: annotation panel — fixed width, fully contained, independent scroll */}
        <div
          style={{
            width: '360px',
            maxWidth: '360px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
            contain: 'layout paint',
          }}
        >
          {/* Annotation cards — scrollable, fills available height */}
          <div style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
          }}>
            <LSFAnnotationPanel
              lsfRef={lsfRef}
              annotationsRaw={annotationsRaw}
              taskId={taskId}
              projectId={projectId}
              selectedLanguages={selectedLanguages}
              ocrDomain={ocrDomain}
              annotationNotesRef={annotationNotesRef}
              load_time={load_time}
              annotation_status={annotation_status}
              readOnly={readOnly}
              taskData={taskData}
              userData={userData}
            />
          </div>

          {/* Seg-cat filters + predictions — pinned to bottom, does not scroll with cards */}
          {isSegCat && (
            <div style={{
              flexShrink: 0,
              borderTop: '1px solid #e5e7eb',
              overflowY: 'auto',
              overflowX: 'hidden',
              maxHeight: '45%',
              boxSizing: 'border-box',
            }}>
              <OCRSegmentCategorizationPanel
                predictions={predictions}
                selectedL={selectedL}
                ocrD={ocrD}
                handleSelectChange={handleSelectChange}
                setOcrD={setOcrD}
                ocrDomain={ocrDomain}
              />
            </div>
          )}
        </div>
      </div>

      {/* Pass-through: snackbar and other non-visual children */}
      {children}
    </div>
  );
}