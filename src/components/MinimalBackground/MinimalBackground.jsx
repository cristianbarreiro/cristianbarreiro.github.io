import { useEffect, useRef } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import './MinimalBackground.css';

function MinimalBackground() {
  const { primaryColor } = useThemeContext();
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const targetPosRef = useRef({ x: -1000, y: -1000 });
  const currentPosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const updateSpotlight = () => {
      if (containerRef.current) {
        // Smooth linear interpolation (lerp) for fluid cursor spotlight physics
        const dx = targetPosRef.current.x - currentPosRef.current.x;
        const dy = targetPosRef.current.y - currentPosRef.current.y;

        currentPosRef.current.x += dx * 0.12;
        currentPosRef.current.y += dy * 0.12;

        containerRef.current.style.setProperty('--mouse-x', `${currentPosRef.current.x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${currentPosRef.current.y}px`);
      }
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="minimal-background"
      style={{ '--glow-color': `var(--mantine-color-${primaryColor}-6)` }}
    >
      <div className="minimal-background__glow minimal-background__glow--1" />
      <div className="minimal-background__glow minimal-background__glow--2" />
      <div className="minimal-background__grid" />
      <div className="minimal-background__spotlight" />
    </div>
  );
}

export default MinimalBackground;
