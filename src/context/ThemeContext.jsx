/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { siteConfig } from '../config/siteConfig';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  readCookie,
  writeCookie,
} from '../utils/storage';

const STORAGE_KEY = 'site-primary-color';
const COOKIE_KEY = 'site-primary-color';
const COOKIE_MAX_AGE_DAYS = 365;

const ThemeContext = createContext(null);

function getPersistedPrimaryColor() {
  const ls = safeLocalStorageGet(STORAGE_KEY);
  if (ls) return ls;
  const ck = readCookie(COOKIE_KEY);
  if (ck) return ck;
  return siteConfig.primaryColor;
}

function persistPrimaryColor(value) {
  safeLocalStorageSet(STORAGE_KEY, value);
  writeCookie(COOKIE_KEY, value, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
}

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColorState] = useState(getPersistedPrimaryColor);

  const setPrimaryColor = useCallback((color) => {
    setPrimaryColorState(color);
    persistPrimaryColor(color);
  }, []);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
}
