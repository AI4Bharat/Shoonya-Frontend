const OCR_NATIVE_TEXT_CONTROL_SELECTOR = 'textarea, input[type="text"]';
const OCR_SAVED_TEXT_CONTROL_SELECTOR = [
  ".lsf-region-item__desc textarea",
  '.lsf-region-item__desc input[type="text"]',
].join(", ");
const OCR_SAVED_TEXT_DISPLAY_SELECTOR =
  '[data-testid="textarea-region"] [id^="TextAreaRegion-"] > span:first-child';
const OCR_TEXT_CONTROL_SELECTOR =
  `${OCR_NATIVE_TEXT_CONTROL_SELECTOR}, [contenteditable="true"]`;
const OCR_BIDI_ELEMENT_SELECTOR = [
  OCR_TEXT_CONTROL_SELECTOR,
  OCR_SAVED_TEXT_DISPLAY_SELECTOR,
  ".lsf-region-item__desc",
  ".lsf-region-item__text",
].join(", ");

const LRI = "\u2066";
const PDI = "\u2069";
let activeOcrBidiRoots = 0;
const BIDI_ISOLATE_REGEX = /[\u2066\u2067\u2068\u2069]/g;
const BIDI_ISOLATE_CHARACTER = /[\u2066\u2067\u2068\u2069]/;

const RTL_CHARACTER = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufefc]/;

const rtlTypingIsEnabled = () =>
  document.documentElement.dataset.rtlTyping === "true";

export const stripOcrBidiIsolates = (value) =>
  typeof value === "string" ? value.replace(BIDI_ISOLATE_REGEX, "") : value;

export const wrapOcrLtrRuns = (value) => {
  const plainValue = stripOcrBidiIsolates(value);

  return plainValue
    .split("\n")
    .map((line) => {
      let output = "";
      let ltrRun = "";

      const flushLtrRun = () => {
        if (!ltrRun) return;
        output += `${LRI}${ltrRun}${PDI}`;
        ltrRun = "";
      };

      for (const character of line) {
        if (RTL_CHARACTER.test(character)) {
          flushLtrRun();
          output += character;
        } else if (/\s/.test(character)) {
          flushLtrRun();
          output += character;
        } else {
          ltrRun += character;
        }
      }

      flushLtrRun();
      return output;
    })
    .join("\n");
};

const visibleOffset = (value, offset) =>
  stripOcrBidiIsolates(value.slice(0, offset)).length;

const domOffsetFromVisibleOffset = (value, visibleOffsetValue) => {
  let offset = 0;
  let visibleCharacters = 0;

  while (offset < value.length && visibleCharacters < visibleOffsetValue) {
    if (!BIDI_ISOLATE_CHARACTER.test(value[offset])) visibleCharacters += 1;
    offset += 1;
  }

  while (offset < value.length && BIDI_ISOLATE_CHARACTER.test(value[offset])) {
    offset += 1;
  }

  return offset;
};

const setNativeControlValue = (element, value) => {
  const prototype =
    element.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const valueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value",
  )?.set;

  if (valueSetter) valueSetter.call(element, value);
  else element.value = value;
};

const normalizeTextControl = (element) => {
  if (element.isContentEditable) return false;

  const originalValue = element.value;
  const wrappedValue = wrapOcrLtrRuns(originalValue);
  if (wrappedValue === originalValue) return false;

  const selectionStart = visibleOffset(
    originalValue,
    element.selectionStart ?? originalValue.length,
  );
  const selectionEnd = visibleOffset(
    originalValue,
    element.selectionEnd ?? originalValue.length,
  );

  setNativeControlValue(element, wrappedValue);
  element.setSelectionRange(
    domOffsetFromVisibleOffset(wrappedValue, selectionStart),
    domOffsetFromVisibleOffset(wrappedValue, selectionEnd),
  );
  return true;
};

const normalizeSavedTextDisplay = (element) => {
  const wrappedValue = wrapOcrLtrRuns(element.textContent);
  if (wrappedValue === element.textContent) return false;
  element.textContent = wrappedValue;
  return true;
};

const removeTextControlIsolates = (element) => {
  const originalValue = element.isContentEditable
    ? element.textContent
    : element.value;
  const plainValue = stripOcrBidiIsolates(originalValue);
  if (plainValue === originalValue) return false;

  if (element.isContentEditable) {
    element.textContent = plainValue;
    return true;
  }

  const selectionStart = visibleOffset(
    originalValue,
    element.selectionStart ?? originalValue.length,
  );
  const selectionEnd = visibleOffset(
    originalValue,
    element.selectionEnd ?? originalValue.length,
  );
  setNativeControlValue(element, plainValue);
  element.setSelectionRange(selectionStart, selectionEnd);
  return true;
};

const setControlSelection = (element, start, end = start) => {
  element.setSelectionRange(
    domOffsetFromVisibleOffset(element.value, start),
    domOffsetFromVisibleOffset(element.value, end),
  );
};

const insertTextAtLogicalCaret = (element, insertedText) => {
  const originalValue = element.value;
  const plainValue = stripOcrBidiIsolates(originalValue);
  const selectionStart = visibleOffset(
    originalValue,
    element.selectionStart ?? originalValue.length,
  );
  const selectionEnd = visibleOffset(
    originalValue,
    element.selectionEnd ?? originalValue.length,
  );
  const nextPlainValue =
    plainValue.slice(0, selectionStart) +
    insertedText +
    plainValue.slice(selectionEnd);
  const nextCaret = selectionStart + insertedText.length;

  setNativeControlValue(element, wrapOcrLtrRuns(nextPlainValue));
  setControlSelection(element, nextCaret);
  element.dispatchEvent(new Event("input", { bubbles: true }));

  queueMicrotask(() => {
    if (element === document.activeElement) setControlSelection(element, nextCaret);
  });
};

