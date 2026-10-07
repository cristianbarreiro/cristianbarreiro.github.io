/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import {
  DEFAULT_BACKGROUND_THEME,
  BACKGROUND_THEMES,
} from '../config/backgroundThemes';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  readCookie,
  writeCookie,
  removeCookie,
} from '../utils/storage';
import { normalizeHex, applyGlobalColorTokens } from '../utils/colors';

const PRIMARY_COLOR_KEY = 'site-primary-color';
const BG_THEME_KEY = 'site-background-theme';
const NEBULA_KEY = 'site-show-nebula';
const BLEND_MINIMAL_KEY = 'site-blend-minimal-bg';
const COOKIE_MAX_AGE_DAYS = 365;

const DEFAULT_PRIMARY_COLOR = siteConfig.defaultAccentColor || siteConfig.primaryColor || '#0088ff';

const LEGACY_COLOR_MAP = {
  blue: '#0088ff',
  green: '#20c997',
  cyan: '#22b8cf',
  grape: '#be4bdb',
  yellow: '#fab005',
  red: '#fa5252',
};

function resolveValidHex(color) {
  if (!color || typeof color !== 'string') return null;
  const legacy = LEGACY_COLOR_MAP[color.toLowerCase()];
  if (legacy) return legacy;
  return normalizeHex(color);
}

const ThemeContext = createContext(null);

function getPersistedPrimaryColor() {
  const ls = safeLocalStorageGet(PRIMARY_COLOR_KEY);
  const fromLs = resolveValidHex(ls);
  if (fromLs) return fromLs;

  const ck = readCookie(PRIMARY_COLOR_KEY);
  const fromCk = resolveValidHex(ck);
  if (fromCk) return fromCk;

  return resolveValidHex(DEFAULT_PRIMARY_COLOR) || '#0088ff';
}

function persistPrimaryColor(value) {
  safeLocalStorageSet(PRIMARY_COLOR_KEY, value);
  writeCookie(PRIMARY_COLOR_KEY, value, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
}

function getPersistedBackgroundTheme() {
  const ls = safeLocalStorageGet(BG_THEME_KEY);
  if (ls && ls !== 'space' && BACKGROUND_THEMES.some((t) => t.id === ls)) return ls;
  const ck = readCookie(BG_THEME_KEY);
  if (ck && ck !== 'space' && BACKGROUND_THEMES.some((t) => t.id === ck)) return ck;

  // Si venía de 'space' o valor inexistente, persistir fallback seguro
  if (ls === 'space' || ck === 'space') {
    safeLocalStorageSet(BG_THEME_KEY, DEFAULT_BACKGROUND_THEME);
    writeCookie(BG_THEME_KEY, DEFAULT_BACKGROUND_THEME, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
  }

  // Limpieza de claves obsoletas asociadas a efectos anteriores
  safeLocalStorageRemove(NEBULA_KEY);
  safeLocalStorageRemove(BLEND_MINIMAL_KEY);
  removeCookie(NEBULA_KEY);
  removeCookie(BLEND_MINIMAL_KEY);

  return DEFAULT_BACKGROUND_THEME;
}

function persistBackgroundTheme(value) {
  safeLocalStorageSet(BG_THEME_KEY, value);
  writeCookie(BG_THEME_KEY, value, { maxAgeDays: COOKIE_MAX_AGE_DAYS });
}

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColorState] = useState(getPersistedPrimaryColor);
  const [backgroundTheme, setBackgroundThemeState] = useState(getPersistedBackgroundTheme);

  // Sincronizar variables CSS globales en :root cada vez que cambia el color de acento
  useEffect(() => {
    applyGlobalColorTokens(primaryColor);
  }, [primaryColor]);

  const setPrimaryColor = useCallback((color) => {
    const validHex = resolveValidHex(color);
    if (!validHex) return false;
    setPrimaryColorState(validHex);
    persistPrimaryColor(validHex);
    applyGlobalColorTokens(validHex);
    return true;
  }, []);

  const resetPrimaryColor = useCallback(() => {
    const defaultHex = resolveValidHex(DEFAULT_PRIMARY_COLOR) || '#0088ff';
    setPrimaryColorState(defaultHex);
    persistPrimaryColor(defaultHex);
    applyGlobalColorTokens(defaultHex);
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
        resetPrimaryColor,
        defaultPrimaryColor: resolveValidHex(DEFAULT_PRIMARY_COLOR) || '#0088ff',
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
