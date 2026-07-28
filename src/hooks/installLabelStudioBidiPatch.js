import buildBidiFragment from "../utils/bidiTokenizer";

const DISPLAY_SELECTORS = [
  ".lsf-region-item__title",
  ".lsf-region-item__header",
  ".lsf-region-item__desc",
  ".lsf-region-item__text",
  ".lsf-label__text",
  ".lsf-label",
  ".lsf-choice__label",
  ".lsf-taxonomy-item__label",
  ".lsf-field-label__text",
  ".ant-select-item-option-content",

  // fallback selectors for older / slightly different LSF builds
  ".lsf-region-itemtitle",
  ".lsf-region-itemheader",
  ".lsf-region-itemdesc",
  ".lsf-region-itemtext",
  ".lsf-labeltext",
  ".lsf-choicelabel",
  ".lsf-taxonomyitem-label",
  ".lsf-field-labeltext",
];

const SVG_SELECTORS = [
  "svg text",
  ".lsf-image-segmentation svg text",
  "svg text.lsf-shape-labels",
];

const EDITABLE_SELECTORS = [
  "textarea.lsf-textarea",
  ".lsf-textarea-tag__input",
  ".lsf-textarea-tag textarea",
  ".lsf-input",
];

const DISPLAY_SELECTOR_STRING = DISPLAY_SELECTORS.join(", ");
const SVG_SELECTOR_STRING = SVG_SELECTORS.join(", ");
const EDITABLE_SELECTOR_STRING = EDITABLE_SELECTORS.join(", ");

function isElement(node) {
  return !!node && node.nodeType === 1;
}

function normalizeLanguage(value) {
  return String(value || "").trim().toLowerCase();
}

function isRtlLanguage(value) {
  const lang = normalizeLanguage(value);

  return [
    "ur",
    "urdu",
    "ks",
    "kashmiri",
    "ar",
    "arabic",
    "fa",
    "farsi",
    "persian",
    "sd",
    "sindhi",
    "he",
    "hebrew",
  ].some((item) => lang === item || lang.includes(item));
}

function isEditable(el) {
  if (!isElement(el)) return false;
  return el.matches(EDITABLE_SELECTOR_STRING) || !!el.closest(EDITABLE_SELECTOR_STRING);
}

function shouldPatchElement(el) {
  if (!isElement(el)) return false;
  if (isEditable(el)) return false;
  if (!el.textContent || !el.textContent.trim()) return false;
  return true;
}

function patchHTMLElement(el) {
  if (!shouldPatchElement(el)) return;

  const originalText = el.dataset.rawBidiText ?? el.textContent ?? "";
  if (!originalText.trim()) return;

  if (!el.dataset.rawBidiText) {
    el.dataset.rawBidiText = originalText;
  }

  const fragment = buildBidiFragment(originalText, el.ownerDocument);
  el.replaceChildren(fragment);
  el.dataset.bidiPatched = "1";
}

function patchSVGText(el, shouldUseRtlTextMode) {
  if (!isElement(el)) return;

  const text = el.textContent ?? "";
  if (!text.trim()) return;

  if (shouldUseRtlTextMode) {
    el.setAttribute("direction", "rtl");
    el.setAttribute("unicode-bidi", "embed");
    el.setAttribute("text-anchor", "start");
  } else {
    el.removeAttribute("direction");
    el.removeAttribute("unicode-bidi");
    el.removeAttribute("text-anchor");
  }

  el.dataset.bidiPatched = "1";
}

function patchEditableInputs(root, shouldUseRtlTextMode) {
  root.querySelectorAll(EDITABLE_SELECTOR_STRING).forEach((el) => {
    if (shouldUseRtlTextMode) {
      el.setAttribute("dir", "rtl");
    } else {
      el.removeAttribute("dir");
    }
  });
}

function patchRoot(root, shouldUseRtlTextMode) {
  root.querySelectorAll(DISPLAY_SELECTOR_STRING).forEach((el) => {
    patchHTMLElement(el);
  });

  root.querySelectorAll(SVG_SELECTOR_STRING).forEach((el) => {
    patchSVGText(el, shouldUseRtlTextMode);
  });

  patchEditableInputs(root, shouldUseRtlTextMode);
}

export default function installLabelStudioBidiPatch(root, options = {}) {
  if (!root) return () => {};

  const shouldUseRtlTextMode = isRtlLanguage(options.targetLanguage);

  root.classList.add("shoonya-ls-bidi");
  if (shouldUseRtlTextMode) {
    root.classList.add("shoonya-ls-rtl-urdu");
  } else {
    root.classList.remove("shoonya-ls-rtl-urdu");
  }

  let rafId = null;

  const schedulePatch = () => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      patchRoot(root, shouldUseRtlTextMode);
      rafId = null;
    });
  };

  const observer = new MutationObserver((mutations) => {
    let relevant = false;

    for (const mutation of mutations) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        relevant = true;
        break;
      }
    }

    if (relevant) {
      schedulePatch();
    }
  });

  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  schedulePatch();

  return function cleanupBidiPatch() {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  };
}

export { installLabelStudioBidiPatch };
