// Cross-platform resilient storage helper
// Designed specifically to overcome iOS Safari & iPadOS Private Browsing / WebKit localStorage restrictions
// Persists seamlessly across localStorage, document.cookie (365 days), and in-memory cache

const inMemoryStorage = {};

/**
 * Detect if current device is iPad, iPhone, or WebKit/Safari
 */
export const isIpadOrSafari = () => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isIOS = /iPhone|iPod/.test(ua) || isIPad;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS || isSafari;
};

/**
 * Sanitize an API key from clipboard / input:
 * - Trims leading & trailing whitespace
 * - Removes newlines (\r, \n) and tabs (\t)
 * - Removes invisible zero-width unicode characters (\u200B-\u200D, \uFEFF)
 * - Strips wrapping quotes if user copied with quotes
 */
export const sanitizeApiKey = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .trim()
    .replace(/[\r\n\t]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/^["'`]|["'`]$/g, '')
    .trim();
};

/**
 * Write to cookie with safe URL encoding
 */
export const setCookie = (name, value, days = 365) => {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('[GENTRA Storage] Cookie write failed:', e);
  }
};

/**
 * Read from cookie with safe URL decoding
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Safely retrieve a stored value:
 * 1. Checks localStorage
 * 2. Falls back to Cookie (vital for iOS / iPadOS Safari private mode)
 * 3. Falls back to in-memory session cache
 */
export const safeGetItem = (key) => {
  // 1. Try localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined && val !== '') {
        return val;
      }
    }
  } catch (e) {
    // localStorage can throw QuotaExceededError or SecurityError on iOS Safari
  }

  // 2. Fallback to Cookie
  try {
    const cookieVal = getCookie(key);
    if (cookieVal !== null && cookieVal !== undefined && cookieVal !== '') {
      return cookieVal;
    }
  } catch (e) {}

  // 3. Fallback to In-Memory
  return inMemoryStorage[key] || null;
};

/**
 * Safely save a stored value:
 * Writes to in-memory cache, attempts localStorage, and always writes to Cookie for permanent iOS persistence
 */
export const safeSetItem = (key, value) => {
  const strVal = typeof value === 'string' ? value : JSON.stringify(value);

  // 1. In-memory
  inMemoryStorage[key] = strVal;

  // 2. localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, strVal);
    }
  } catch (e) {
    console.warn(`[GENTRA Storage] localStorage blocked/restricted on this browser, relying on permanent cookie:`, e);
  }

  // 3. Cookie (Ensures persistence on iOS Safari across tabs and restarts)
  setCookie(key, strVal, 365);
};

/**
 * Safely remove a stored key
 */
export const safeRemoveItem = (key) => {
  delete inMemoryStorage[key];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (e) {}
  if (typeof document !== 'undefined') {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  }
};
