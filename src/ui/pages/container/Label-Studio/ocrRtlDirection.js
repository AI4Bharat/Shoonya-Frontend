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
const GRAPHEME_SEGMENTER =
  typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

const rtlTypingIsEnabled = () =>
  document.documentElement.dataset.rtlTyping === "true";

const isContentEditableControl = (element) =>
  element.matches?.('[contenteditable="true"]');

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
  const tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(element.value);
  }
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
  if (isContentEditableControl(element)) return false;

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
  const isContentEditable = isContentEditableControl(element);
  const originalValue = isContentEditable
    ? element.textContent
    : element.value;
  const plainValue = stripOcrBidiIsolates(originalValue);
  if (plainValue === originalValue) return false;

  if (isContentEditable) {
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

const contentEditableOffset = (element, container, offset) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.setEnd(container, offset);
  return range.toString().length;
};

const getContentEditableSelection = (element) => {
  const selection = window.getSelection();
  const fallbackOffset = element.textContent.length;

  if (!selection || selection.rangeCount === 0) {
    return { start: fallbackOffset, end: fallbackOffset };
  }

  const range = selection.getRangeAt(0);
  if (
    !element.contains(range.startContainer) ||
    !element.contains(range.endContainer)
  ) {
    return { start: fallbackOffset, end: fallbackOffset };
  }

  return {
    start: contentEditableOffset(
      element,
      range.startContainer,
      range.startOffset,
    ),
    end: contentEditableOffset(element, range.endContainer, range.endOffset),
  };
};

const setContentEditableSelection = (
  element,
  visibleStart,
  visibleEnd = visibleStart,
) => {
  const value = element.textContent;
  const start = domOffsetFromVisibleOffset(value, visibleStart);
  const end = domOffsetFromVisibleOffset(value, visibleEnd);
  const walker = document.createTreeWalker(
    element,
    window.NodeFilter.SHOW_TEXT,
  );
  const textNodes = [];
  let node = walker.nextNode();

  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }

  const locateOffset = (targetOffset) => {
    let remaining = targetOffset;

    for (const textNode of textNodes) {
      if (remaining <= textNode.data.length) {
        return { node: textNode, offset: remaining };
      }
      remaining -= textNode.data.length;
    }

    const lastTextNode = textNodes[textNodes.length - 1];
    return lastTextNode
      ? { node: lastTextNode, offset: lastTextNode.data.length }
      : { node: element, offset: 0 };
  };

  const startPosition = locateOffset(start);
  const endPosition = locateOffset(end);
  const range = document.createRange();
  range.setStart(startPosition.node, startPosition.offset);
  range.setEnd(endPosition.node, endPosition.offset);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const graphemeBoundaries = (value) => {
  if (GRAPHEME_SEGMENTER) {
    return [
      ...Array.from(GRAPHEME_SEGMENTER.segment(value), ({ index }) => index),
      value.length,
    ];
  }

  let offset = 0;
  const boundaries = [offset];
  for (const character of value) {
    offset += character.length;
    boundaries.push(offset);
  }
  return boundaries;
};

