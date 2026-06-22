/**
 * Helper utilities to fix order reversal for mixed LTR/RTL text direction
 * in OCR projects, specifically for sequences like "20 N" or "2ms-2"
 * inside RTL text contexts.
 */

// Left-to-Right Isolate (LRI)
const LRI = '\u2066';
// Pop Directional Isolate (PDI)
const PDI = '\u2069';

// Regex to find sequences of English letters, numbers, spaces, common math/unit symbols,
// and enclosing parentheses, brackets, curly braces, or quotes.
// Parentheses and brackets are included in the middle class to preserve option grouping (like (a) Waldo) within a single LTR run.
const ISOLATE_REGEX = /([\(\[\{\'\"]*[\-\+]?[a-zA-Z0-9][a-zA-Z0-9\s\.\-\+\/\*\(\)\[\]\{\}\u2070-\u209F\u00B2\u00B3\u00B9\^=%,;:_'"?!~<>@#$&|]*[a-zA-Z0-9\u2070-\u209F\u00B2\u00B3\u00B9\-\+\)\]\}\'\"]|[\(\[\{\'\"]*[\-\+]?[a-zA-Z0-9][\)\]\}\'\"]*)/g;

// Right-to-Left Mark (RLM)
const RLM = '\u200F';
// Regex to check if text contains Arabic/Urdu characters
const RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Wraps LTR sequences (like "20 N" or "2ms-2") in LRI and PDI characters.
 * Also prepends RLM to lines containing RTL text to force overall RTL paragraph direction.
 */
export const insertLrm = (text) => {
  if (typeof text !== 'string') return text;
  // First remove any existing isolation/direction marks to avoid double-wrapping
  const cleaned = text.replace(/[\u2066\u2069\u200E\u200F]/g, '');
  
  // Process line by line to ensure correct bidi resolution per line
  const lines = cleaned.split('\n');
  const processedLines = lines.map(line => {
    let isolated = line.replace(ISOLATE_REGEX, `${LRI}$1${PDI}`);
    if (RTL_REGEX.test(line)) {
      isolated = RLM + isolated;
    }
    return isolated;
  });
  
  return processedLines.join('\n');
};

/**
 * Strips all bidi formatting characters before saving to backend.
 */
export const stripLrm = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/[\u2066\u2069\u200E\u200F]/g, '');
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
