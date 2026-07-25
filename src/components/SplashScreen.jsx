import { useState, useEffect, useCallback } from 'react';
import './SplashScreen.css';

const PHASE_DURATION = 1800;

function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  const handleFinish = useCallback(() => {
    if (typeof onFinish === 'function') onFinish();
  }, [onFinish]);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), PHASE_DURATION);
    return () => clearTimeout(exitTimer);
  }, []);

  const handleAnimationEnd = (e) => {
    if (e.target === e.currentTarget && exiting) {
      handleFinish();
    }
  };

  return (
    <div
      className={`splash-screen${exiting ? ' splash-screen--exiting' : ''}`}
      role="status"
      aria-label="Cargando portfolio"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="splash-screen__sr-only">Cargando portfolio de Cristian Barreiro</span>

      <div className="splash-screen__logo-wrapper">
        <div className="splash-screen__glow" />
        <img
          src="/logo.svg"
          alt="Cristian Barreiro"
          className="splash-screen__logo"
          draggable="false"
        />
      </div>
    </div>
  );
}

export default SplashScreen;
