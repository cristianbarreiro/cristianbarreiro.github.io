/**
 * ProjectCardGridCanvas
 * 
 * Dibuja la cuadrícula y sus celdas iluminadas en un único sistema de coordenadas.
 * 
 * Invariantes:
 * - CELL_SIZE es la única definición geométrica del tamaño de celda.
 * - Las luces ocupan la celda completa; las líneas se dibujan encima.
 * - Una máscara radial única se aplica a todo el dibujo del Canvas.
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

    // Mantener las medidas CSS fraccionarias y adaptar el bitmap al DPR real.
    const updateSize = () => {
      // El canvas ocupa el padding box de la Card; medirlo evita incluir el borde
      // de Mantine en una superficie de dibujo que queda dentro de ese borde.
      const rect = canvas.getBoundingClientRect();
      cardWidth = rect.width;
      cardHeight = rect.height;
      dpr = window.devicePixelRatio || 1;

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
    window.addEventListener('resize', updateSize);
    updateSize();

    // La máscara recorta el dibujo completo; no se aproxima aquí para elegir celdas.
    const getEligibleCells = () => {
      const cols = Math.ceil(cardWidth / CELL_SIZE);
      const rows = Math.ceil(cardHeight / CELL_SIZE);
      const eligible = [];

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Evitar seleccionar una celda que ya esté activa.
          const isAlreadyActive = activeCells.some(
            (cell) => cell.col === c && cell.row === r
          );
          if (!isAlreadyActive) {
            eligible.push({ col: c, row: r });
          }
        }
      }

      return eligible;
    };

    // Crear una nueva celda iluminada
    const spawnCell = (now) => {
      const eligible = getEligibleCells();
      if (eligible.length === 0) return;

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

      drawCanvas();

      // Continuar el bucle mientras esté en hover o queden celdas desvaneciéndose
      if (isHovered || activeCells.length > 0) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Dibuja toda la composición en coordenadas CSS. La transformación se deriva
    // del tamaño final del bitmap para conservar la geometría incluso al redondear DPR.
    const drawCanvas = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!cardWidth || !cardHeight) return;

      const scaleX = canvas.width / cardWidth;
      const scaleY = canvas.height / cardHeight;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

      // Conserva el resplandor radial de la capa CSS anterior.
      const tileColor = getComputedStyle(parent)
        .getPropertyValue('--fh-card-tile-color')
        .trim();
      if (tileColor) {
        const centerX = cardWidth * 0.18;
        const centerY = cardHeight * 0.12;
        const radius = Math.max(
          Math.hypot(centerX, centerY),
          Math.hypot(cardWidth - centerX, centerY),
          Math.hypot(centerX, cardHeight - centerY),
          Math.hypot(cardWidth - centerX, cardHeight - centerY)
        );
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        glow.addColorStop(0, tileColor);
        glow.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, cardWidth, cardHeight);
      }

      // Iluminación: cada rectángulo ocupa exactamente su celda geométrica.
      const { r, g, b } = colorRef.current;
      for (const cell of activeCells) {
        if (cell.currentOpacity <= 0) continue;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.currentOpacity.toFixed(3)})`;
        ctx.fillRect(
          cell.col * CELL_SIZE,
          cell.row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }

      // Rellenos rectangulares de 1 CSS px evitan el medio píxel de los strokes.
      // En escalas enteras de dispositivo, cada línea cae en límites de píxel.
      ctx.fillStyle = getComputedStyle(parent)
        .getPropertyValue('--fh-card-line-color')
        .trim();
      const cols = Math.ceil(cardWidth / CELL_SIZE);
      const rows = Math.ceil(cardHeight / CELL_SIZE);
      for (let col = 0; col <= cols; col++) {
        const x = col * CELL_SIZE;
        if (x <= cardWidth) ctx.fillRect(x, 0, 1, cardHeight);
      }
      for (let row = 0; row <= rows; row++) {
        const y = row * CELL_SIZE;
        if (y <= cardHeight) ctx.fillRect(0, y, cardWidth, 1);
      }

      // Equivalente único de radial-gradient(circle at 60% 8%, #000 0%, #000 20%, transparent 68%).
      const maskCenterX = cardWidth * 0.6;
      const maskCenterY = cardHeight * 0.08;
      const maskRadius = Math.max(
        Math.hypot(maskCenterX, maskCenterY),
        Math.hypot(cardWidth - maskCenterX, maskCenterY),
        Math.hypot(maskCenterX, cardHeight - maskCenterY),
        Math.hypot(cardWidth - maskCenterX, cardHeight - maskCenterY)
      );
      const mask = ctx.createRadialGradient(
        maskCenterX, maskCenterY, 0,
        maskCenterX, maskCenterY, maskRadius
      );
      mask.addColorStop(0, 'rgba(0, 0, 0, 1)');
      mask.addColorStop(0.2, 'rgba(0, 0, 0, 1)');
      mask.addColorStop(0.68, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = mask;
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      ctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      window.removeEventListener('resize', updateSize);
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
