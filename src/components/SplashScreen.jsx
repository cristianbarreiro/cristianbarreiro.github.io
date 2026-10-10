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

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const MotionDiv = motion.div;
const TOTAL_DURATION = 2400;
const COMPLETE_HOLD = 250;

function SplashScreen({ onFinish }) {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

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

  // Bloquea el scroll del documento mientras el Splash Screen está montado y
  // restaura exactamente los valores originales de overflow al desmontarse.
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverflow = root.style.overflow;

    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
    };
  }, []);

  // Loader: el progreso 0 → 100 gobierna la finalización normal del Splash Screen.
  // El Splash NO puede terminar antes de alcanzar el 100%.
  useEffect(() => {
    if (exiting || completedRef.current) return undefined;

    let frameId = 0;
    let holdTimer = 0;
    const start = performance.now();

    const step = () => {
      const elapsed = Math.max(0, performance.now() - start);
      const next = Math.min(100, Math.floor((elapsed / TOTAL_DURATION) * 100));

      setProgress((current) => (current === next ? current : next));

      if (next < 100) {
        frameId = requestAnimationFrame(step);
        return;
      }

      // 100% alcanzado: se mantiene la barra llena un instante y se ejecuta la salida existente
      completedRef.current = true;
      holdTimer = setTimeout(() => {
        triggerExit();
      }, COMPLETE_HOLD);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(holdTimer);
    };
  }, [triggerExit, exiting]);

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
          <h1 className="splash-screen__glitch-title" data-text={t('splash.initializing')}>
            {t('splash.initializing')}
          </h1>
          <div
            className="splash-screen__loader"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={t('splash.srOnly')}
          >
            <span className="splash-screen__loader-track">
              <span
                className="splash-screen__loader-fill"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="splash-screen__loader-value">{progress}%</span>
          </div>
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
