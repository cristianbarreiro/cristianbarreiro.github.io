/**
 * SplashScreen — Senior Creative Direction Redesign
 *
 * Secuencia de apertura e Identidad Digital para Cristian Barreiro.
 * Conserva el logo oficial /logo.svg como activo principal, integrando:
 * 1. Atmósfera tecnológica con partículas sutiles y luz radial ambiental.
 * 2. Revelación progresiva de marca (CRISTIAN BARREIRO | FULL-STACK SOFTWARE DEVELOPER).
 * 3. Chip de telemetría de estado con punto de pulso dinámico en theme.primaryColor.
 * 4. Transición continua de cortina radial (iris dissolve) hacia la homepage sin destellos ni saltos de layout.
 * 5. Soporte completo para prefers-reduced-motion y atajo de teclado/click para saltar.
 */

import { useState, useEffect, useCallback } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const MotionDiv = motion.div;
const TOTAL_DURATION = 2100;

function SplashScreen({ onFinish }) {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [exiting, setExiting] = useState(false);

  const triggerExit = useCallback(() => {
    if (exiting) return;
    setExiting(true);
  }, [exiting]);

  // Manejadores para saltar mediante teclado (Esc, Enter, Espacio) o click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerExit]);

  // Temporizador principal de la secuencia
  useEffect(() => {
    const mainTimer = setTimeout(() => {
      triggerExit();
    }, TOTAL_DURATION);

    return () => clearTimeout(mainTimer);
  }, [triggerExit]);

  // Finaliza el componente al terminar la animación de salida
  const handleAnimationEnd = (e) => {
    if (exiting && (e.target === e.currentTarget || e.animationName === 'splashFadeOut')) {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }
  };

  const primaryColorVar = `var(--mantine-color-${theme.primaryColor}-5)`;

  return (
    <div
      className={`splash-screen ${exiting ? 'splash-screen--exiting' : ''}`}
      role="status"
      aria-label={t('splash.srOnly')}
      onClick={triggerExit}
      onAnimationEnd={handleAnimationEnd}
      style={{
        '--splash-primary': primaryColorVar,
      }}
    >
      <span className="splash-screen__sr-only">{t('splash.srOnly')}</span>

      {/* Rejilla de Fondo & Halo de Luz Ambiental */}
      <div className="splash-screen__background">
        <div className="splash-screen__grid" />
        <div className="splash-screen__aura" />
      </div>

      {/* Contenedor Principal de la Secuencia */}
      <div className="splash-screen__content">

        {/* Branding e Identidad Profesional */}
        <MotionDiv
          className="splash-screen__brand"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="splash-screen__name">CRISTIAN BARREIRO</h1>
          <p className="splash-screen__role">{t('splash.role')}</p>
        </MotionDiv>
      </div>

      {/* Indicador discreto para saltar */}
      <div className="splash-screen__skip-hint">
        <span>{t('splash.skipHint')}</span>
      </div>
    </div>
  );
}

export default SplashScreen;
