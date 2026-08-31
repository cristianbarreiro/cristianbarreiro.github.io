/**
 * TechStackSection
 * Contenedor principal de la sección Tech Stack.
 * Detecta capacidades del dispositivo y renderiza el globo 3D o el fallback móvil.
 *
 * Layout desktop: globo (izq) + panel info (der)
 * Layout mobile:  fallback grid (arriba) + panel info (abajo)
 */

import { useState, useMemo, useCallback, useEffect, Suspense, lazy } from 'react';
import { Container, Title, Text, Stack, useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { computeNodePositions, globeTechnologies } from '../../data/globeTechStack';
import TechInfoPanel from './TechInfoPanel';
import MobileFallback from './MobileFallback';
import './TechGlobe.css';

/** Lazy-load the heavy 3D canvas — Three.js only loads if/when needed */
const TechGlobe = lazy(() => import('./TechGlobe'));

/** Detecta si el dispositivo soporta WebGL */
function detectWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/** Detecta si el usuario prefiere movimiento reducido */
function detectReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  );
}

/** Detecta si es un viewport móvil (<768px) */
function detectMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function TechStackSection() {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const [selectedTech, setSelectedTech] = useState(null);
  const [hasWebGL, setHasWebGL] = useState(() => !detectMobile() && detectWebGL());

  // Calcular posiciones una sola vez
  const technologies = useMemo(
    () => computeNodePositions(globeTechnologies),
    []
  );

  // Escuchar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setHasWebGL(!detectMobile() && detectWebGL());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reducedMotion = useMemo(() => detectReducedMotion(), []);

  const handleSelectTech = useCallback((tech) => {
    setSelectedTech(tech);
  }, []);

  return (
    <section className="tech-globe-section home-section" aria-label={t('home.techStackAria')}>
      <Container size="xl">

        {/* Section header */}
        <Stack align="center" ta="center" mb="xl" gap="xs" style={{ userSelect: 'none' }}>
          <Title order={2} size="h2" fw={700} className="section-title">
            {t('home.techStackTitle')}
          </Title>
          <Text size="md" className="section-subtitle" maw={520}>
            {t('home.techStackSubtitle')}
          </Text>
          <div
            className="home-section-accent-line"
            style={{
              background: `linear-gradient(90deg, transparent, var(--mantine-color-${theme.primaryColor}-5), transparent)`,
            }}
          />
        </Stack>

        {/* Main layout: globe + panel */}
        <div className="tech-globe-layout">

          {/* Left / Top: Globe or Fallback */}
          <div>
            {hasWebGL ? (
              <Suspense
                fallback={
                  <div
                    className="tech-globe-canvas-wrapper"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(10,20,40,0.8) 0%, rgba(5,8,15,0.9) 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="tech-globe-empty-icon" style={{ width: 64, height: 64 }} />
                  </div>
                }
              >
                <TechGlobe
                  technologies={technologies}
                  selectedTech={selectedTech}
                  onSelectTech={handleSelectTech}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
            ) : (
              <MobileFallback
                technologies={globeTechnologies}
                selectedTech={selectedTech}
                onSelectTech={handleSelectTech}
              />
            )}
          </div>

          {/* Right / Bottom: Info panel */}
          <TechInfoPanel tech={selectedTech} />
        </div>

      </Container>
    </section>
  );
}

export default TechStackSection;
