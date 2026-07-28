const RTL_CHAR_RE = /[\u0590-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;

/*
  Isolate only strong / high-confidence LTR fragments.
  IMPORTANT: Do NOT isolate bare standalone numbers like 100 or 30,
  allowing numbers to naturally follow the surrounding text structure.

  Covers examples like:
  - A, B, C, D
  - C1, CL, CL-
  - 2ms-2
  - PhD
  - Translation Studies
  - John Dewey
  - P.H.Appleby
  - (A), (B), option labels, English phrases
*/
const LTR_TOKEN_RE =
  /(?:\([A-Za-z0-9]+\)|\[[A-Za-z0-9]+\]|\{[A-Za-z0-9]+\}|[A-Za-z]+(?:[.\-/][A-Za-z0-9]+)*|[A-Za-z0-9]+(?:[.\-/][A-Za-z0-9]+)+|[A-Za-z]+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*)/g;

function hasRTL(text) {
  return RTL_CHAR_RE.test(text);
}

function createBdi(doc, text, dir) {
  const el = doc.createElement("bdi");
  el.setAttribute("dir", dir);
  el.dataset.bidiRun = dir;
  el.textContent = text;
  return el;
}

function appendPlain(fragment, doc, text) {
  if (!text) return;

  if (hasRTL(text)) {
    fragment.appendChild(createBdi(doc, text, "rtl"));
  } else {
    fragment.appendChild(doc.createTextNode(text));
  }
}

function buildLineContent(line, doc) {
  const lineFragment = doc.createDocumentFragment();
  let lastIndex = 0;

  for (const match of line.matchAll(LTR_TOKEN_RE)) {
    const index = match.index ?? 0;
    const token = match[0];

    if (index > lastIndex) {
      appendPlain(lineFragment, doc, line.slice(lastIndex, index));
    }

    lineFragment.appendChild(createBdi(doc, token, "ltr"));
    lastIndex = index + token.length;
  }

  if (lastIndex < line.length) {
    appendPlain(lineFragment, doc, line.slice(lastIndex));
  }

  return lineFragment;
}

export default function buildBidiFragment(raw, doc = document) {
  const fragment = doc.createDocumentFragment();
  if (raw == null) return fragment;

  const lines = String(raw).split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      fragment.appendChild(doc.createElement("br"));
    }

    if (!line) return;

    const lineWrapper = doc.createElement("bdi");
    lineWrapper.setAttribute("dir", "auto");
    lineWrapper.dataset.bidiLine = "1";
    lineWrapper.style.unicodeBidi = "plaintext";
    lineWrapper.appendChild(buildLineContent(line, doc));

    fragment.appendChild(lineWrapper);
  });

  return fragment;
}

export { buildBidiFragment };