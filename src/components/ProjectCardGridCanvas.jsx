/**
 * ProjectCardGridCanvas
 *
 * Dibuja la cuadrícula y sus celdas iluminadas en un único sistema de coordenadas.
 *
 * Invariantes:
 * - CELL_SIZE es la única definición geométrica del tamaño de celda.
 * - Las luces ocupan la celda completa; las líneas se dibujan encima.
 * - Una máscara radial única se aplica a todo el dibujo del Canvas.
 * - El ciclo RAF solo se ejecuta durante hover o mientras termina un fade.
 * - Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';
import { useThemeContext } from '../context/ThemeContext';
import { hexToRgb } from '../utils/colors';

const CELL_SIZE = 64;
const MAX_ACTIVE_CELLS = 3;

function smootherstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function ProjectCardGridCanvas() {
  const canvasRef = useRef(null);
  const { primaryColor } = useThemeContext();
  const colorRef = useRef(hexToRgb(primaryColor || '#0088ff'));

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
    let cssWidth = 0;
    let cssHeight = 0;
    let activeCells = [];
    let lastSpawnTime = 0;
    let nextSpawnDelay = 200;
    let dprMediaQuery = null;
    const drawingColors = { line: '', tile: '' };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const readCssSize = () => {
      // Layout dimensions exclude visual transforms such as the card hover translate.
      const style = getComputedStyle(canvas);
      return {
        width: Number.parseFloat(style.width) || 0,
        height: Number.parseFloat(style.height) || 0,
      };
    };

    const refreshDrawingColors = () => {
      const style = getComputedStyle(parent);
      drawingColors.line = style.getPropertyValue('--fh-card-line-color').trim();
      drawingColors.tile = style.getPropertyValue('--fh-card-tile-color').trim();
    };

    const clearCanvas = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const drawCanvas = () => {
      clearCanvas();
      if (!cssWidth || !cssHeight || !canvas.width || !canvas.height) return;

      // El bitmap puede redondearse; usar su escala efectiva, no asumir que es DPR.
      const scaleX = canvas.width / cssWidth;
      const scaleY = canvas.height / cssHeight;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

      // Glow base heredado, dibujado en el mismo Canvas que el grid.
      if (drawingColors.tile) {
        const centerX = cssWidth * 0.18;
        const centerY = cssHeight * 0.12;
        const radius = Math.max(
          Math.hypot(centerX, centerY),
          Math.hypot(cssWidth - centerX, centerY),
          Math.hypot(centerX, cssHeight - centerY),
          Math.hypot(cssWidth - centerX, cssHeight - centerY)
        );
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        glow.addColorStop(0, drawingColors.tile);
        glow.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, cssWidth, cssHeight);
      }

      // Cada iluminación cubre exactamente una celda, sin gaps artificiales.
      const { r, g, b } = colorRef.current;
      for (const cell of activeCells) {
        if (cell.currentOpacity <= 0) continue;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.currentOpacity})`;
        ctx.fillRect(
          cell.col * CELL_SIZE,
          cell.row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }

      // Un único relleno evita componer dos veces los cruces translúcidos.
      // Mantener límites exactos da una geometría estable en DPR fraccionarios;
      // no se desplazan líneas para intentar forzar píxeles físicos enteros.
      if (drawingColors.line) {
        ctx.beginPath();
        const cols = Math.ceil(cssWidth / CELL_SIZE);
        const rows = Math.ceil(cssHeight / CELL_SIZE);
        for (let col = 0; col <= cols; col++) {
          const x = col * CELL_SIZE;
          if (x <= cssWidth) ctx.rect(x, 0, 1, cssHeight);
        }
        for (let row = 0; row <= rows; row++) {
          const y = row * CELL_SIZE;
          if (y <= cssHeight) ctx.rect(0, y, cssWidth, 1);
        }
        ctx.fillStyle = drawingColors.line;
        ctx.fill();
      }

      // Única máscara para el glow, la iluminación y las líneas.
      const maskCenterX = cssWidth * 0.6;
      const maskCenterY = cssHeight * 0.08;
      const maskRadius = Math.max(
        Math.hypot(maskCenterX, maskCenterY),
        Math.hypot(cssWidth - maskCenterX, maskCenterY),
        Math.hypot(maskCenterX, cssHeight - maskCenterY),
        Math.hypot(cssWidth - maskCenterX, cssHeight - maskCenterY)
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
      ctx.fillRect(0, 0, cssWidth, cssHeight);
      ctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    function scheduleFrame() {
      if (!prefersReducedMotion && rafId === null) {
        rafId = requestAnimationFrame(loop);
      }
    }

    function updateSize(width, height) {
      const nextWidth = Math.max(0, width);
      const nextHeight = Math.max(0, height);
      const sizeChanged = nextWidth !== cssWidth || nextHeight !== cssHeight;
      cssWidth = nextWidth;
      cssHeight = nextHeight;

      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.round(cssWidth * dpr);
      const targetHeight = Math.round(cssHeight * dpr);
      const bitmapChanged = canvas.width !== targetWidth || canvas.height !== targetHeight;

      if (bitmapChanged) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const cols = Math.ceil(cssWidth / CELL_SIZE);
      const rows = Math.ceil(cssHeight / CELL_SIZE);
      activeCells = activeCells.filter((cell) => cell.col < cols && cell.row < rows);

      if ((sizeChanged || bitmapChanged) && (isHovered || activeCells.length > 0)) {
        scheduleFrame();
      }
    }

    function getEligibleCells() {
      const cols = Math.ceil(cssWidth / CELL_SIZE);
      const rows = Math.ceil(cssHeight / CELL_SIZE);
      const eligible = [];

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          if (!activeCells.some((cell) => cell.col === col && cell.row === row)) {
            eligible.push({ col, row });
          }
        }
      }

      return eligible;
    }

    function spawnCell(now) {
      const eligible = getEligibleCells();
      if (eligible.length === 0) return;

      const selected = eligible[Math.floor(Math.random() * eligible.length)];
      const fadeInDuration = 600 + Math.random() * 300;
      const holdDuration = 240 + Math.random() * 240;
      const fadeOutDuration = 750 + Math.random() * 350;
      const peakOpacity = 0.14 + Math.random() * 0.06;

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
      nextSpawnDelay = 400 + Math.random() * 500;
    }

    function loop(timestamp) {
      rafId = null;
      if (prefersReducedMotion) {
        activeCells = [];
        clearCanvas();
        return;
      }

      if (isHovered && activeCells.length < MAX_ACTIVE_CELLS) {
        if (timestamp - lastSpawnTime >= nextSpawnDelay) spawnCell(timestamp);
      }

      for (let i = activeCells.length - 1; i >= 0; i--) {
        const cell = activeCells[i];
        if (cell.exitFadeEnd !== undefined) {
          const progress = smootherstep(cell.exitFadeStart, cell.exitFadeEnd, timestamp);
          cell.currentOpacity = cell.exitFadeStartOpacity * (1 - progress);
          if (timestamp >= cell.exitFadeEnd) {
            activeCells.splice(i, 1);
          }
        } else if (timestamp < cell.fadeInEnd) {
          const progress = smootherstep(cell.startTime, cell.fadeInEnd, timestamp);
          cell.currentOpacity = cell.peakOpacity * progress;
        } else if (timestamp < cell.holdEnd) {
          cell.currentOpacity = cell.peakOpacity;
        } else if (timestamp < cell.endTime) {
          const progress = 1 - smootherstep(cell.holdEnd, cell.endTime, timestamp);
          cell.currentOpacity = cell.peakOpacity * progress;
        } else {
          cell.currentOpacity = 0;
          activeCells.splice(i, 1);
        }
      }

      drawCanvas();
      if (isHovered || activeCells.length > 0) {
        scheduleFrame();
      } else {
        clearCanvas();
      }
    }

    const handlePointerEnter = () => {
      isHovered = true;
      if (prefersReducedMotion) return;
      lastSpawnTime = performance.now() - nextSpawnDelay;
      scheduleFrame();
    };

    const handlePointerLeave = () => {
      isHovered = false;
      const now = performance.now();
      for (const cell of activeCells) {
        cell.exitFadeStart = now;
        cell.exitFadeEnd = now + 650 + Math.random() * 250;
        cell.exitFadeStartOpacity = cell.currentOpacity;
      }
      if (activeCells.length > 0) scheduleFrame();
    };

    const handleMotionChange = (event) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
        activeCells = [];
        clearCanvas();
      } else if (isHovered) {
        scheduleFrame();
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((item) => item.target === canvas);
      if (entry) updateSize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(canvas);

    function watchDpr() {
      dprMediaQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio || 1}dppx)`
      );
      dprMediaQuery.addEventListener('change', handleDprChange, { once: true });
    }

    function handleDprChange() {
      dprMediaQuery?.removeEventListener('change', handleDprChange);
      dprMediaQuery = null;
      const size = readCssSize();
      updateSize(size.width, size.height);
      watchDpr();
    }

    const handleWindowResize = () => {
      const size = readCssSize();
      updateSize(size.width, size.height);
    };
    const handleStyleChange = () => {
      refreshDrawingColors();
      if ((isHovered || activeCells.length > 0) && !prefersReducedMotion) {
        scheduleFrame();
      }
    };

    motionQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleWindowResize);
    parent.addEventListener('pointerenter', handlePointerEnter);
    parent.addEventListener('pointerleave', handlePointerLeave);

    const styleObserver = new MutationObserver(handleStyleChange);
    styleObserver.observe(parent, { attributes: true, attributeFilter: ['style', 'class'] });
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mantine-color-scheme'],
    });

    refreshDrawingColors();
    const initialSize = readCssSize();
    updateSize(initialSize.width, initialSize.height);
    watchDpr();

    return () => {
      parent.removeEventListener('pointerenter', handlePointerEnter);
      parent.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleWindowResize);
      motionQuery.removeEventListener('change', handleMotionChange);
      dprMediaQuery?.removeEventListener('change', handleDprChange);
      styleObserver.disconnect();
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
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
