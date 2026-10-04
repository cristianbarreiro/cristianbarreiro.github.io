/**
 * Componente App
 * Define las rutas de la aplicación
 */

import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Componente de layout
import Layout from './components/Layout';
import ThemeChanger from './components/ThemeChanger';
import SplashScreen from './components/SplashScreen';
import Contact from './pages/Contact';

import UnderConstructionModal from './components/UnderConstructionModal';

// Páginas
import Home from './pages/Home';
import { useTranslation } from 'react-i18next';

const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Skills = lazy(() => import('./pages/Skills'));

function RouteContent({ children }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

/**
 * Configuración de rutas
 * 
 * El Layout envuelve todas las páginas, proporcionando:
 * - Navbar (barra de navegación)
 * - Footer (pie de página)
 * - Container con max-width
 * 
 * Cada Route define una página específica
 */
function App() {
  const { t } = useTranslation();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <ThemeChanger />

      <Routes>
        {/* Layout wrapper con Navbar y Footer */}
        <Route path="/" element={<Layout isSplashActive={showSplash} />}>
          {/* Página de inicio (index) */}
          <Route index element={<Home isSplashActive={showSplash} />} />

          {/* Página Sobre mí */}
          <Route path="about" element={<RouteContent><About /></RouteContent>} />

          {/* Página de proyectos */}
          <Route path="projects" element={<RouteContent><Projects /></RouteContent>} />

          {/* Página de habilidades */}
          <Route path="skills" element={<RouteContent><Skills /></RouteContent>} />

          {/* Página de contacto */}
          <Route path="contact" element={<Contact />} />

          {/* Ruta 404 - página no encontrada */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <h1>404</h1>
                <p>{t('notFound.message')}</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
