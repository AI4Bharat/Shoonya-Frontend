export const AUDIO_URL_MAPPINGS = [
  {
    sourcePrefix: "https://asr-transcription.objectstore.e2enetworks.net/",
    audioUrlParam: "asr-transcription/",
  },
  {
    sourcePrefix: "https://indic-asr-public.objectstore.e2enetworks.net/",
    audioUrlParam: "speechteam/",
  },
  {
    sourcePrefix: "https://www.sosnm1.shakticloud.ai:9024/iitmnewbkt/",
    audioUrlParam: "iitmnewbkt/",
  },
];

export const PUBLIC_AUDIO_URL_PATTERNS = [
  { pattern: "sarvam-benchmark.objectstore.e2enetworks.net", matcher: "includes" },
  { pattern: "https://objectstore.e2enetworks.net", matcher: "startsWith" },
];

export const isPublicAudioUrl = (audioUrl) =>
  PUBLIC_AUDIO_URL_PATTERNS.some(({ pattern, matcher }) =>
    matcher === "startsWith" ? audioUrl.startsWith(pattern) : audioUrl.includes(pattern)
  );