const isTextControlInsideRoot = (root, target) =>
  target?.nodeType === 1 &&
  root.contains(target) &&
  target.matches(OCR_TEXT_CONTROL_SELECTOR);

const isNativeTextControlInsideRoot = (root, target) =>
  target?.nodeType === 1 &&
  root.contains(target) &&
  target.matches(OCR_NATIVE_TEXT_CONTROL_SELECTOR);

const applyDirection = (element, enabled) => {
  if (enabled) {
    const isSavedTextDisplay = element.matches(OCR_SAVED_TEXT_DISPLAY_SELECTOR);
    element.setAttribute(
      "dir",
      element.matches(OCR_TEXT_CONTROL_SELECTOR) || isSavedTextDisplay
        ? "rtl"
        : "auto",
    );
    element.dataset.ocrRtlBidi = "true";

    if (isSavedTextDisplay) normalizeSavedTextDisplay(element);
    if (
      element.matches(OCR_SAVED_TEXT_CONTROL_SELECTOR) &&
      normalizeTextControl(element)
    ) {
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
  } else if (element.dataset.ocrRtlBidi === "true") {
    if (element.matches(OCR_SAVED_TEXT_DISPLAY_SELECTOR)) {
      element.textContent = stripOcrBidiIsolates(element.textContent);
    } else if (
      element.matches(OCR_TEXT_CONTROL_SELECTOR) &&
      removeTextControlIsolates(element)
    ) {
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    element.removeAttribute("dir");
    delete element.dataset.ocrRtlBidi;
  }
};

const refreshDirections = (root) => {
  const enabled = rtlTypingIsEnabled();
  root.querySelectorAll(OCR_BIDI_ELEMENT_SELECTOR).forEach((element) => {
    applyDirection(element, enabled);
  });
};

export const observeOcrRtlDirection = (root) => {
  if (!root) return undefined;

  activeOcrBidiRoots += 1;
  document.documentElement.dataset.ocrBidiActive = "true";
  refreshDirections(root);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches(OCR_BIDI_ELEMENT_SELECTOR)) {
          applyDirection(node, rtlTypingIsEnabled());
        }
        node.querySelectorAll(OCR_BIDI_ELEMENT_SELECTOR).forEach((element) => {
          applyDirection(element, rtlTypingIsEnabled());
        });
      });
    });
  });

  observer.observe(root, { childList: true, subtree: true });

  let isComposing = false;
  const handleFocusIn = (event) => {
    if (rtlTypingIsEnabled() && isTextControlInsideRoot(root, event.target)) {
      event.target.setAttribute("dir", "rtl");
      normalizeTextControl(event.target);
    }
  };
  const handleFocusOut = (event) => {
    if (rtlTypingIsEnabled() && isTextControlInsideRoot(root, event.target)) {
      event.target.setAttribute("dir", "rtl");
    }
  };
  const handleCompositionStart = (event) => {
    if (isTextControlInsideRoot(root, event.target)) isComposing = true;
  };
  const handleCompositionEnd = (event) => {
    if (!isTextControlInsideRoot(root, event.target)) return;
    isComposing = false;
    if (rtlTypingIsEnabled()) normalizeTextControl(event.target);
  };
  const handleBeforeInput = (event) => {
    if (
      isComposing ||
      event.isComposing ||
      !rtlTypingIsEnabled() ||
      !isNativeTextControlInsideRoot(root, event.target)
    ) {
      return;
    }

    const insertedText =
      event.inputType === "insertText" && event.data !== null
        ? event.data
        : event.inputType === "insertLineBreak"
          ? "\n"
          : null;
    if (insertedText === null) return;

    event.preventDefault();
    event.stopPropagation();
    insertTextAtLogicalCaret(event.target, insertedText);
  };
  const handleInput = (event) => {
    if (
      !isComposing &&
      rtlTypingIsEnabled() &&
      isTextControlInsideRoot(root, event.target)
    ) {
      normalizeTextControl(event.target);
    }
  };
  const handleRtlTypingChange = () => refreshDirections(root);

  document.addEventListener("focusin", handleFocusIn, true);
  document.addEventListener("focusout", handleFocusOut, true);
  document.addEventListener("compositionstart", handleCompositionStart, true);
  document.addEventListener("compositionend", handleCompositionEnd, true);
  document.addEventListener("beforeinput", handleBeforeInput, true);
  document.addEventListener("input", handleInput, true);
  window.addEventListener("rtltypingchange", handleRtlTypingChange);

  return () => {
    observer.disconnect();
    activeOcrBidiRoots -= 1;
    if (activeOcrBidiRoots === 0) {
      delete document.documentElement.dataset.ocrBidiActive;
    }
    document.removeEventListener("focusin", handleFocusIn, true);
    document.removeEventListener("focusout", handleFocusOut, true);
    document.removeEventListener("compositionstart", handleCompositionStart, true);
    document.removeEventListener("compositionend", handleCompositionEnd, true);
    document.removeEventListener("beforeinput", handleBeforeInput, true);
    document.removeEventListener("input", handleInput, true);
    window.removeEventListener("rtltypingchange", handleRtlTypingChange);
  };
};
