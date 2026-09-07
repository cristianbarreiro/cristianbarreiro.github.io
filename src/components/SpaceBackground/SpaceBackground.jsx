/**
 * Fondo animado tipo “cosmos”: estrellas, parallax, estrellas fugaces y nebulosas.
 * Adaptado desde `space-background-ani/src/components/SpaceBackground.tsx`.
 */

import { useEffect, useRef, useMemo } from 'react';
import { hexToRgb } from '../../utils/colors';
import './SpaceBackground.css';

/**
 * Genera una configuración cósmica personalizada para nebulosas a partir de un HEX de acento
 */
function generateCosmicThemeFromHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  return {
    backgroundColor: '#07080c',
    nebulaColors: [
      `rgba(${Math.round(r * 0.6)}, ${Math.round(g * 0.6)}, ${Math.round(b * 0.7)}, {a})`,
      `rgba(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.9)}, {a})`,
      `rgba(${r}, ${g}, ${b}, {a})`,
      `rgba(${Math.round(255 * 0.4 + r * 0.6)}, ${Math.round(255 * 0.4 + g * 0.6)}, ${Math.round(255 * 0.4 + b * 0.6)}, {a})`,
    ],
  };
}

/** @typedef {'space'} BackgroundTheme */

/**
 * Default theme config for neutral rendering.
 * Accent-tinted nebula visuals are generated dynamically by generateCosmicThemeFromHex().
 * @type {Record<BackgroundTheme, { backgroundColor: string; starColors: { bright: string[]; dim: string[] }; shootingStarColors: string[]; nebulaColors?: string[] }>}
 */
const THEME_CONFIGS = {
  space: {
    backgroundColor: '#07080c',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(220, 235, 255, {a})', 'rgba(180, 210, 255, {a})'],
      dim: ['rgba(220, 230, 255, {a})', 'rgba(180, 200, 240, {a})', 'rgba(140, 170, 220, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(200, 225, 255, {a})', 'rgba(150, 190, 255, {a})'],
    nebulaColors: ['rgba(50, 60, 85, {a})', 'rgba(75, 88, 115, {a})', 'rgba(35, 45, 68, {a})', 'rgba(95, 110, 140, {a})'],
  },
};

/**
 * @param {object} props
 * @param {BackgroundTheme} [props.theme]
 * @param {string} [props.accentColorHex] - Color de acento HEX activo para la nebulosa
 * @param {boolean} [props.showNebula] - Muestra/oculta las nubes de nebulosa
 * @param {boolean} [props.blendMode]
 */
