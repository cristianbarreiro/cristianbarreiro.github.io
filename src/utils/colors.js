/**
 * Utilidades matemáticas y de diseño para manejo de colores en el portfolio.
 * Permite validar, normalizar, derivar tokens CSS e interpolar los 10 tonos que requiere Mantine 8.
 */

const HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Valida si una cadena es un código HEX válido (con o sin '#', de 3 o 6 dígitos).
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  if (typeof hex !== 'string') return false;
  return HEX_REGEX.test(hex.trim());
}

/**
 * Normaliza un código HEX a formato #RRGGBB en mayúsculas.
 * Retorna null si la entrada no es un HEX válido.
 * @param {string} hex
 * @returns {string|null}
 */
export function normalizeHex(hex) {
  if (!isValidHex(hex)) return null;

  let clean = hex.trim().replace(/^#/, '');

  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return `#${clean.toUpperCase()}`;
}

/**
 * Convierte un código HEX (#RRGGBB o #RGB) a un objeto { r, g, b }.
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  const normalized = normalizeHex(hex) || '#0088FF';
  const num = parseInt(normalized.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convierte valores numéricos r, g, b (0..255) a código HEX #RRGGBB.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val) => clamp(val).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convierte valores HSL a código HEX #RRGGBB.
 * @param {number} h - Hue en grados [0..360]
 * @param {number} s - Saturación en porcentaje [0..100]
 * @param {number} l - Luminosidad en porcentaje [0..100]
 * @returns {string}
 */
export function hslToHex(h, s, l) {
  const normH = ((h % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const light = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (normH < 60) {
    r = c; g = x; b = 0;
  } else if (normH < 120) {
    r = x; g = c; b = 0;
  } else if (normH < 180) {
    r = 0; g = c; b = x;
  } else if (normH < 240) {
    r = 0; g = x; b = c;
  } else if (normH < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/**
 * Convierte un código HEX a valores HSL { h, s, l }.
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number }}
 */
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) * 60;
    } else {
      h = ((rNorm - gNorm) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Mapea coordenadas normalizadas (normX, normY en [0..1]) a un color HEX.
 * normX representa el espectro de tono (Hue 0..360°).
 * normY representa luminosidad (desde tonos claros arriba hasta oscuros abajo).
 * @param {number} normX
 * @param {number} normY
 * @returns {string}
 */
export function coordsToHex(normX, normY) {
  const clampX = Math.max(0, Math.min(1, normX));
  const clampY = Math.max(0, Math.min(1, normY));
  const h = clampX * 360;
  const l = 78 - clampY * 60;
  return hslToHex(h, 95, l);
}

/**
 * Mapea un color HEX a coordenadas normalizadas { normX, normY } para posicionar el cursor.
 * @param {string} hex
 * @returns {{ normX: number, normY: number }}
 */
export function hexToCoords(hex) {
  const { h, l } = hexToHsl(hex);
  const normX = Math.max(0, Math.min(1, h / 360));
  const normY = Math.max(0, Math.min(1, (78 - l) / 60));
  return { normX, normY };
}

/**
 * Mezcla dos colores RGB con una proporción weight (0 a 1).
 * @param {{ r: number, g: number, b: number }} c1
 * @param {{ r: number, g: number, b: number }} c2
 * @param {number} weight - Proporción de c2 en la mezcla (0 = 100% c1, 1 = 100% c2)
 * @returns {string} Código HEX resultante
 */
function mixRgb(c1, c2, weight) {
  const w = Math.max(0, Math.min(1, weight));
  const r = c1.r * (1 - w) + c2.r * w;
  const g = c1.g * (1 - w) + c2.g * w;
  const b = c1.b * (1 - w) + c2.b * w;
  return rgbToHex(r, g, b);
}

/**
 * Genera la tupla de 10 tonos requerida por el sistema de colores de Mantine 8.
 * El tono 6 corresponde al color base seleccionado por el usuario.
 * @param {string} hexColor - Color base en formato HEX
 * @returns {[string, string, string, string, string, string, string, string, string, string]}
 */
export function generateMantineShades(hexColor) {
  const base = hexToRgb(hexColor);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const normalizedBase = normalizeHex(hexColor) || '#0088FF';

  return [
    mixRgb(base, white, 0.92), // 0: Ultra claro (tinte de fondo)
    mixRgb(base, white, 0.80), // 1: Muy claro
    mixRgb(base, white, 0.65), // 2: Claro
    mixRgb(base, white, 0.48), // 3: Acento suave
    mixRgb(base, white, 0.30), // 4: Medio-claro
    mixRgb(base, white, 0.14), // 5: Medio (tono previo al base)
    normalizedBase,            // 6: Color base oficial del usuario
    mixRgb(base, black, 0.15), // 7: Ligeramente oscuro (hover)
    mixRgb(base, black, 0.28), // 8: Oscuro (active / focus)
    mixRgb(base, black, 0.45), // 9: Muy oscuro (bordes / acentos profundos)
  ];
}

/**
 * Genera tokens derivados a partir del color base para consumo en CSS variables.
 * @param {string} hexColor
 * @returns {Record<string, string>}
 */
export function generateDerivedTokens(hexColor) {
  const normalized = normalizeHex(hexColor) || '#0088FF';
  const { r, g, b } = hexToRgb(normalized);
  const shades = generateMantineShades(normalized);

  return {
    accentColor: normalized,
    accentColorHover: shades[7],
    accentColorActive: shades[8],
    accentColorLight: shades[3],
    accentColorBorder: `rgba(${r}, ${g}, ${b}, 0.28)`,
    accentColorBorderHover: `rgba(${r}, ${g}, ${b}, 0.55)`,
    accentColorGlow: `rgba(${r}, ${g}, ${b}, 0.45)`,
    accentColorGlowSubtle: `rgba(${r}, ${g}, ${b}, 0.18)`,
    accentColorBackground: `rgba(${r}, ${g}, ${b}, 0.12)`,
    accentColorBackgroundHover: `rgba(${r}, ${g}, ${b}, 0.22)`,
  };
}

/**
 * Inyecta o actualiza las variables CSS de acento directamente en :root (document.documentElement).
 * @param {string} hexColor
 */
export function applyGlobalColorTokens(hexColor) {
  if (typeof document === 'undefined') return;

  const tokens = generateDerivedTokens(hexColor);
  const root = document.documentElement;

  root.style.setProperty('--accent-color', tokens.accentColor);
  root.style.setProperty('--accent-color-hover', tokens.accentColorHover);
  root.style.setProperty('--accent-color-active', tokens.accentColorActive);
  root.style.setProperty('--accent-color-light', tokens.accentColorLight);
  root.style.setProperty('--accent-color-border', tokens.accentColorBorder);
  root.style.setProperty('--accent-color-border-hover', tokens.accentColorBorderHover);
  root.style.setProperty('--accent-color-glow', tokens.accentColorGlow);
  root.style.setProperty('--accent-color-glow-subtle', tokens.accentColorGlowSubtle);
  root.style.setProperty('--accent-color-background', tokens.accentColorBackground);
  root.style.setProperty('--accent-color-background-hover', tokens.accentColorBackgroundHover);
  root.style.setProperty('--glow-color', tokens.accentColorGlow);
}
