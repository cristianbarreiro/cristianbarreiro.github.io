import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mantine/core';
import {
  IconPalette,
  IconCheck,
  IconWorld,
  IconSparkles,
  IconLayout,
  IconAtom,
} from '@tabler/icons-react';
import { useThemeContext } from '../../context/ThemeContext';
import { BACKGROUND_THEMES } from '../../config/backgroundThemes';
import './ThemeChanger.css';

const COLOR_OPTIONS = [
  { key: 'blue', color: '#0088ff' },
  { key: 'green', color: '#20c997' },
  { key: 'cyan', color: '#22b8cf' },
  { key: 'grape', color: '#be4bdb' },
  { key: 'yellow', color: '#fab005' },
  { key: 'red', color: '#fa5252' },
];

const ICON_MAP = {
  world: IconWorld,
  sparkles: IconSparkles,
  layout: IconLayout,
  atom: IconAtom,
};

function ThemeChanger() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useTranslation();
  const {
    primaryColor,
    setPrimaryColor,
    backgroundTheme,
    setBackgroundTheme,
    showNebula,
    setShowNebula,
    showColorAmbience,
    setShowColorAmbience,
    blendMinimalBackground,
    setBlendMinimalBackground,
  } = useThemeContext();

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

  return (
    <>
      <Tooltip
        label={open ? t('themeChanger.hideThemes') : t('themeChanger.changeTheme')}
        position="left"
        withArrow
        openDelay={300}
      >
        <button
          ref={buttonRef}
          className={`theme-changer-button ${open ? 'is-open' : ''}`}
          type="button"
          onClick={handleToggle}
          aria-label={open ? t('themeChanger.hideThemes') : t('themeChanger.changeTheme')}
          aria-expanded={open}
        >
          <IconPalette size={20} stroke={1.5} />
        </button>
      </Tooltip>

      <div
        ref={panelRef}
        className={`theme-changer-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-label={t('themeChanger.changeTheme')}
      >
        {/* Sección 1: Color de Acento */}
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

        {/* Sección 2: Tema de Fondo */}
        <div className="theme-changer-section" style={{ marginTop: 16 }}>
          <span className="theme-changer-section-label">
            {t('themeChanger.backgroundTheme')}
          </span>
          <div className="theme-changer-bg-list">
            {BACKGROUND_THEMES.map((themeItem) => {
              const isSelected = backgroundTheme === themeItem.id;
              const isAvailable = themeItem.available;
              const IconComp = ICON_MAP[themeItem.icon] || IconWorld;

              return (
                <div key={themeItem.id} className="theme-changer-bg-item">
                  <button
                    type="button"
                    disabled={!isAvailable}
                    className={`theme-changer-bg-card ${isSelected ? 'is-selected' : ''} ${!isAvailable ? 'is-disabled' : ''}`}
                    onClick={() => isAvailable && setBackgroundTheme(themeItem.id)}
                    aria-pressed={isSelected}
                  >
                    <div className="theme-changer-bg-card-header">
                      <div className="theme-changer-bg-icon">
                        <IconComp size={15} />
                      </div>
                      <span className="theme-changer-bg-title">
                        {t(themeItem.nameKey)}
                      </span>
                      {isSelected && (
                        <span className="theme-changer-bg-badge is-active">
                          <IconCheck size={10} /> {t('themeChanger.current')}
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="theme-changer-bg-badge is-coming">
                          {t('themeChanger.comingSoon')}
                        </span>
                      )}
                    </div>
                    <p className="theme-changer-bg-desc">
                      {t(themeItem.descriptionKey)}
                    </p>
                  </button>

                  {isSelected && themeItem.id === 'space' && (
                    <div className="theme-changer-nebula-option">
                      <label className="theme-changer-checkbox-label">
                        <input
                          type="checkbox"
                          checked={showNebula}
                          onChange={(e) => setShowNebula(e.target.checked)}
                          className="theme-changer-checkbox"
                        />
                        <span>{t('themeChanger.showNebula')}</span>
                      </label>
                      <label className="theme-changer-checkbox-label">
                        <input
                          type="checkbox"
                          checked={showColorAmbience}
                          onChange={(e) => setShowColorAmbience(e.target.checked)}
                          className="theme-changer-checkbox"
                        />
                        <span>{t('themeChanger.showColorAmbience')}</span>
                      </label>
                      <label className="theme-changer-checkbox-label">
                        <input
                          type="checkbox"
                          checked={blendMinimalBackground}
                          onChange={(e) => setBlendMinimalBackground(e.target.checked)}
                          className="theme-changer-checkbox"
                        />
                        <span>{t('themeChanger.blendMinimal')}</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ThemeChanger;