function SpaceBackground({
  theme = 'space',
  accentColorHex = '#0088ff',
  showNebula = false,
  blendMode = false,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const nebulaCloudsRef = useRef([]);
  const timeRef = useRef(0);

  const dynamicConfig = useMemo(
    () => (accentColorHex ? generateCosmicThemeFromHex(accentColorHex) : null),
    [accentColorHex],
  );

  // Refs que el animation loop lee cada frame para cambiar colores/visibilidad
  // sin re-inicializar posiciones de partículas
  const themeRef = useRef(theme);
  const showNebulaRef = useRef(showNebula);
  const blendModeRef = useRef(blendMode);
  const sizeRef = useRef({ width: 0, height: 0 });
  const dynamicConfigRef = useRef(dynamicConfig);

  // Sincronizar refs con props después de cada render
  useEffect(() => {
    themeRef.current = theme;
    showNebulaRef.current = showNebula;
    blendModeRef.current = blendMode;
    dynamicConfigRef.current = dynamicConfig;
  });

  // ── Helper: obtener config de tema actual (nebulosas) desde refs ──
  const getThemeConfig = () => {
    const fallbackTc = THEME_CONFIGS[themeRef.current] ?? THEME_CONFIGS.space;
    return dynamicConfigRef.current || fallbackTc;
  };

  // ── Init/clear nebulosas cuando showNebula cambia ──
  useEffect(() => {
    const { width, height } = sizeRef.current;
    if (!showNebula || width === 0) {
      nebulaCloudsRef.current = [];
      return;
    }
    // Si ya existen nubes de nebulosa, no regenerar posiciones
    if (nebulaCloudsRef.current.length > 0) return;

    const tc = dynamicConfig || THEME_CONFIGS.space;
    if (!tc.nebulaColors) {
      nebulaCloudsRef.current = [];
      return;
    }

    const cloudCount = 8;
    const colors = tc.nebulaColors;
    const colorCount = colors.length;

    const bm = blendModeRef.current;
    nebulaCloudsRef.current = [];
    for (let i = 0; i < cloudCount; i++) {
      nebulaCloudsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 180 + Math.random() * 280,
        opacity: (0.10 + Math.random() * 0.18) * (bm ? 0.45 : 1),
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0004 * (bm ? 0.4 : 1),
        pulseOffset: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * colorCount),
      });
    }
  }, [showNebula, dynamicConfig]);

  // ── Effect principal: canvas, estrellas, animation loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    let width = 0;
    let height = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      canvas.width = Math.floor(newWidth * dpr);
      canvas.height = Math.floor(newHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isFirstInit = width === 0 && height === 0;
      const scaleX = isFirstInit ? 1 : newWidth / width;
      const scaleY = isFirstInit ? 1 : newHeight / height;

      width = newWidth;
      height = newHeight;
      sizeRef.current = { width, height };

      if (isFirstInit) {
        initStars();
        initNebulaClouds();
        return;
      }

      starsRef.current.forEach((star) => {
        star.x *= scaleX;
        star.y *= scaleY;
      });

      nebulaCloudsRef.current.forEach((cloud) => {
        cloud.x *= scaleX;
        cloud.y *= scaleY;
        cloud.radius *= Math.max(scaleX, scaleY);
      });
    };

    const initStars = () => {
      // Siempre inicializar con parámetros estándar (sin blend) para que
      // las estrellas se mantengan idénticas al activar/desactivar blend
      const starCount = Math.floor((width * height) / 3000);
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        const depth = Math.random();
        const size = depth * 2.5 + 0.5;

        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          opacity: 1,
          twinkleSpeed: 0.5 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth,
          baseOpacity: 0.3 + depth * 0.7,
        });
      }
    };

    const initNebulaClouds = () => {
      const tc = dynamicConfigRef.current || THEME_CONFIGS.space;

      if (!showNebulaRef.current || !tc.nebulaColors) {
        nebulaCloudsRef.current = [];
        return;
      }

      const bm = blendModeRef.current;
      const cloudCount = 8;
      nebulaCloudsRef.current = [];
      const colors = tc.nebulaColors;
      const colorCount = colors.length;

      for (let i = 0; i < cloudCount; i++) {
        nebulaCloudsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 180 + Math.random() * 280,
          opacity: (0.10 + Math.random() * 0.18) * (bm ? 0.45 : 1),
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0004 * (bm ? 0.4 : 1),
          pulseOffset: Math.random() * Math.PI * 2,
          colorIndex: Math.floor(Math.random() * colorCount),
        });
      }
    };

    const createShootingStar = () => {
      const bm = blendModeRef.current;
      if (Math.random() < (bm ? 0.0008 : 0.002)) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.6;

        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          length: 60 + Math.random() * 100,
          speed: (8 + Math.random() * 6) * (bm ? 0.5 : 1),
          opacity: bm ? 0.35 : 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const spawnClickComet = (clickX, clickY) => {
      if (shootingStarsRef.current.length >= 15) return;
      const bm = blendModeRef.current;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
      const offset = 100 + Math.random() * 120;
      const targetX = typeof clickX === 'number' ? clickX : Math.random() * width;
      const targetY = typeof clickY === 'number' ? clickY : Math.random() * height * 0.6;
      const startX = targetX - Math.cos(angle) * offset;
      const startY = targetY - Math.sin(angle) * offset;

      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        length: 80 + Math.random() * 120,
        speed: (12 + Math.random() * 8) * (bm ? 0.6 : 1),
        opacity: bm ? 0.5 : 1,
        angle,
      });
    };

    const drawNebulaCloud = (cloud, time) => {
      const themeConfig = getThemeConfig();
      const colors = themeConfig.nebulaColors;
      if (!colors) return;

      const safeIndex = cloud.colorIndex % colors.length;
      const pulse = Math.sin(time * 0.5 + cloud.pulseOffset) * 0.1 + 1;
      const currentRadius = cloud.radius * pulse;

      const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, currentRadius);

      const color1 = colors[safeIndex].replace('{a}', String(cloud.opacity * 0.32));
      const color2 = colors[(safeIndex + 1) % colors.length].replace('{a}', String(cloud.opacity * 0.14));
      const color3 = colors[(safeIndex + 2) % colors.length].replace('{a}', '0');

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.55, color2);
      gradient.addColorStop(1, color3);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStar = (star, time) => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
      const opacity = star.baseOpacity * twinkle;

      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size);

      const colors = star.depth > 0.7 ? THEME_CONFIGS.space.starColors.bright : THEME_CONFIGS.space.starColors.dim;

      gradient.addColorStop(0, colors[0].replace('{a}', String(opacity)));
      gradient.addColorStop(0.3, colors[1].replace('{a}', String(opacity * 0.6)));
      gradient.addColorStop(1, colors[2].replace('{a}', '0'));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star.depth > 0.85) {
        ctx.fillStyle = THEME_CONFIGS.space.starColors.bright[0].replace('{a}', String(opacity * 0.6));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawShootingStar = (shootingStar) => {
      const gradient = ctx.createLinearGradient(
        shootingStar.x,
        shootingStar.y,
        shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length,
      );

      const colors = THEME_CONFIGS.space.shootingStarColors;
      gradient.addColorStop(0, colors[0].replace('{a}', String(shootingStar.opacity)));
      gradient.addColorStop(0.3, colors[1].replace('{a}', String(shootingStar.opacity * 0.6)));
      gradient.addColorStop(1, colors[2].replace('{a}', '0'));

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length,
      );
      ctx.stroke();
    };

    const drawFrame = () => {
      const time = timeRef.current;

      ctx.fillStyle = blendModeRef.current ? '#090a0f' : THEME_CONFIGS.space.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      nebulaCloudsRef.current.forEach((cloud) => {
        drawNebulaCloud(cloud, time);
      });

      starsRef.current.forEach((star) => {
        drawStar(star, time);
      });

      shootingStarsRef.current.forEach((shootingStar) => {
        drawShootingStar(shootingStar);
      });
    };

    const animate = () => {
      timeRef.current += 0.01;

      const bm = blendModeRef.current;
      ctx.fillStyle = bm ? '#090a0f' : THEME_CONFIGS.space.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const driftMultiplier = bm ? 0.35 : 1;

      nebulaCloudsRef.current.forEach((cloud) => {
        cloud.angle += cloud.rotationSpeed;
        cloud.x += Math.cos(cloud.angle) * 0.05 * driftMultiplier;
        cloud.y += Math.sin(cloud.angle) * 0.05 * driftMultiplier;

        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        drawNebulaCloud(cloud, timeRef.current);
      });

      const velMultiplier = bm ? 0.4 : 1;

      starsRef.current.forEach((star) => {
        star.x -= star.depth * 0.15 * velMultiplier;
        star.y += star.depth * 0.05 * velMultiplier;

        if (star.x < -10) star.x = width + 10;
        if (star.y > height + 10) star.y = -10;

        drawStar(star, timeRef.current);
      });

      createShootingStar();

      const nextShooting = [];
      for (let i = 0; i < shootingStarsRef.current.length; i++) {
        const shootingStar = shootingStarsRef.current[i];
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.01;

        if (shootingStar.opacity > 0) {
          drawShootingStar(shootingStar);
          nextShooting.push(shootingStar);
        }
      }
      shootingStarsRef.current = nextShooting;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        if (reducedMotion) {
          timeRef.current = 0;
          drawFrame();
        }
      }, 150);
    };

    // Detección de clicks rápidos seguidos para probabilidad de cometa
    let clickCount = 0;
    let lastClickTime = 0;
    const RAPID_CLICK_WINDOW_MS = 500;
    const MIN_CLICKS_TRIGGER = 3;
    const COMET_PROBABILITY = 0.55;

    const handlePointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (reducedMotion) return;

      const now = performance.now();
      if (now - lastClickTime <= RAPID_CLICK_WINDOW_MS) {
        clickCount += 1;
      } else {
        clickCount = 1;
      }
      lastClickTime = now;

      if (clickCount >= MIN_CLICKS_TRIGGER) {
        if (Math.random() < COMET_PROBABILITY) {
          spawnClickComet(e.clientX, e.clientY);
        }
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    resizeCanvas();

    if (reducedMotion) {
      timeRef.current = 0;
      drawFrame();
    } else {
      animate();
    }

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="space-background" aria-hidden="true" />;
}

export default SpaceBackground;

