/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { siteConfig } from '../config/siteConfig';
import {
  DEFAULT_BACKGROUND_THEME,
  BACKGROUND_THEMES,
} from '../config/backgroundThemes';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  readCookie,
  writeCookie,
} from '../utils/storage';

const PRIMARY_COLOR_KEY = 'site-primary-color';
const BG_THEME_KEY = 'site-background-theme';
const COOKIE_MAX_AGE_DAYS = 365;
const VALID_PRIMARY_COLORS = ['blue', 'green', 'cyan', 'grape', 'yellow', 'red'];

const ThemeContext = createContext(null);

function getPersistedPrimaryColor() {
  const ls = safeLocalStorageGet(PRIMARY_COLOR_KEY);
  if (ls && VALID_PRIMARY_COLORS.includes(ls)) return ls;
  const ck = readCookie(PRIMARY_COLOR_KEY);
  if (ck && VALID_PRIMARY_COLORS.includes(ck)) return ck;
  return siteConfig.primaryColor;
}

function persistPrimaryColor(value) {
  safeLocalStorageSet(PRIMARY_COLOR_KEY, value);
  writeCookie(PRIMARY_COLOR_KEY, value, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
}

function getPersistedBackgroundTheme() {
  const ls = safeLocalStorageGet(BG_THEME_KEY);
  if (ls && BACKGROUND_THEMES.some((t) => t.id === ls)) return ls;
  const ck = readCookie(BG_THEME_KEY);
  if (ck && BACKGROUND_THEMES.some((t) => t.id === ck)) return ck;
  return DEFAULT_BACKGROUND_THEME;
}

function persistBackgroundTheme(value) {
  safeLocalStorageSet(BG_THEME_KEY, value);
  writeCookie(BG_THEME_KEY, value, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
}

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColorState] = useState(getPersistedPrimaryColor);
  const [backgroundTheme, setBackgroundThemeState] = useState(getPersistedBackgroundTheme);

  const setPrimaryColor = useCallback((color) => {
    setPrimaryColorState(color);
    persistPrimaryColor(color);
  }, []);

  const setBackgroundTheme = useCallback((themeId) => {
    setBackgroundThemeState(themeId);
    persistBackgroundTheme(themeId);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        backgroundTheme,
        setBackgroundTheme,
      }}
    >
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
