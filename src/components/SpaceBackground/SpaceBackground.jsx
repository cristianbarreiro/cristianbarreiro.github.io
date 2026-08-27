/**
 * Fondo animado tipo “cosmos”: estrellas, parallax, estrellas fugaces y nebulosas.
 * Adaptado desde `space-background-ani/src/components/SpaceBackground.tsx`.
 */

import { useEffect, useRef } from 'react';
import './SpaceBackground.css';

/** @typedef {'space' | 'nebula-purple' | 'nebula-blue' | 'nebula-pink' | 'nebula-green' | 'nebula-cyan' | 'nebula-yellow' | 'galaxy-spiral' | 'galaxy-magenta'} BackgroundTheme */

/** @type {Record<BackgroundTheme, { backgroundColor: string; starColors: { bright: string[]; dim: string[] }; shootingStarColors: string[]; nebulaColors?: string[]; galaxyColors?: string[] }>} */
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
  'nebula-purple': {
    backgroundColor: '#07050d',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(240, 210, 255, {a})', 'rgba(190, 140, 255, {a})'],
      dim: ['rgba(210, 170, 240, {a})', 'rgba(170, 130, 200, {a})', 'rgba(130, 90, 160, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(230, 180, 255, {a})', 'rgba(170, 100, 250, {a})'],
    nebulaColors: ['rgba(120, 35, 200, {a})', 'rgba(145, 45, 225, {a})', 'rgba(175, 80, 245, {a})', 'rgba(205, 140, 255, {a})'],
  },
  'nebula-blue': {
    backgroundColor: '#050712',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(215, 238, 255, {a})', 'rgba(140, 200, 255, {a})'],
      dim: ['rgba(200, 225, 255, {a})', 'rgba(150, 190, 240, {a})', 'rgba(100, 150, 210, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(180, 225, 255, {a})', 'rgba(90, 170, 255, {a})'],
    nebulaColors: ['rgba(24, 75, 185, {a})', 'rgba(15, 110, 225, {a})', 'rgba(70, 160, 245, {a})', 'rgba(130, 195, 255, {a})'],
  },
  'nebula-green': {
    backgroundColor: '#040b08',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(220, 255, 245, {a})', 'rgba(140, 240, 205, {a})'],
      dim: ['rgba(200, 245, 230, {a})', 'rgba(140, 210, 185, {a})', 'rgba(90, 170, 145, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(180, 250, 225, {a})', 'rgba(90, 230, 185, {a})'],
    nebulaColors: ['rgba(16, 125, 95, {a})', 'rgba(32, 175, 135, {a})', 'rgba(52, 211, 153, {a})', 'rgba(110, 231, 183, {a})'],
  },
  'nebula-cyan': {
    backgroundColor: '#040a10',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(215, 245, 255, {a})', 'rgba(130, 225, 255, {a})'],
      dim: ['rgba(190, 235, 250, {a})', 'rgba(130, 195, 225, {a})', 'rgba(80, 155, 190, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(170, 240, 255, {a})', 'rgba(80, 215, 255, {a})'],
    nebulaColors: ['rgba(14, 116, 144, {a})', 'rgba(6, 182, 212, {a})', 'rgba(56, 189, 248, {a})', 'rgba(165, 243, 252, {a})'],
  },
  'nebula-yellow': {
    backgroundColor: '#080602',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(255, 245, 210, {a})', 'rgba(255, 220, 130, {a})'],
      dim: ['rgba(240, 220, 170, {a})', 'rgba(200, 175, 110, {a})', 'rgba(160, 135, 70, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(255, 235, 170, {a})', 'rgba(250, 195, 40, {a})'],
    nebulaColors: ['rgba(170, 105, 10, {a})', 'rgba(215, 140, 15, {a})', 'rgba(240, 175, 30, {a})', 'rgba(250, 210, 60, {a})'],
  },
  'nebula-pink': {
    backgroundColor: '#0b040a',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(255, 220, 245, {a})', 'rgba(255, 150, 210, {a})'],
      dim: ['rgba(235, 180, 215, {a})', 'rgba(195, 130, 175, {a})', 'rgba(155, 90, 135, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(255, 200, 235, {a})', 'rgba(245, 120, 190, {a})'],
    nebulaColors: ['rgba(160, 30, 100, {a})', 'rgba(215, 45, 130, {a})', 'rgba(240, 100, 175, {a})', 'rgba(251, 200, 230, {a})'],
  },
  'galaxy-spiral': {
    backgroundColor: '#06060c',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(255, 235, 215, {a})', 'rgba(255, 205, 175, {a})'],
      dim: ['rgba(240, 205, 185, {a})', 'rgba(215, 175, 155, {a})', 'rgba(190, 150, 130, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(255, 230, 210, {a})', 'rgba(255, 195, 170, {a})'],
    galaxyColors: ['rgba(139, 92, 246, {a})', 'rgba(167, 139, 250, {a})', 'rgba(196, 181, 253, {a})', 'rgba(221, 214, 254, {a})'],
  },
  'galaxy-magenta': {
    backgroundColor: '#0a040b',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(255, 205, 255, {a})', 'rgba(240, 140, 220, {a})'],
      dim: ['rgba(235, 170, 210, {a})', 'rgba(205, 130, 185, {a})', 'rgba(175, 90, 155, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(255, 180, 230, {a})', 'rgba(230, 100, 210, {a})'],
    galaxyColors: ['rgba(192, 38, 211, {a})', 'rgba(217, 70, 239, {a})', 'rgba(232, 121, 249, {a})', 'rgba(250, 204, 21, {a})'],
  },
};

