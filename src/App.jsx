/**
 * Componente App
 * Define las rutas de la aplicación
 */

import { Routes, Route } from 'react-router-dom';

// Componente de layout
import Layout from './components/Layout';

// Páginas
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import { useTranslation } from 'react-i18next';

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

  return (
    <Routes>
      {/* Layout wrapper con Navbar y Footer */}
      <Route path="/" element={<Layout />}>
        {/* Página de inicio (index) */}
        <Route index element={<Home />} />

        {/* Página Sobre mí */}
        <Route path="about" element={<About />} />

        {/* Página de proyectos */}
        <Route path="projects" element={<Projects />} />

        {/* Página de habilidades */}
        <Route path="skills" element={<Skills />} />

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
  );
}

export default App;
