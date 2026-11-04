/**
 * Feature Flags del portfolio.
 *
 * Permite controlar funcionalidades según el entorno
 * de ejecución de Vite.
 */

const PROJECT_VISUALS = {
    development: true,
    production: false,
};

/**
 * Controla la visualización de los SVG generados
 * para los proyectos.
 *
 * DEV: npm run dev
 * PROD: npm run build / npm run deploy
 */
export const SHOW_PROJECT_VISUALS = import.meta.env.DEV
    ? PROJECT_VISUALS.development
    : import.meta.env.PROD
        ? PROJECT_VISUALS.production
        : false;
