import { AUDIO_URL_MAPPINGS, isPublicAudioUrl } from './audioUrlMappings';
import configs from '../config/config';

/**
 * Given an audio URL from task data, checks if it matches a known private
 * bucket mapping. If so, fetches the audio through the Shoonya backend proxy
 * (`/task/get_audio_file/`) with JWT auth, converts the base64 response to a
 * Blob URL, and returns it. Otherwise returns the original URL unchanged.
 *
 * This replicates the same logic used in Chitralekha-UI components so that
 * Label Studio can also play audio from private buckets without CORS issues.
 *
 * @param {string} audioUrl - The raw audio_url from taskData.data
 * @returns {Promise<string>} - A blob: URL if proxied, or the original URL
 */
const fetchAudioBlobUrl = async (audioUrl) => {
  if (!audioUrl) return audioUrl;

  const url = String(audioUrl);

  // Check if this URL matches one of the known private bucket mappings
  const mapping = AUDIO_URL_MAPPINGS.find((m) => url.includes(m.sourcePrefix));

  if (!mapping) {
    // No mapping found — return the URL as-is (public or unknown source)
    return url;
  }

  // Build the proxy URL by replacing the bucket prefix with the backend proxy endpoint
  const proxyUrl = url.replace(
    mapping.sourcePrefix,
    `${configs.BASE_URL_AUTO}/task/get_audio_file/?audio_url=${mapping.audioUrlParam}`
  );

  // Determine headers: public URLs don't need auth, private ones do
  const headers = isPublicAudioUrl(url)
    ? {}
    : {
        Authorization: `JWT ${localStorage.getItem('shoonya_access_token')}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      };

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      // Proxy fetch failed — fall back to the original URL
      console.warn(
        `[fetchAudioBlobUrl] Proxy fetch failed (status ${response.status}), falling back to original URL`
      );
      return url;
    }

    // The backend returns base64-encoded audio data as a JSON string
    const base64data = await response.json();
    const binaryData = atob(base64data);
    const buffer = new ArrayBuffer(binaryData.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binaryData.length; i++) {
      view[i] = binaryData.charCodeAt(i);
    }
    const mimeType = url.toLowerCase().endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';
    const blob = new Blob([view], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('[fetchAudioBlobUrl] Error fetching audio via proxy:', err);
    return url;
  }
};

export default fetchAudioBlobUrl;
