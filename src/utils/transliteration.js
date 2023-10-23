import { parse, stringify } from 'flatted';

export function processConsoleLog(args, setFlag) {
  const msg = stringify(args);
  if (msg.includes('utils library data')) {
    const dataMatch = parse(msg.match(/{[^}]*}/));
    setFlag(dataMatch.result);
    return dataMatch.result;
  }
  return null;
}

export function logToConsoleWithProcessing(
  debouncedTextRef,
  prev,
  selectedLang,
  text,
  flag,
  suggestionRef,
  setflag
) {
  const originalConsoleLog = console.log;
  debugger;
  console.log = (...args) => {
    const newSuggestions = processConsoleLog(args, setflag, suggestionRef, prev);
    if (newSuggestions !== null) {
        suggestionRef.current  = prev==true?flag:newSuggestions
    }
    originalConsoleLog(...args);
  };

  return () => {
    console.log = originalConsoleLog;
  };
}