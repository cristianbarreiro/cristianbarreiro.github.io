/**
 * Fondo animado tipo “cosmos”: estrellas, parallax, estrellas fugaces y nebulosas.
 * Adaptado desde `space-background-ani/src/components/SpaceBackground.tsx`.
 */

import { useEffect, useRef } from 'react';
import './SpaceBackground.css';

/** @typedef {'space' | 'nebula-purple' | 'nebula-blue' | 'nebula-pink' | 'galaxy-spiral' | 'galaxy-magenta'} BackgroundTheme */

/** @type {Record<BackgroundTheme, { backgroundColor: string; starColors: { bright: string[]; dim: string[] }; shootingStarColors: string[]; nebulaColors?: string[]; galaxyColors?: string[] }>} */
const THEME_CONFIGS = {
  space: {
    backgroundColor: '#0a0a0f',
    starColors: {
      bright: ['rgba(255, 255, 255, {a})', 'rgba(200, 220, 255, {a})', 'rgba(150, 180, 255, {a})'],
      dim: ['rgba(220, 230, 255, {a})', 'rgba(180, 200, 240, {a})', 'rgba(150, 180, 230, {a})'],
    },
    shootingStarColors: ['rgba(255, 255, 255, {a})', 'rgba(200, 220, 255, {a})', 'rgba(150, 180, 255, {a})'],
  },
  'nebula-purple': {
    backgroundColor: '#0d0515',
    starColors: {
      bright: ['rgba(255, 200, 255, {a})', 'rgba(220, 180, 255, {a})', 'rgba(180, 140, 255, {a})'],
      dim: ['rgba(200, 160, 240, {a})', 'rgba(170, 130, 220, {a})', 'rgba(140, 100, 200, {a})'],
    },
    shootingStarColors: ['rgba(255, 200, 255, {a})', 'rgba(220, 180, 255, {a})', 'rgba(180, 140, 255, {a})'],
    nebulaColors: ['rgba(138, 43, 226, {a})', 'rgba(147, 51, 234, {a})', 'rgba(168, 85, 247, {a})', 'rgba(192, 132, 252, {a})'],
  },
  'nebula-blue': {
    backgroundColor: '#020818',
    starColors: {
      bright: ['rgba(200, 240, 255, {a})', 'rgba(180, 220, 255, {a})', 'rgba(140, 200, 255, {a})'],
      dim: ['rgba(160, 200, 240, {a})', 'rgba(130, 180, 220, {a})', 'rgba(100, 160, 200, {a})'],
    },
    shootingStarColors: ['rgba(200, 240, 255, {a})', 'rgba(180, 220, 255, {a})', 'rgba(140, 200, 255, {a})'],
    nebulaColors: ['rgba(37, 99, 235, {a})', 'rgba(59, 130, 246, {a})', 'rgba(96, 165, 250, {a})', 'rgba(147, 197, 253, {a})'],
  },
  'nebula-pink': {
    backgroundColor: '#120510',
    starColors: {
      bright: ['rgba(255, 220, 240, {a})', 'rgba(255, 180, 220, {a})', 'rgba(255, 140, 200, {a})'],
      dim: ['rgba(240, 160, 200, {a})', 'rgba(220, 130, 180, {a})', 'rgba(200, 100, 160, {a})'],
    },
    shootingStarColors: ['rgba(255, 220, 240, {a})', 'rgba(255, 180, 220, {a})', 'rgba(255, 140, 200, {a})'],
    nebulaColors: ['rgba(219, 39, 119, {a})', 'rgba(236, 72, 153, {a})', 'rgba(244, 114, 182, {a})', 'rgba(251, 207, 232, {a})'],
  },
  'galaxy-spiral': {
    backgroundColor: '#050510',
    starColors: {
      bright: ['rgba(255, 240, 220, {a})', 'rgba(255, 220, 200, {a})', 'rgba(255, 200, 180, {a})'],
      dim: ['rgba(240, 200, 180, {a})', 'rgba(220, 180, 160, {a})', 'rgba(200, 160, 140, {a})'],
    },
    shootingStarColors: ['rgba(255, 240, 220, {a})', 'rgba(255, 220, 200, {a})', 'rgba(255, 200, 180, {a})'],
    galaxyColors: ['rgba(139, 92, 246, {a})', 'rgba(167, 139, 250, {a})', 'rgba(196, 181, 253, {a})', 'rgba(221, 214, 254, {a})'],
  },
  'galaxy-magenta': {
    backgroundColor: '#0f0510',
    starColors: {
      bright: ['rgba(255, 200, 255, {a})', 'rgba(255, 150, 220, {a})', 'rgba(220, 100, 200, {a})'],
      dim: ['rgba(240, 160, 200, {a})', 'rgba(220, 130, 180, {a})', 'rgba(200, 100, 160, {a})'],
    },
    shootingStarColors: ['rgba(255, 200, 255, {a})', 'rgba(255, 150, 220, {a})', 'rgba(220, 100, 200, {a})'],
    galaxyColors: ['rgba(192, 38, 211, {a})', 'rgba(217, 70, 239, {a})', 'rgba(232, 121, 249, {a})', 'rgba(250, 204, 21, {a})'],
  },
};

/**
 * @param {object} props
 * @param {BackgroundTheme} [props.theme]
 */
function SpaceBackground({ theme = 'space' }) {
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
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      initNebulaClouds();
    };

    const initStars = () => {
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
      if (!themeConfig.nebulaColors && !themeConfig.galaxyColors) {
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
          radius: 150 + Math.random() * 300,
          opacity: 0.15 + Math.random() * 0.25,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0005,
          pulseOffset: Math.random() * Math.PI * 2,
          colorIndex: Math.floor(Math.random() * colorCount),
        });
      }
    };

    const createShootingStar = () => {
      if (Math.random() < 0.002) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.6;

        shootingStarsRef.current.push({
          x: startX,
          y: startY,
          length: 60 + Math.random() * 100,
          speed: 8 + Math.random() * 6,
          opacity: 1,
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

      const color1 = colors[cloud.colorIndex].replace('{a}', String(cloud.opacity * 0.4));
      const color2 = colors[(cloud.colorIndex + 1) % colors.length].replace('{a}', String(cloud.opacity * 0.2));
      const color3 = colors[(cloud.colorIndex + 2) % colors.length].replace('{a}', '0');

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, color3);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
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

      ctx.fillStyle = themeConfig.backgroundColor;
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

      ctx.fillStyle = themeConfig.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      nebulaCloudsRef.current.forEach((cloud) => {
        cloud.angle += cloud.rotationSpeed;
        cloud.x += Math.cos(cloud.angle) * 0.05;
        cloud.y += Math.sin(cloud.angle) * 0.05;

        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        drawNebulaCloud(cloud, timeRef.current);
      });

      starsRef.current.forEach((star) => {
        star.x -= star.depth * 0.15;
        star.y += star.depth * 0.05;

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

    const onResize = () => {
      resizeCanvas();
      if (reducedMotion) {
        timeRef.current = 0;
        drawFrame();
      }
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
      window.removeEventListener('resize', onResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="space-background" aria-hidden="true" />;
}

export default SpaceBackground;
