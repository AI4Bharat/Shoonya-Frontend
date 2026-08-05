import {
  observeOcrRtlDirection,
  stripOcrBidiIsolates,
  wrapOcrLtrRuns,
} from "./ocrRtlDirection";

const LRI = "\u2066";
const PDI = "\u2069";

describe("OCR mixed-direction text isolation", () => {
  it("keeps a bracketed English marker together before RTL text", () => {
    expect(wrapOcrLtrRuns("(a)دو")).toBe(`${LRI}(a)${PDI}دو`);
  });

  it("keeps a bracketed English marker together after RTL text", () => {
    expect(wrapOcrLtrRuns("دو(a)")).toBe(`دو${LRI}(a)${PDI}`);
  });

  it("wraps arbitrarily long numbers and operators by spaced token", () => {
    expect(wrapOcrLtrRuns("عدد 114857390123/100 = 55")).toBe(
      `عدد ${LRI}114857390123/100${PDI} ${LRI}=${PDI} ${LRI}55${PDI}`,
    );
  });

  it("wraps each line independently", () => {
    expect(wrapOcrLtrRuns("(a)دو\n2017 اردو")).toBe(
      `${LRI}(a)${PDI}دو\n${LRI}2017${PDI} اردو`,
    );
  });

  it("is idempotent and strips presentation markers cleanly", () => {
    const wrapped = wrapOcrLtrRuns("دو (John Dewey) 2017");

    expect(wrapOcrLtrRuns(wrapped)).toBe(wrapped);
    expect(stripOcrBidiIsolates(wrapped)).toBe("دو (John Dewey) 2017");
  });

  it("inserts Urdu logically after an isolated LTR token", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();

    for (const character of "(a)دو") {
      const beforeInput = new Event("beforeinput", {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperties(beforeInput, {
        inputType: { value: "insertText" },
        data: { value: character },
        isComposing: { value: false },
      });
      textarea.dispatchEvent(beforeInput);
    }

    expect(textarea.value).toBe(`${LRI}(a)${PDI}دو`);
    expect(stripOcrBidiIsolates(textarea.value)).toBe("(a)دو");

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("keeps the green saved OCR display on an RTL base", () => {
    const root = document.createElement("div");
    const savedRegion = document.createElement("div");
    const savedParagraph = document.createElement("p");
    const savedText = document.createElement("span");
    const editIcon = document.createElement("span");

    savedRegion.dataset.testid = "textarea-region";
    savedParagraph.id = "TextAreaRegion-test-id";
    savedText.textContent = "(a) دو";
    editIcon.className = "ant-typography-edit";
    savedParagraph.append(savedText, editIcon);
    savedRegion.appendChild(savedParagraph);
    root.appendChild(savedRegion);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);

    expect(savedText.getAttribute("dir")).toBe("rtl");
    expect(savedText.textContent).toBe(`${LRI}(a)${PDI} دو`);
    expect(savedParagraph.contains(editIcon)).toBe(true);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("removes OCR presentation wrappers when RTL typing is disabled", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    textarea.value = "(a) دو";
    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();

    expect(textarea.value).toBe(`${LRI}(a)${PDI} دو`);

    document.documentElement.dataset.rtlTyping = "false";
    window.dispatchEvent(new Event("rtltypingchange"));

    expect(textarea.value).toBe("(a) دو");
    expect(textarea.hasAttribute("dir")).toBe(false);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("deletes visible character immediately on single Backspace press", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();

    for (const character of "(a)دو") {
      const beforeInput = new Event("beforeinput", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperties(beforeInput, {
        inputType: { value: "insertText" },
        data: { value: character },
        isComposing: { value: false },
      });
      textarea.dispatchEvent(beforeInput);
    }

    expect(stripOcrBidiIsolates(textarea.value)).toBe("(a)دو");

    // Position caret right after (a) -> visible offset 3
    textarea.setSelectionRange(5, 5);

    const backspaceInput = new Event("beforeinput", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperties(backspaceInput, {
      inputType: { value: "deleteContentBackward" },
      isComposing: { value: false },
    });
    textarea.dispatchEvent(backspaceInput);

    expect(stripOcrBidiIsolates(textarea.value)).toBe("(aدو");
    expect(textarea.value).toBe(`${LRI}(a${PDI}دو`);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("deletes an entire emoji without leaving a broken surrogate", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    textarea.value = "(a)😀دو";
    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();
    const caretAfterEmoji = textarea.value.indexOf(PDI);
    textarea.setSelectionRange(caretAfterEmoji, caretAfterEmoji);

    const backspaceInput = new Event("beforeinput", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperties(backspaceInput, {
      inputType: { value: "deleteContentBackward" },
      isComposing: { value: false },
    });
    textarea.dispatchEvent(backspaceInput);

    expect(textarea.value).toBe(`${LRI}(a)${PDI}دو`);
    expect(stripOcrBidiIsolates(textarea.value)).toBe("(a)دو");
    expect(textarea.selectionStart).toBe(5);
    expect(textarea.selectionEnd).toBe(5);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("deletes an entire emoji with forward Delete", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    textarea.value = "(a)😀دو";
    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();
    const caretBeforeEmoji = textarea.value.indexOf("😀");
    textarea.setSelectionRange(caretBeforeEmoji, caretBeforeEmoji);

    const deleteInput = new Event("beforeinput", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperties(deleteInput, {
      inputType: { value: "deleteContentForward" },
      isComposing: { value: false },
    });
    textarea.dispatchEvent(deleteInput);

    expect(textarea.value).toBe(`${LRI}(a)${PDI}دو`);
    expect(stripOcrBidiIsolates(textarea.value)).toBe("(a)دو");
    expect(textarea.selectionStart).toBe(5);
    expect(textarea.selectionEnd).toBe(5);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });

  it("does not treat a collapsed cut as Backspace", () => {
    const root = document.createElement("div");
    const textarea = document.createElement("textarea");

    textarea.value = "(a)دو";
    root.appendChild(textarea);
    document.body.appendChild(root);
    document.documentElement.dataset.rtlTyping = "true";

    const stopObserving = observeOcrRtlDirection(root);
    textarea.focus();
    textarea.setSelectionRange(5, 5);

    const cutInput = new Event("beforeinput", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperties(cutInput, {
      inputType: { value: "deleteByCut" },
      isComposing: { value: false },
    });
    textarea.dispatchEvent(cutInput);

    expect(cutInput.defaultPrevented).toBe(false);
    expect(textarea.value).toBe(`${LRI}(a)${PDI}دو`);

    stopObserving();
    root.remove();
    delete document.documentElement.dataset.rtlTyping;
  });
});
