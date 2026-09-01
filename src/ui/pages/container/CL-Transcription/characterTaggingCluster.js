export const TAMIL_PULLI = "\u0BCD";
export const DEVANAGARI_VIRAMA = "\u094D";
export const NUKTA = "\u093C";

export const VIRAMA_CHARS = new Set([
  "\u094D", // Devanagari virama
  "\u0BCD", // Tamil pulli
  "\u0D4D", // Malayalam chandrakkala
  "\u0C4D", // Telugu virama
  "\u0CCD", // Kannada virama
  "\u09CD", // Bengali virama
  "\u0ACD", // Gujarati virama
  "\u0A4D", // Gurmukhi virama
  "\u0B4D", // Oriya virama
]);

/**
 * Segments text into orthographic syllable clusters (aksharas).
 * Preserves strict UTF-16 code unit offsets.
 *
 * - Marathi / Devanagari (`mr`):
 *   Includes preceding consonant+virama sequences and following vowel marks,
 *   treating `(Consonant + Nukta? + Virama)* + Consonant + Nukta? + (Vowel Signs/Modifiers)*`
 *   as a single unified conjunct cluster (e.g. `र्ची`, `श्चि`, `र्फ`, `च्छ`, `ज्य`, `र्फे`).
 *
 * - Tamil (`ta`):
 *   Retains the pulli rule—attaches pulli to the preceding consonant (e.g. `க்`, `த்`, `ப்`, `ம்`),
 *   but stops before the next consonant.
 *
 * @param {string} text
 * @param {string} lang - 'mr' | 'ta' | string
 * @returns {Array<{ start: number, end: number, text: string, isSpace?: boolean, isBracket?: boolean }>}
 */
export const getSyllableClusters = (text, lang = "mr") => {
  if (!text) return [];
  const clusters = [];
  let i = 0;

  while (i < text.length) {
    if (/\s/.test(text[i])) {
      clusters.push({ start: i, end: i + 1, text: text[i], isSpace: true });
      i++;
      continue;
    }

    if (text[i] === "{" || text[i] === "}" || text[i] === "<" || text[i] === ">") {
      clusters.push({ start: i, end: i + 1, text: text[i], isBracket: true });
      i++;
      continue;
    }

    const start = i;
    while (i < text.length) {
      if (/\p{L}/u.test(text[i])) {
        i++;
      }
      while (i < text.length && /\p{M}/u.test(text[i])) {
        i++;
      }

      // Marathi / Indic conjuncts: continue across virama to include following consonant
      // Tamil: stops before the following consonant (pulli is attached to preceding consonant only)
      if (
        lang !== "ta" &&
        i > start &&
        VIRAMA_CHARS.has(text[i - 1]) &&
        text[i - 1] !== TAMIL_PULLI &&
        i < text.length &&
        /\p{L}/u.test(text[i])
      ) {
        continue;
      }
      break;
    }

    if (i === start) {
      i++;
    }

    clusters.push({ start, end: i, text: text.slice(start, i) });
  }

  return clusters;
};

/**
 * Searches the clicked cluster for mapped consonants.
 * Handles multiple mapped consonants within a single cluster (e.g. `च्च` or `ज्ज`)
 * deterministically by choosing the consonant closest to the click index.
 * For nukta combinations, resolves to the combined form only when it exists in mappings.
 *
 * @param {string} text
 * @param {number} index - UTF-16 code unit index of click / cursor
 * @param {Object} mappings - Language character mappings dictionary
 * @param {string} lang - 'mr' | 'ta' | string
 * @returns {{ key: string, baseIndex: number, length: number, clusterStart: number, clusterEnd: number, clusterText: string, allCandidates?: Array } | null}
 */
export const resolveTaggableChar = (text, index, mappings, lang = "mr") => {
  if (index < 0 || index >= text.length || !mappings) return null;

  const clusters = getSyllableClusters(text, lang);
  const cluster = clusters.find((c) => index >= c.start && index < c.end);
  if (!cluster || cluster.isSpace || cluster.isBracket) return null;

  const candidates = [];
  for (let offset = 0; offset < cluster.text.length; offset++) {
    // Check 2-character nukta sequence
    if (offset + 1 < cluster.text.length && cluster.text[offset + 1] === NUKTA) {
      const combined = cluster.text[offset] + cluster.text[offset + 1];
      const nfc = combined.normalize ? combined.normalize("NFC") : combined;
      const nfd = combined.normalize ? combined.normalize("NFD") : combined;
      const matchedKey = mappings[combined]
        ? combined
        : mappings[nfc]
        ? nfc
        : mappings[nfd]
        ? nfd
        : null;

      if (matchedKey) {
        candidates.push({
          key: matchedKey,
          baseIndex: cluster.start + offset,
          length: 2,
        });
      }
      // Advance past nukta: if combined is unmapped, never fall back to treating base consonant as plain consonant
      offset++;
      continue;
    }

    // Check single character
    const ch = cluster.text[offset];
    if (mappings[ch]) {
      candidates.push({
        key: ch,
        baseIndex: cluster.start + offset,
        length: 1,
      });
    }
  }

  if (candidates.length === 0) return null;

  if (candidates.length === 1) {
    return {
      ...candidates[0],
      clusterStart: cluster.start,
      clusterEnd: cluster.end,
      clusterText: cluster.text,
    };
  }

  // Deterministically choose the candidate closest to the click index
  const closest = candidates.reduce((prev, curr) => {
    return Math.abs(curr.baseIndex - index) < Math.abs(prev.baseIndex - index)
      ? curr
      : prev;
  });

  return {
    ...closest,
    clusterStart: cluster.start,
    clusterEnd: cluster.end,
    clusterText: cluster.text,
    allCandidates: candidates,
  };
};

