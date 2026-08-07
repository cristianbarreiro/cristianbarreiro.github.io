import SpaceBackground from '../components/SpaceBackground';

/**
 * Registro configurable de temas de fondo para la aplicación.
 * Permite extender la aplicación con nuevos fondos (WebGL, gradientes, minimalistas, partículas, etc.)
 * manteniendo una arquitectura desacoplada y escalable.
 */
export const BACKGROUND_THEMES = [
  {
    id: 'space',
    nameKey: 'themeChanger.bgSpaceTitle',
    descriptionKey: 'themeChanger.bgSpaceDesc',
    type: 'webgl',
    icon: 'world',
    component: SpaceBackground,
    available: true,
  },
  {
    id: 'gradient',
    nameKey: 'themeChanger.bgGradientTitle',
    descriptionKey: 'themeChanger.bgGradientDesc',
    type: 'gradient',
    icon: 'sparkles',
    component: null,
    available: false,
  },
  {
    id: 'minimal',
    nameKey: 'themeChanger.bgMinimalTitle',
    descriptionKey: 'themeChanger.bgMinimalDesc',
    type: 'minimal',
    icon: 'layout',
    component: null,
    available: false,
  },
  {
    id: 'particles',
    nameKey: 'themeChanger.bgParticlesTitle',
    descriptionKey: 'themeChanger.bgParticlesDesc',
    type: 'particles',
    icon: 'atom',
    component: null,
    available: false,
  },
];

export const DEFAULT_BACKGROUND_THEME = 'space';

/**
 * Obtiene la configuración del tema de fondo por su ID
 * @param {string} themeId
 * @returns {object}
 */
export function getBackgroundThemeConfig(themeId) {
  return (
    BACKGROUND_THEMES.find((t) => t.id === themeId && t.available) ||
    BACKGROUND_THEMES[0]
  );
}
