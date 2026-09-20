/**
 * ProjectCardGridCanvas
 * 
 * Componente que ilumina de forma sutil y pseudo-aleatoria celdas de la cuadrícula
 * existente (64px x 64px) en las tarjetas de proyectos al pasar el cursor (hover).
 * 
 * Invariantes:
 * - NO dibuja líneas de cuadrícula ni crea una cuadrícula secundaria.
 * - Respeta estrictamente las dimensiones existentes (64px x 64px, origen 0,0).
 * - Utiliza la misma máscara radial que el pseudo-elemento ::before original.
 * - Ciclo de vida desacoplado de los re-renders de React para máximo rendimiento (RAF).
 * - Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { hexToRgb } from '../utils/colors';

const CELL_SIZE = 64;
const MAX_ACTIVE_CELLS = 3;

/**
 * Easing smoothstep (0 -> 1)
 */
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function ProjectCardGridCanvas() {
  const canvasRef = useRef(null);
  const { primaryColor } = useThemeContext();
  const colorRef = useRef(hexToRgb(primaryColor || '#0088ff'));

  // Mantener actualizado el color RGB actual sin reiniciar el canvas
  useEffect(() => {
    colorRef.current = hexToRgb(primaryColor || '#0088ff');
  }, [primaryColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = null;
    let isHovered = false;
    let cardWidth = 0;
    let cardHeight = 0;
    let dpr = 1;
    let activeCells = [];
    let lastSpawnTime = 0;
    let nextSpawnDelay = 200;

    // Comprobar preferencia de reducción de movimiento
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        activeCells = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Ajustar resolución del canvas según tamaño real y DPI
    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      cardWidth = Math.round(rect.width);
      cardHeight = Math.round(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetPixelWidth = Math.round(cardWidth * dpr);
      const targetPixelHeight = Math.round(cardHeight * dpr);

      if (canvas.width !== targetPixelWidth || canvas.height !== targetPixelHeight) {
        canvas.width = targetPixelWidth;
        canvas.height = targetPixelHeight;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(parent);
    updateSize();

    // Obtener candidatos de celdas visibles según la máscara radial
    const getEligibleCells = () => {
      const cols = Math.ceil(cardWidth / CELL_SIZE);
      const rows = Math.ceil(cardHeight / CELL_SIZE);
      const eligible = [];

      // Centro de la máscara radial original: 60% x, 8% y
      const maskCenterX = cardWidth * 0.6;
      const maskCenterY = cardHeight * 0.08;
      const maxDim = Math.max(cardWidth, cardHeight);
      const maxRadius = maxDim * 0.7; // Radio efectivo donde la máscara es visible

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cellCenterX = c * CELL_SIZE + CELL_SIZE / 2;
          const cellCenterY = r * CELL_SIZE + CELL_SIZE / 2;
          const dist = Math.hypot(cellCenterX - maskCenterX, cellCenterY - maskCenterY);

          // Incluir celdas que caen dentro del área visible de la máscara
          if (dist <= maxRadius) {
            // Evitar seleccionar una celda que ya esté activa
            const isAlreadyActive = activeCells.some(
              (cell) => cell.col === c && cell.row === r
            );
            if (!isAlreadyActive) {
              eligible.push({ col: c, row: r, dist });
            }
          }
        }
      }

      return eligible;
    };

    // Crear una nueva celda iluminada
    const spawnCell = (now) => {
      const eligible = getEligibleCells();
      if (eligible.length === 0) return;

      // Ponderar ligeramente celdas más cercanas a la zona de luz
      const selected = eligible[Math.floor(Math.random() * eligible.length)];

      // Parámetros de animación sutiles
      const fadeInDuration = 300 + Math.random() * 200; // 300ms - 500ms
      const holdDuration = 180 + Math.random() * 220;   // 180ms - 400ms
      const fadeOutDuration = 400 + Math.random() * 300; // 400ms - 700ms
      const peakOpacity = 0.16 + Math.random() * 0.08;   // 0.16 - 0.24 (muy sutil)

      activeCells.push({
        col: selected.col,
        row: selected.row,
        startTime: now,
        fadeInEnd: now + fadeInDuration,
        holdEnd: now + fadeInDuration + holdDuration,
        endTime: now + fadeInDuration + holdDuration + fadeOutDuration,
        peakOpacity,
        currentOpacity: 0,
      });

      lastSpawnTime = now;
      nextSpawnDelay = 250 + Math.random() * 450; // Intervalo irregular
    };

    // Bucle de animación RAF
    const loop = (timestamp) => {
      if (prefersReducedMotion) {
        activeCells = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafId = null;
        return;
      }

      // Si está en hover y hay espacio para más celdas activas
      if (isHovered && activeCells.length < MAX_ACTIVE_CELLS) {
        if (timestamp - lastSpawnTime >= nextSpawnDelay) {
          spawnCell(timestamp);
        }
      }

      // Actualizar opacidades de celdas activas
      for (let i = activeCells.length - 1; i >= 0; i--) {
        const cell = activeCells[i];

        if (timestamp < cell.fadeInEnd) {
          // Fase Fade In
          const progress = smoothstep(cell.startTime, cell.fadeInEnd, timestamp);
          cell.currentOpacity = cell.peakOpacity * progress;
        } else if (timestamp < cell.holdEnd) {
          // Fase Hold
          cell.currentOpacity = cell.peakOpacity;
        } else if (timestamp < cell.endTime) {
          // Fase Fade Out
          const progress = 1 - smoothstep(cell.holdEnd, cell.endTime, timestamp);
          cell.currentOpacity = cell.peakOpacity * progress;
        } else {
          // Finalizada
          cell.currentOpacity = 0;
          activeCells.splice(i, 1);
        }
      }

      // Limpiar y dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeCells.length > 0) {
        ctx.save();
        ctx.scale(dpr, dpr);

        const { r, g, b } = colorRef.current;

        for (let i = 0; i < activeCells.length; i++) {
          const cell = activeCells[i];
          if (cell.currentOpacity <= 0) continue;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.currentOpacity.toFixed(3)})`;
          // Rellenar exactamente el espacio interior de la celda de 64x64 entre las líneas de 1px
          ctx.fillRect(
            cell.col * CELL_SIZE + 1,
            cell.row * CELL_SIZE + 1,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        }

        ctx.restore();
      }

      // Continuar el bucle mientras esté en hover o queden celdas desvaneciéndose
      if (isHovered || activeCells.length > 0) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Controladores de eventos de hover en la tarjeta
    const handlePointerEnter = () => {
      if (prefersReducedMotion) return;
      isHovered = true;
      if (!rafId) {
        lastSpawnTime = performance.now() - nextSpawnDelay; // Permitir que aparezca una celda rápidamente
        rafId = requestAnimationFrame(loop);
      }
    };

    const handlePointerLeave = () => {
      isHovered = false;
      // No cancelamos RAF inmediatamente: permitimos que las celdas activas
      // completen su desvanecimiento suave (fade out) y se apaguen limpiamente.
    };

    parent.addEventListener('pointerenter', handlePointerEnter);
    parent.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      parent.removeEventListener('pointerenter', handlePointerEnter);
      parent.removeEventListener('pointerleave', handlePointerLeave);
      motionQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fh-project-card-canvas"
      aria-hidden="true"
    />
  );
}

export default ProjectCardGridCanvas;
