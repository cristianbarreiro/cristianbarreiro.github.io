import MinimalBackground from '../components/MinimalBackground';
import GradientBackground from '../components/GradientBackground';
import ParticleBackground from '../components/ParticleBackground';

/**
 * Registro configurable de temas de fondo para la aplicación.
 * Permite extender la aplicación con nuevos fondos (gradientes, minimalistas, partículas, etc.)
 * manteniendo una arquitectura desacoplada y escalable.
 */
export const BACKGROUND_THEMES = [
  {
    id: 'gradient',
    nameKey: 'themeChanger.bgGradientTitle',
    descriptionKey: 'themeChanger.bgGradientDesc',
    type: 'gradient',
    icon: 'sparkles',
    component: GradientBackground,
    available: true,
  },
  {
    id: 'minimal',
    nameKey: 'themeChanger.bgMinimalTitle',
    descriptionKey: 'themeChanger.bgMinimalDesc',
    type: 'minimal',
    icon: 'layout',
    component: MinimalBackground,
    available: true,
  },
  {
    id: 'particles',
    nameKey: 'themeChanger.bgParticlesTitle',
    descriptionKey: 'themeChanger.bgParticlesDesc',
    type: 'particles',
    icon: 'atom',
    component: ParticleBackground,
    available: true,
  },
];

export const DEFAULT_BACKGROUND_THEME = 'minimal';

/**
 * Obtiene la configuración del tema de fondo por su ID
 * @param {string} themeId
 * @returns {object}
 */
export function getBackgroundThemeConfig(themeId) {
  return (
    BACKGROUND_THEMES.find((t) => t.id === themeId && t.available) ||
    BACKGROUND_THEMES.find((t) => t.id === DEFAULT_BACKGROUND_THEME) ||
    BACKGROUND_THEMES[0]
  );
}
