/**
 * Helper utilities to fix order reversal for mixed LTR/RTL text direction
 * in OCR projects, specifically for sequences like "20 N" or "2ms-2"
 * inside RTL text contexts.
 */

// Left-to-Right Isolate (LRI)
const LRI = '\u2066';
// Pop Directional Isolate (PDI)
const PDI = '\u2069';

// Regex to find sequences of English letters, numbers, spaces, and common math/unit symbols.
// It ensures the match starts with an optional sign (+/-) and alphanumeric character, and ends with alphanumeric, superscript, or sign.
const ISOLATE_REGEX = /([\-\+]?[a-zA-Z0-9][a-zA-Z0-9\s\.\-\+\/\*\u2070-\u209F\u00B2\u00B3\u00B9\^]*[a-zA-Z0-9\u2070-\u209F\u00B2\u00B3\u00B9\-\+]|[\-\+]?[a-zA-Z0-9])/g;

/**
 * Wraps LTR sequences (like "20 N" or "2ms-2") in LRI and PDI characters.
 * This completely isolates the block from the surrounding RTL paragraph,
 * ensuring neutral characters (like spaces or hyphens) inside the block
 * are rendered purely left-to-right.
 */
export const insertLrm = (text) => {
  if (typeof text !== 'string') return text;
  // First remove any existing isolation marks to avoid double-wrapping
  const cleaned = text.replace(/[\u2066\u2069\u200E]/g, '');
  return cleaned.replace(ISOLATE_REGEX, `${LRI}$1${PDI}`);
};

/**
 * Strips all bidi formatting characters before saving to backend.
 */
export const stripLrm = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/[\u2066\u2069\u200E]/g, '');
};

export const formatResultTexts = (result) => {
  if (!Array.isArray(result)) return result;
  return result.map((item) => {
    if (item.value && Array.isArray(item.value.text)) {
      return {
        ...item,
        value: {
          ...item.value,
          text: item.value.text.map(insertLrm),
        },
      };
    }
    return item;
  });
};

export const cleanResultTexts = (result) => {
  if (!Array.isArray(result)) return result;
  return result.map((item) => {
    if (item.value && Array.isArray(item.value.text)) {
      return {
        ...item,
        value: {
          ...item.value,
          text: item.value.text.map(stripLrm),
        },
      };
    }
    return item;
  });
};

export const formatAnnotations = (annotations) => {
  if (!Array.isArray(annotations)) return annotations;
  return annotations.map((ann) => ({
    ...ann,
    result: formatResultTexts(ann.result),
  }));
};

export const formatPredictions = (predictions) => {
  if (!predictions) return predictions;
  if (typeof predictions === 'string') {
    try {
      const parsed = JSON.parse(predictions);
      if (Array.isArray(parsed)) {
        return JSON.stringify(formatResultTexts(parsed));
      }
    } catch (_) {}
    return predictions;
  }
  if (Array.isArray(predictions)) {
    return formatResultTexts(predictions);
  }
  return predictions;
};

export const formatTaskData = (data) => {
  if (!data || typeof data !== 'object') return data;
  const copy = { ...data };
  for (const key of Object.keys(copy)) {
    if (typeof copy[key] === 'string') {
      copy[key] = insertLrm(copy[key]);
    }
  }
  return copy;
};
