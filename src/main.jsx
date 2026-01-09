/**
 * Entry point de la aplicación
 * Configura React, Mantine y React Router
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';

import { I18nextProvider } from 'react-i18next';

// Estilos de Mantine (¡importante importar!)
import '@mantine/core/styles.css';

// Inicializa i18next (idiomas) al arrancar la app
import i18n from './i18n';

// Estilos globales personalizados
import './styles/global.css';

// Componente principal
import App from './App';

// Configuración del sitio (para el color primario)
import { siteConfig } from './config/siteConfig';
import { dualStorageColorSchemeManager } from './utils/colorSchemeManager';

/**
 * Tema personalizado de Mantine
 * 
 * Aquí puedes personalizar:
 * - primaryColor: color principal (blue, cyan, grape, green, etc.)
 * - fontFamily: fuente principal
 * - headings: estilos de títulos
 * - components: estilos por defecto de componentes
 * 
 * Documentación: https://mantine.dev/theming/theme-object/
 */

const theme = createTheme({
  // Color primario (configurable desde siteConfig.js)
  primaryColor: siteConfig.primaryColor,

  // Fuente principal
  fontFamily:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  // Configuración de títulos
  headings: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
  },

  // Radio de bordes por defecto
  defaultRadius: 'md',

  // Espaciados personalizados
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  // Personalización de componentes específicos
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

/**
 * Render de la aplicación
 * 
 * Estructura:
 * - StrictMode: detecta problemas potenciales
 * - BrowserRouter: habilita el enrutamiento
 * - MantineProvider: provee el tema y estilos de Mantine
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <MantineProvider
          theme={theme}
          defaultColorScheme="auto"
          colorSchemeManager={dualStorageColorSchemeManager()}
        >
          <App />
        </MantineProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