/**
 * Parses word-level tag status and matches `<tag>` tokens to actual `{...}` wrapped groups.
 *
 * @param {string} text
 * @param {number} coreWordStart
 * @param {number} coreWordEnd
 * @param {Object} mappings
 * @param {string} lang
 * @returns {{ wrappedGroups: Array<{ start: number, end: number, inner: string }>, tagZoneStr: string, tagZoneEnd: number, tokens: string[] }}
 */
export const getWordTagInfo = (text, coreWordStart, coreWordEnd, mappings, lang = "mr") => {
  const coreWord = text.slice(coreWordStart, coreWordEnd);
  const tagZoneMatch = text.slice(coreWordEnd).match(/^(?:\s*<[^>]*>)*/);
  const tagZoneStr = tagZoneMatch ? tagZoneMatch[0] : "";
  const tagZoneEnd = coreWordEnd + tagZoneStr.length;
  const tokens = tagZoneStr.match(/<[^>]+>/g) || [];

  const wrappedGroups = [];
  const braceRegex = /\{([^{}]+)\}/g;
  let match;
  while ((match = braceRegex.exec(coreWord)) !== null) {
    wrappedGroups.push({
      start: coreWordStart + match.index,
      end: coreWordStart + match.index + match[0].length,
      inner: match[1],
    });
  }

  return { wrappedGroups, tagZoneStr, tagZoneEnd, tokens };
};

/**
 * Syllable/akshara-level hit testing for textarea coordinates.
 * Renders whole syllable cluster `<span>` elements in the mirror div so the browser
 * applies identical OpenType ligature shaping, reph placement, and geometry.
 *
 * @param {HTMLTextAreaElement} textarea
 * @param {number} clientX
 * @param {number} clientY
 * @param {string} lang
 * @returns {number} UTF-16 code unit index of the clicked cluster or -1
 */
export const getCharIndexAtPoint = (textarea, clientX, clientY, lang = "mr") => {
  if (!textarea || typeof window === "undefined") return -1;
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");

  const propsToCopy = [
    "boxSizing", "width",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing",
    "lineHeight", "textTransform", "wordSpacing", "tabSize",
  ];
  propsToCopy.forEach((p) => {
    mirror.style[p] = style[p];
  });

  const rect = textarea.getBoundingClientRect();
  mirror.style.position = "fixed";
  mirror.style.top = `${rect.top}px`;
  mirror.style.left = `${rect.left}px`;
  mirror.style.height = `${textarea.clientHeight}px`;
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "hidden";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.margin = "0";
  mirror.style.zIndex = "-1";

  const text = textarea.value || "";
  const spans = [];
  const lines = text.split("\n");
  let globalCharOffset = 0;

  for (let l = 0; l < lines.length; l++) {
    const lineText = lines[l];
    const clusters = getSyllableClusters(lineText, lang);
    for (const cluster of clusters) {
      const span = document.createElement("span");
      span.textContent = cluster.text;
      mirror.appendChild(span);
      spans.push({
        span,
        start: globalCharOffset + cluster.start,
        end: globalCharOffset + cluster.end,
      });
    }
    if (l < lines.length - 1) {
      mirror.appendChild(document.createElement("br"));
      globalCharOffset += lineText.length + 1; // +1 for \n
    }
  }

  document.body.appendChild(mirror);
  mirror.scrollTop = textarea.scrollTop;
  mirror.scrollLeft = textarea.scrollLeft;

  let foundIndex = -1;
  for (let i = 0; i < spans.length; i++) {
    const item = spans[i];
    const r = item.span.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top &&
      clientY <= r.bottom
    ) {
      foundIndex = item.start;
      break;
    }
  }

  document.body.removeChild(mirror);
  return foundIndex;
};
