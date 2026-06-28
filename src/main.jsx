/**
 * Entry point de la aplicación
 * Configura React, Mantine y React Router
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';

// Estilos de Mantine (¡importante importar!)
import '@mantine/core/styles.css';

// Inicializa i18next (idiomas) al arrancar la app
import i18n from './i18n';

// Estilos globales personalizados
import './styles/global.css';

// Componente principal
import App from './App';

// Tema dinámico
import { ThemeProvider } from './context/ThemeContext';
import ThemeRoot from './components/ThemeRoot';

/**
 * Render de la aplicación
 * 
 * Estructura:
 * - StrictMode: detecta problemas potenciales
 * - BrowserRouter: habilita el enrutamiento
 * - ThemeProvider: provee el color primario seleccionado
 * - ThemeRoot: MantineProvider con tema dinámico
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemeRoot>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </I18nextProvider>
      </ThemeRoot>
    </ThemeProvider>
  </React.StrictMode>
);
