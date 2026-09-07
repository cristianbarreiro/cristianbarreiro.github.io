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
  IconReload,
  IconColorPicker,
} from '@tabler/icons-react';
import { useThemeContext } from '../../context/ThemeContext';
import { BACKGROUND_THEMES } from '../../config/backgroundThemes';
import { isValidHex, normalizeHex, coordsToHex, hexToCoords } from '../../utils/colors';
import './ThemeChanger.css';

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
  const colorInputRef = useRef(null);
  const paletteRef = useRef(null);
  const cursorRef = useRef(null);
  const swatchRef = useRef(null);
  const previewTagRef = useRef(null);
  const previewDotRef = useRef(null);
  const hexInputRef = useRef(null);

  // Referencias operacionales de alto rendimiento (sin provocar re-renders en React)
  const rectRef = useRef(null);
  const rafIdRef = useRef(null);
  const isDraggingRef = useRef(false);
  const latestPointerRef = useRef({ clientX: 0, clientY: 0 });

  const { t } = useTranslation();
  const {
    primaryColor,
    setPrimaryColor,
    resetPrimaryColor,
    defaultPrimaryColor,
    backgroundTheme,
    setBackgroundTheme,
    showNebula,
    setShowNebula,
    blendMinimalBackground,
    setBlendMinimalBackground,
  } = useThemeContext();

  const currentHexRef = useRef(primaryColor);
  const [previewColor, setPreviewColor] = useState(primaryColor);
  const [hexInput, setHexInput] = useState(primaryColor);
  const [prevPrimaryColor, setPrevPrimaryColor] = useState(primaryColor);
  const [hexError, setHexError] = useState(false);

  // Sincronizar estados locales cuando el color aplicado externamente cambia (ej. carga inicial o reset)
  if (prevPrimaryColor !== primaryColor) {
    setPrevPrimaryColor(primaryColor);
    setPreviewColor(primaryColor);
    setHexInput(primaryColor);
    setHexError(false);
  }

  useEffect(() => {
    currentHexRef.current = primaryColor;
  }, [primaryColor]);

  // Aplica el color globalmente una sola vez cuando el usuario termina
  const commitColor = useCallback((colorToCommit) => {
    const norm = normalizeHex(colorToCommit);
    if (norm) {
      setPreviewColor(norm);
      setHexInput(norm);
      setHexError(false);
      currentHexRef.current = norm;

      // Actualizar nodos DOM directamente
      if (swatchRef.current) {
        swatchRef.current.style.setProperty('--swatch-color', norm);
      }
      if (hexInputRef.current) {
        hexInputRef.current.value = norm;
      }
      if (colorInputRef.current) {
        colorInputRef.current.value = norm;
      }
      if (previewDotRef.current) {
        previewDotRef.current.style.backgroundColor = norm;
      }

      if (norm !== primaryColor) {
        setPrimaryColor(norm);
      }
    }
  }, [primaryColor, setPrimaryColor]);

  // Sincroniza la posición física del cursor según el color HEX dado
  const syncCursorPosition = useCallback((hex) => {
    const palette = paletteRef.current;
    const cursor = cursorRef.current;
    if (!palette || !cursor || !hex) return;

    const rect = palette.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const { normX, normY } = hexToCoords(hex);
    const x = Math.max(0, Math.min(rect.width, normX * rect.width));
    const y = Math.max(0, Math.min(rect.height, normY * rect.height));

    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  // Actualización visual por frame agrupada en requestAnimationFrame
  const updateCursorAndPreview = useCallback(() => {
    rafIdRef.current = null;
    const rect = rectRef.current;
    const pointer = latestPointerRef.current;
    if (!rect || !pointer) return;

    // Calcular posición local acotada al rectángulo geométrico cacheado (0 layout thrashing)
    const x = Math.max(0, Math.min(rect.width, pointer.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, pointer.clientY - rect.top));

    // 1. Mover el cursor con transform GPU
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    // 2. Mapeo ultra-rápido de coordenadas a HEX
    const normX = rect.width > 0 ? x / rect.width : 0;
    const normY = rect.height > 0 ? y / rect.height : 0;
    const hex = coordsToHex(normX, normY);
    currentHexRef.current = hex;

    // 3. Actualizar elementos de preview directamente en el DOM (sin setState en React)
    if (swatchRef.current) {
      swatchRef.current.style.setProperty('--swatch-color', hex);
    }
    if (previewDotRef.current) {
      previewDotRef.current.style.backgroundColor = hex;
    }
    if (previewTagRef.current) {
      previewTagRef.current.style.display = 'inline-flex';
    }
    if (hexInputRef.current) {
      hexInputRef.current.value = hex;
    }
    if (colorInputRef.current) {
      colorInputRef.current.value = hex;
    }
  }, []);

  // Eventos de puntero para la paleta 2D
  const handlePalettePointerDown = useCallback((e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = paletteRef.current;
    if (!el) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignorar si el puntero no permite captura
    }

    // Cachear dimensiones una única vez al iniciar la interacción
    rectRef.current = el.getBoundingClientRect();
    isDraggingRef.current = true;
    latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(updateCursorAndPreview);
    }
  }, [updateCursorAndPreview]);

  const handlePalettePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || !rectRef.current) return;

    latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

    // Agrupación estricta por RAF: máximo 1 actualización visual por frame
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(updateCursorAndPreview);
  }, [updateCursorAndPreview]);

  const handlePalettePointerUp = useCallback((e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Puntero ya liberado
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Aplicar el color globalmente recién al soltar
    const finalHex = currentHexRef.current;
    if (finalHex) {
      commitColor(finalHex);
    }
  }, [commitColor]);

  const handlePalettePointerCancel = useCallback((e) => {
    handlePalettePointerUp(e);
  }, [handlePalettePointerUp]);

  // Accesibilidad por teclado en la paleta (flechas para micro-ajustes)
  const handlePaletteKeyDown = useCallback((e) => {
    if (!paletteRef.current) return;
    const rect = paletteRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    let { normX, normY } = hexToCoords(currentHexRef.current || previewColor);
    const step = e.shiftKey ? 0.05 : 0.02;

    if (e.key === 'ArrowRight') {
      normX = Math.min(1, normX + step);
    } else if (e.key === 'ArrowLeft') {
      normX = Math.max(0, normX - step);
    } else if (e.key === 'ArrowDown') {
      normY = Math.min(1, normY + step);
    } else if (e.key === 'ArrowUp') {
      normY = Math.max(0, normY - step);
    } else {
      return;
    }

    e.preventDefault();
    const newHex = coordsToHex(normX, normY);
    const x = normX * rect.width;
    const y = normY * rect.height;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    commitColor(newHex);
  }, [previewColor, commitColor]);

  // Sincronizar el cursor visual cuando se abre el panel o cambia previewColor externamente
  useEffect(() => {
    if (open && !isDraggingRef.current) {
      const timer = requestAnimationFrame(() => {
        syncCursorPosition(previewColor);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [open, previewColor, syncCursorPosition]);

  // Observador de resize para mantener el cursor en posición exacta si el ancho del diálogo varía
  useEffect(() => {
    const palette = paletteRef.current;
    if (!palette || !open) return;

    const observer = new ResizeObserver(() => {
      if (!isDraggingRef.current) {
        syncCursorPosition(currentHexRef.current || previewColor);
      }
    });

    observer.observe(palette);
    return () => observer.disconnect();
  }, [open, previewColor, syncCursorPosition]);

  // Durante el arrastre del selector nativo:
  // Actualizar directamente la preview en DOM sin forzar re-render de React
  const handleNativePickerInput = useCallback((e) => {
    const norm = normalizeHex(e.target.value);
    if (!norm) return;
    currentHexRef.current = norm;

    if (swatchRef.current) {
      swatchRef.current.style.setProperty('--swatch-color', norm);
    }
    if (previewDotRef.current) {
      previewDotRef.current.style.backgroundColor = norm;
    }
    if (previewTagRef.current) {
      previewTagRef.current.style.display = 'inline-flex';
    }
    if (hexInputRef.current) {
      hexInputRef.current.value = norm;
    }
    syncCursorPosition(norm);
  }, [syncCursorPosition]);

  const handleNativePickerCommit = (e) => {
    const val = e?.target?.value || currentHexRef.current || previewColor;
    const norm = normalizeHex(val);
    if (norm) {
      commitColor(norm);
    }
  };

  useEffect(() => {
    const inputEl = colorInputRef.current;
    if (!inputEl) return;

    const onNativeInput = (e) => {
      handleNativePickerInput(e);
    };

    const onNativeChange = (e) => {
      const norm = normalizeHex(e.target.value);
      if (norm) {
        commitColor(norm);
      }
    };

    inputEl.addEventListener('input', onNativeInput);
    inputEl.addEventListener('change', onNativeChange);

    return () => {
      inputEl.removeEventListener('input', onNativeInput);
      inputEl.removeEventListener('change', onNativeChange);
    };
  }, [commitColor, handleNativePickerInput]);

  // Para input manual HEX: mientras escribe, solo actualiza preview local
  const handleHexChange = (e) => {
    const raw = e.target.value.trim().toUpperCase();
    setHexInput(raw);
    setHexError(false);

    if (isValidHex(raw)) {
      const norm = normalizeHex(raw);
      if (norm) {
        setPreviewColor(norm);
        currentHexRef.current = norm;
        if (swatchRef.current) {
          swatchRef.current.style.setProperty('--swatch-color', norm);
        }
        if (previewDotRef.current) {
          previewDotRef.current.style.backgroundColor = norm;
        }
        if (previewTagRef.current) {
          previewTagRef.current.style.display = 'inline-flex';
        }
        syncCursorPosition(norm);
      }
    }
  };

  const commitHexInput = () => {
    const norm = normalizeHex(hexInput);
    if (norm) {
      setHexInput(norm);
      setPreviewColor(norm);
      setHexError(false);
      commitColor(norm);
    } else {
      setHexError(true);
      setTimeout(() => {
        setHexInput(primaryColor);
        setPreviewColor(primaryColor);
        setHexError(false);
        currentHexRef.current = primaryColor;
        syncCursorPosition(primaryColor);
      }, 1400);
    }
  };

  const handleHexBlur = () => {
    commitHexInput();
  };

  const handleHexKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitHexInput();
      e.currentTarget.blur();
    }
  };

  const handleReset = () => {
    resetPrimaryColor();
    setPreviewColor(defaultPrimaryColor);
    setHexInput(defaultPrimaryColor);
    setHexError(false);
    currentHexRef.current = defaultPrimaryColor;
    if (swatchRef.current) {
      swatchRef.current.style.setProperty('--swatch-color', defaultPrimaryColor);
    }
    if (previewDotRef.current) {
      previewDotRef.current.style.backgroundColor = defaultPrimaryColor;
    }
    if (previewTagRef.current) {
      previewTagRef.current.style.display = 'none';
    }
    if (hexInputRef.current) {
      hexInputRef.current.value = defaultPrimaryColor;
    }
    syncCursorPosition(defaultPrimaryColor);
  };

  const isDefaultColor =
    normalizeHex(primaryColor) === normalizeHex(defaultPrimaryColor);

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
        if (previewColor !== primaryColor && isValidHex(previewColor)) {
          commitColor(previewColor);
        }
        close();
      }
    },
    [open, close, previewColor, primaryColor, commitColor],
  );

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && open) {
        setPreviewColor(primaryColor);
        setHexInput(primaryColor);
        setHexError(false);
        currentHexRef.current = primaryColor;
        close();
      }
    },
    [open, close, primaryColor],
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
        {/* Sección 1: Color de Acento Interactivo a 60 FPS */}
        <div className="theme-changer-section">
          <div className="theme-changer-section-header">
            <span className="theme-changer-section-label">{t('themeChanger.accentColor')}</span>
            <span
              ref={previewTagRef}
              className="theme-changer-preview-tag"
              title={t('themeChanger.previewLabel')}
              style={{ display: previewColor !== primaryColor ? 'inline-flex' : 'none' }}
            >
              <span
                ref={previewDotRef}
                className="theme-changer-preview-tag-dot"
                style={{ backgroundColor: previewColor }}
              />
              {t('themeChanger.previewLabel')}
            </span>
          </div>

          {/* Superficie Interactiva 2D: Espectro de Color a 60 FPS */}
          <div
            ref={paletteRef}
            className="theme-changer-palette-track"
            role="slider"
            tabIndex={0}
            aria-label={t('themeChanger.colorPicker')}
            aria-valuetext={previewColor}
            onPointerDown={handlePalettePointerDown}
            onPointerMove={handlePalettePointerMove}
            onPointerUp={handlePalettePointerUp}
            onPointerCancel={handlePalettePointerCancel}
            onKeyDown={handlePaletteKeyDown}
          >
            <div ref={cursorRef} className="theme-changer-palette-cursor" />
          </div>

          <div className="theme-changer-picker-container">
            {/* Swatch circular + input[type=color] nativo */}
            <div
              className="theme-changer-color-swatch-wrap"
              title={t('themeChanger.openColorPicker')}
            >
              <input
                ref={colorInputRef}
                type="color"
                id="theme-accent-color-native-input"
                className="theme-changer-native-color-input"
                value={normalizeHex(previewColor) || '#0088FF'}
                onInput={handleNativePickerInput}
                onChange={handleNativePickerInput}
                onPointerUp={handleNativePickerCommit}
                onMouseUp={handleNativePickerCommit}
                onTouchEnd={handleNativePickerCommit}
                aria-label={t('themeChanger.colorPicker')}
              />
              <label
                ref={swatchRef}
                htmlFor="theme-accent-color-native-input"
                className="theme-changer-color-swatch"
                style={{ '--swatch-color': previewColor }}
                aria-label={t('themeChanger.previewColor')}
              >
                <span className="theme-changer-swatch-glow" />
                <IconColorPicker size={14} className="theme-changer-swatch-icon" />
              </label>
            </div>

            {/* Input manual HEX + botón de elegir color */}
            <div className={`theme-changer-hex-wrap ${hexError ? 'is-error' : ''}`}>
              <input
                ref={hexInputRef}
                type="text"
                className="theme-changer-hex-input"
                value={hexInput}
                onChange={handleHexChange}
                onBlur={handleHexBlur}
                onKeyDown={handleHexKeyDown}
                placeholder="#0088FF"
                maxLength={7}
                spellCheck={false}
                autoComplete="off"
                aria-label={t('themeChanger.hexAria')}
                aria-invalid={hexError}
              />
              <button
                type="button"
                className="theme-changer-open-picker-btn"
                onClick={() => colorInputRef.current?.click()}
                title={t('themeChanger.chooseColor')}
                aria-label={t('themeChanger.chooseColor')}
              >
                {t('themeChanger.chooseColor')}
              </button>
            </div>
          </div>

          {hexError && (
            <span className="theme-changer-hex-feedback" role="alert">
              {t('themeChanger.invalidHex')}
            </span>
          )}

          {/* Botón Restablecer por defecto */}
          <button
            type="button"
            className="theme-changer-reset-btn"
            onClick={handleReset}
            disabled={isDefaultColor && previewColor === defaultPrimaryColor}
            title={t('themeChanger.resetDefault')}
            aria-label={t('themeChanger.resetDefault')}
          >
            <IconReload size={13} stroke={2} />
            <span>{t('themeChanger.resetDefault')}</span>
          </button>
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
