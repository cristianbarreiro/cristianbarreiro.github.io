import { useEffect, useRef, useMemo } from 'react';
import { generateFluxNebulaPalette } from '../../utils/colors';
import './FluxNebula.css';

/**
 * FluxNebula
 * Capa de gas cósmico y plasma ionizado estilo Flux / Frozen Plasma.
 *
 * Características principales:
 * - Composición multicapa con mix-blend-mode: screen sobre lienzo negro espacial.
 * - Paleta cromática derivada matemáticamente (color primario, secundario armónico HSL,
 *   ambiente difuso profundo y núcleo ionizado).
 * - Aceleración GPU pura (translate3d, rotate, scale) con filtros de desenfoque estáticos.
 * - Micro-grano procedural SVG para evitar banding sin assets pesados.
 * - Viñeta perimétrica suave para preservar 80-90% de espacio oscuro y máxima legibilidad.
 * - Parallax sutil con el puntero del mouse (lerp de bajo impacto, desactivado en móvil y reduced-motion).
 *
 * @param {object} props
 * @param {string} [props.accentColorHex='#0088FF'] - Color de acento HEX activo
 * @param {boolean} [props.blendMode=false] - Atenuación para modo blend con fondo minimal
 */
function FluxNebula({ accentColorHex = '#0088FF', blendMode = false }) {
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });

  // Derivación armónica de la paleta cósmica a partir del HEX de acento
  const palette = useMemo(
    () => generateFluxNebulaPalette(accentColorHex),
    [accentColorHex],
  );

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    if (isReduced || isMobile) return;

    const handlePointerMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      // Parallax ultra sutil: máximo +-14px de desplazamiento
      targetOffsetRef.current = {
        x: ((e.clientX - centerX) / centerX) * -14,
        y: ((e.clientY - centerY) / centerY) * -14,
      };
    };

    const updateParallax = () => {
      const el = containerRef.current;
      if (el) {
        const dx = targetOffsetRef.current.x - currentOffsetRef.current.x;
        const dy = targetOffsetRef.current.y - currentOffsetRef.current.y;
        currentOffsetRef.current.x += dx * 0.05;
        currentOffsetRef.current.y += dy * 0.05;

        el.style.setProperty('--parallax-x', `${currentOffsetRef.current.x.toFixed(2)}px`);
        el.style.setProperty('--parallax-y', `${currentOffsetRef.current.y.toFixed(2)}px`);
      }
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flux-nebula ${blendMode ? 'flux-nebula--blend' : ''}`}
      style={{
        '--flux-primary-rgb': palette.primaryRgb,
        '--flux-secondary-rgb': palette.secondaryRgb,
        '--flux-ambient-rgb': palette.ambientRgb,
        '--flux-core-rgb': palette.plasmaCoreRgb,
      }}
      aria-hidden="true"
    >
      {/* Escenario con transform de parallax ultra sutil */}
      <div className="flux-nebula__stage">
        {/* Capa 1: Resplandor ambiental difuso */}
        <div className="flux-nebula__ambient" />

        {/* Capa 2: Nube de gas cósmico primario */}
        <div className="flux-nebula__cloud--primary" />

        {/* Capa 3: Nube secundaria de temperatura armónica desplazada */}
        <div className="flux-nebula__cloud--secondary" />

        {/* Capa 4: Núcleo de plasma ionizado de alta energía */}
        <div className="flux-nebula__core" />
      </div>

      {/* Capa 5: Micro-grano analógico procedural SVG (cero banding) */}
      <svg className="flux-nebula__grain" width="100%" height="100%" aria-hidden="true">
        <filter id="flux-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.45 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#flux-grain-filter)" />
      </svg>

      {/* Capa 6: Viñeta perimétrica de absorción estelar */}
      <div className="flux-nebula__vignette" />
    </div>
  );
}

export default FluxNebula;
