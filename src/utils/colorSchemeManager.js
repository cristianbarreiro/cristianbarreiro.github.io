import {
  readCookie,
  removeCookie,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
  writeCookie,
  isBrowser,
} from './storage';

const DEFAULT_KEY = 'mantine-color-scheme-value';
const VALID = new Set(['light', 'dark', 'auto']);

export function dualStorageColorSchemeManager({
  key = DEFAULT_KEY,
  cookieKey = key,
  cookieMaxAgeDays = 365,
} = {}) {
  let onStorage;

  const readValue = () => {
    const ls = safeLocalStorageGet(key);
    if (ls && VALID.has(ls)) return ls;

    const ck = readCookie(cookieKey);
    if (ck && VALID.has(ck)) return ck;

    return null;
  };

  return {
    get(defaultValue) {
      const value = readValue();
      return value ?? defaultValue;
    },

    set(value) {
      if (!VALID.has(value)) return;
      safeLocalStorageSet(key, value);
      writeCookie(cookieKey, value, { maxAgeDays: cookieMaxAgeDays });
    },

    subscribe(onUpdate) {
      if (!isBrowser()) return;

      onStorage = (event) => {
        if (!event) return;
        if (event.storageArea !== window.localStorage) return;
        if (event.key !== key) return;

        const next = readValue();
        if (next) onUpdate(next);
      };

      window.addEventListener('storage', onStorage);
    },

    unsubscribe() {
      if (!isBrowser()) return;
      if (!onStorage) return;
      window.removeEventListener('storage', onStorage);
      onStorage = undefined;
    },

    clear() {
      safeLocalStorageRemove(key);
      removeCookie(cookieKey);
    },
  };
}