/**
 * @param {object} props
 * @param {BackgroundTheme} [props.theme]
 * @param {boolean} [props.showNebula]
 */
function SpaceBackground({ theme = 'space', showNebula = false, blendMode = false }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const nebulaCloudsRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeConfig = THEME_CONFIGS[theme] ?? THEME_CONFIGS.space;

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
      const starCount = Math.floor((width * height) / (blendMode ? 2800 : 3000));
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        const depth = Math.random();
        const size = blendMode ? depth * 1.8 + 0.5 : depth * 2.5 + 0.5;

        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          opacity: 1,
          twinkleSpeed: blendMode ? 0.4 + Math.random() * 1.2 : 0.5 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth,
          baseOpacity: blendMode ? 0.35 + depth * 0.5 : 0.3 + depth * 0.7,
        });
      }
    };

    const initNebulaClouds = () => {
      if (!showNebula || (!themeConfig.nebulaColors && !themeConfig.galaxyColors)) {
        nebulaCloudsRef.current = [];
        return;
      }

      const cloudCount = theme.startsWith('nebula') ? 8 : 12;
      nebulaCloudsRef.current = [];
      const colors = theme.startsWith('nebula') ? themeConfig.nebulaColors : themeConfig.galaxyColors;
      const colorCount = colors?.length || 4;

      for (let i = 0; i < cloudCount; i++) {
        nebulaCloudsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 180 + Math.random() * 280,
          opacity: (0.10 + Math.random() * 0.18) * (blendMode ? 0.45 : 1),
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0004 * (blendMode ? 0.4 : 1),
          pulseOffset: Math.random() * Math.PI * 2,
          colorIndex: Math.floor(Math.random() * colorCount),
        });
      }
    };

    const createShootingStar = () => {
      if (Math.random() < (blendMode ? 0.0008 : 0.002)) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.6;

        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          length: 60 + Math.random() * 100,
          speed: (8 + Math.random() * 6) * (blendMode ? 0.5 : 1),
          opacity: blendMode ? 0.35 : 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const drawNebulaCloud = (cloud, time) => {
      const colors = theme.startsWith('nebula') ? themeConfig.nebulaColors : themeConfig.galaxyColors;
      if (!colors) return;

      const pulse = Math.sin(time * 0.5 + cloud.pulseOffset) * 0.1 + 1;
      const currentRadius = cloud.radius * pulse;

      const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, currentRadius);

      const color1 = colors[cloud.colorIndex].replace('{a}', String(cloud.opacity * 0.32));
      const color2 = colors[(cloud.colorIndex + 1) % colors.length].replace('{a}', String(cloud.opacity * 0.14));
      const color3 = colors[(cloud.colorIndex + 2) % colors.length].replace('{a}', '0');

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

      const colors = star.depth > 0.7 ? themeConfig.starColors.bright : themeConfig.starColors.dim;

      gradient.addColorStop(0, colors[0].replace('{a}', String(opacity)));
      gradient.addColorStop(0.3, colors[1].replace('{a}', String(opacity * 0.6)));
      gradient.addColorStop(1, colors[2].replace('{a}', '0'));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star.depth > 0.85) {
        ctx.fillStyle = themeConfig.starColors.bright[0].replace('{a}', String(opacity * 0.6));
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

      const colors = themeConfig.shootingStarColors;
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

      ctx.fillStyle = blendMode ? '#090a0f' : themeConfig.backgroundColor;
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

      ctx.fillStyle = blendMode ? '#090a0f' : themeConfig.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const driftMultiplier = blendMode ? 0.35 : 1;

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

      const velMultiplier = blendMode ? 0.4 : 1;

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

    window.addEventListener('resize', onResize, { passive: true });
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme, showNebula, blendMode]);

  return <canvas key={`${theme}-${showNebula}-${blendMode}`} ref={canvasRef} className="space-background" aria-hidden="true" />;
}

export default SpaceBackground;
