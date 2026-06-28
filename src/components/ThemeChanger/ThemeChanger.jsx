import { useState, useRef, useEffect, useCallback } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconPalette, IconSun, IconMoon, IconCheck } from '@tabler/icons-react';
import { useThemeContext } from '../../context/ThemeContext';
import { siteConfig } from '../../config/siteConfig';
import './ThemeChanger.css';

const COLOR_OPTIONS = [
  { key: 'blue', color: '#228be6' },
  { key: 'violet', color: '#7950f2' },
  { key: 'indigo', color: '#4c6ef5' },
  { key: 'pink', color: '#e64980' },
  { key: 'grape', color: '#be4bdb' },
  { key: 'red', color: '#fa5252' },
];

function ThemeChanger() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { primaryColor, setPrimaryColor } = useThemeContext();

  const close = useCallback(() => setOpen(false), []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        close();
      }
    },
    [open, close],
  );

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && open) close();
    },
    [open, close],
  );

  const handleScroll = useCallback(() => {
    if (open) close();
  }, [open, close]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleClickOutside, handleEscape, handleScroll]);

  const isLight = colorScheme === 'light';
  const enableLightMode = siteConfig.features?.enableLightMode !== false;

  useEffect(() => {
    if (!enableLightMode && isLight) {
      setColorScheme('dark');
    }
  }, [enableLightMode, isLight, setColorScheme]);

  return (
    <>
      <button
        ref={buttonRef}
        className={`theme-changer-button ${open ? 'is-open' : ''}`}
        type="button"
        onClick={handleToggle}
        aria-label={open ? t('themeChanger.hideThemes') : t('themeChanger.changeTheme')}
        aria-expanded={open}
      >
        <IconPalette size={18} stroke={1.5} />
        <span className="theme-changer-button-text">{t('themeChanger.changeTheme')}</span>
      </button>

      <div
        ref={panelRef}
        className={`theme-changer-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-label={t('themeChanger.changeTheme')}
      >
        <div className="theme-changer-section">
          <span className="theme-changer-section-label">{t('themeChanger.appearance')}</span>
          <div className="theme-changer-scheme-toggle">
            {enableLightMode && (
              <button
                type="button"
                className={`theme-changer-scheme-btn ${isLight ? 'is-active' : ''}`}
                onClick={() => setColorScheme('light')}
                aria-label={t('theme.toLight')}
              >
                <IconSun size={16} stroke={1.5} />
                {t('themeChanger.light')}
              </button>
            )}
            <button
              type="button"
              className={`theme-changer-scheme-btn ${!isLight ? 'is-active' : ''}`}
              onClick={() => setColorScheme('dark')}
              aria-label={t('theme.toDark')}
            >
              <IconMoon size={16} stroke={1.5} />
              {t('themeChanger.dark')}
            </button>
          </div>
        </div>

        <div className="theme-changer-section">
          <span className="theme-changer-section-label">{t('themeChanger.accentColor')}</span>
          <div className="theme-changer-colors">
            {COLOR_OPTIONS.map(({ key, color }) => {
              const isSelected = primaryColor === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`theme-changer-color-btn ${isSelected ? 'is-selected' : ''}`}
                  style={{ '--color-swatch': color }}
                  onClick={() => setPrimaryColor(key)}
                  aria-label={t(`themeChanger.${key}`)}
                  aria-pressed={isSelected}
                >
                  {isSelected && <IconCheck size={16} stroke={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ThemeChanger;