const adjacentGraphemeBoundary = (value, offset, isForward) => {
  const boundaries = graphemeBoundaries(value);

  if (isForward) {
    return boundaries.find((boundary) => boundary > offset) ?? value.length;
  }

  for (let index = boundaries.length - 1; index >= 0; index -= 1) {
    if (boundaries[index] < offset) return boundaries[index];
  }

  return 0;
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

const deleteTextAtLogicalCaret = (element, isForward = false) => {
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

  let nextPlainValue = plainValue;
  let nextCaret = selectionStart;

  if (selectionStart !== selectionEnd) {
    nextPlainValue =
      plainValue.slice(0, selectionStart) + plainValue.slice(selectionEnd);
    nextCaret = selectionStart;
  } else if (!isForward && selectionStart > 0) {
    const previousBoundary = adjacentGraphemeBoundary(
      plainValue,
      selectionStart,
      false,
    );
    nextPlainValue =
      plainValue.slice(0, previousBoundary) + plainValue.slice(selectionStart);
    nextCaret = previousBoundary;
  } else if (isForward && selectionStart < plainValue.length) {
    const nextBoundary = adjacentGraphemeBoundary(
      plainValue,
      selectionStart,
      true,
    );
    nextPlainValue =
      plainValue.slice(0, selectionStart) + plainValue.slice(nextBoundary);
    nextCaret = selectionStart;
  } else {
    return;
  }

  setNativeControlValue(element, wrapOcrLtrRuns(nextPlainValue));
  setControlSelection(element, nextCaret);
  element.dispatchEvent(new Event("input", { bubbles: true }));

  queueMicrotask(() => {
    if (element === document.activeElement) setControlSelection(element, nextCaret);
  });
};

const deleteContentEditableAtLogicalCaret = (element, isForward = false) => {
  const originalValue = element.textContent;
  const plainValue = stripOcrBidiIsolates(originalValue);
  const selection = getContentEditableSelection(element);
  const selectionStart = visibleOffset(originalValue, selection.start);
  const selectionEnd = visibleOffset(originalValue, selection.end);

  let nextPlainValue = plainValue;
  let nextCaret = selectionStart;

  if (selectionStart !== selectionEnd) {
    nextPlainValue =
      plainValue.slice(0, selectionStart) + plainValue.slice(selectionEnd);
  } else if (!isForward && selectionStart > 0) {
    const previousBoundary = adjacentGraphemeBoundary(
      plainValue,
      selectionStart,
      false,
    );
    nextPlainValue =
      plainValue.slice(0, previousBoundary) + plainValue.slice(selectionStart);
    nextCaret = previousBoundary;
  } else if (isForward && selectionStart < plainValue.length) {
    const nextBoundary = adjacentGraphemeBoundary(
      plainValue,
      selectionStart,
      true,
    );
    nextPlainValue =
      plainValue.slice(0, selectionStart) + plainValue.slice(nextBoundary);
  } else {
    return;
  }

  element.textContent = wrapOcrLtrRuns(nextPlainValue);
  setContentEditableSelection(element, nextCaret);
  element.dispatchEvent(new Event("input", { bubbles: true }));

  queueMicrotask(() => {
    if (element === document.activeElement) {
      setContentEditableSelection(element, nextCaret);
    }
  });
};

const insertContentEditableAtLogicalCaret = (element, insertedText) => {
  const originalValue = element.textContent;
  const plainValue = stripOcrBidiIsolates(originalValue);
  const selection = getContentEditableSelection(element);
  const selectionStart = visibleOffset(originalValue, selection.start);
  const selectionEnd = visibleOffset(originalValue, selection.end);

  const nextPlainValue =
    plainValue.slice(0, selectionStart) +
    insertedText +
    plainValue.slice(selectionEnd);
  const nextCaret = selectionStart + insertedText.length;

  element.textContent = wrapOcrLtrRuns(nextPlainValue);
  setContentEditableSelection(element, nextCaret);
  element.dispatchEvent(new Event("input", { bubbles: true }));

  queueMicrotask(() => {
    if (element === document.activeElement) {
      setContentEditableSelection(element, nextCaret);
    }
  });
};

const isTextControlInsideRoot = (root, target) =>
  target?.nodeType === 1 &&
  (root.contains(target) || Boolean(target.closest('.lsf-portal, .lsf-modal, .lsf-modal-portal, .ant-modal, .ant-popover, [role="dialog"]'))) &&
  target.matches(OCR_TEXT_CONTROL_SELECTOR);

const isNativeTextControlInsideRoot = (root, target) =>
  target?.nodeType === 1 &&
  (root.contains(target) || Boolean(target.closest('.lsf-portal, .lsf-modal, .lsf-modal-portal, .ant-modal, .ant-popover, [role="dialog"]'))) &&
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
  let pendingKeyboardDeletion = null;
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
  const deleteAtLogicalCaret = (element, isForward) => {
    if (isNativeTextControlInsideRoot(root, element)) {
      deleteTextAtLogicalCaret(element, isForward);
    } else {
      deleteContentEditableAtLogicalCaret(element, isForward);
    }
  };
  const handleKeyDown = (event) => {
    const isBackward = event.key === "Backspace";
    const isForward = event.key === "Delete";

    if (
      (!isBackward && !isForward) ||
      event.defaultPrevented ||
      event.isComposing ||
      isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      (event.shiftKey && isForward) ||
      !rtlTypingIsEnabled() ||
      !isTextControlInsideRoot(root, event.target)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    deleteAtLogicalCaret(event.target, isForward);

    const deletion = { target: event.target, isForward };
    pendingKeyboardDeletion = deletion;
    queueMicrotask(() => {
      if (pendingKeyboardDeletion === deletion) pendingKeyboardDeletion = null;
    });
  };
  const handleBeforeInput = (event) => {
    if (
      isComposing ||
      event.isComposing ||
      !rtlTypingIsEnabled() ||
      !isTextControlInsideRoot(root, event.target)
    ) {
      return;
    }

    if (
      event.inputType === "deleteContentBackward" ||
      event.inputType === "deleteContentForward" ||
      event.inputType === "deleteByCut"
    ) {
      if (
        pendingKeyboardDeletion?.target === event.target &&
        event.inputType !== "deleteByCut"
      ) {
        event.preventDefault();
        event.stopPropagation();
        pendingKeyboardDeletion = null;
        return;
      }

      if (
        event.inputType === "deleteByCut" &&
        (isNativeTextControlInsideRoot(root, event.target)
          ? event.target.selectionStart === event.target.selectionEnd
          : (() => {
              const selection = getContentEditableSelection(event.target);
              return selection.start === selection.end;
            })())
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const isForward = event.inputType === "deleteContentForward";
      deleteAtLogicalCaret(event.target, isForward);
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
    if (isNativeTextControlInsideRoot(root, event.target)) {
      insertTextAtLogicalCaret(event.target, insertedText);
    } else {
      insertContentEditableAtLogicalCaret(event.target, insertedText);
    }
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
  document.addEventListener("keydown", handleKeyDown, true);
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
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("beforeinput", handleBeforeInput, true);
    document.removeEventListener("input", handleInput, true);
    window.removeEventListener("rtltypingchange", handleRtlTypingChange);
  };
};
