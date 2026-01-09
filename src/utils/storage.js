let localStorageAvailable;

export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isLocalStorageAvailable() {
  if (!isBrowser()) return false;
  if (localStorageAvailable !== undefined) return localStorageAvailable;

  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    localStorageAvailable = true;
  } catch {
    localStorageAvailable = false;
  }

  return localStorageAvailable;
}

export function safeLocalStorageGet(key) {
  if (!isLocalStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalStorageSet(key, value) {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function safeLocalStorageRemove(key) {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function readCookie(name) {
  if (!isBrowser()) return null;

  const prefix = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split(';') : [];

  for (const raw of cookies) {
    const part = raw.trim();
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }

  return null;
}

export function writeCookie(
  name,
  value,
  { maxAgeDays = 365, path = '/', sameSite = 'Lax' } = {}
) {
  if (!isBrowser()) return;

  const secure = window.location?.protocol === 'https:' ? '; Secure' : '';
  const maxAge = Math.max(0, Math.floor(maxAgeDays * 24 * 60 * 60));

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; Max-Age=${maxAge}; Path=${path}; SameSite=${sameSite}${secure}`;
}

export function removeCookie(name, { path = '/' } = {}) {
  if (!isBrowser()) return;
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}`;
}
