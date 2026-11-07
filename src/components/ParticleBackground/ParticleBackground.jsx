import { useEffect, useRef } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { hexToRgb } from '../../utils/colors';
import './ParticleBackground.css';

const MAX_PARTICLES = 130;
const MAX_CANVAS_PIXELS = 8_000_000;
const MAX_PIXEL_RATIO = 1.5;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getParticleCount(width, height) {
  const area = width * height;
  if (width < 600) return Math.round(clamp(area / 11_000, 20, 45));
  if (width < 1024) return Math.round(clamp(area / 11_000, 45, 80));
  return Math.round(clamp(area / 11_000, 80, MAX_PARTICLES));
}

function createParticle(width, height, visible = true) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.2 + Math.random() * 3.4;
  const opacity = 0.42 + Math.random() * 0.38;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 0.75 + Math.random() * 0.9,
    baseOpacity: opacity,
    opacity: visible ? opacity : 0,
    retiring: false,
  };
}

function ParticleBackground() {
  const { primaryColor } = useThemeContext();
  const canvasRef = useRef(null);
  const drawRef = useRef(null);
  const colorRef = useRef(hexToRgb(primaryColor));

  useEffect(() => {
    colorRef.current = hexToRgb(primaryColor);
    drawRef.current?.(0, false);
  }, [primaryColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.('2d', { alpha: true });
    if (!canvas || !context) return undefined;

    const particles = [];
    const size = { width: 0, height: 0, pixelRatio: 1, maxDistance: 120 };
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    let reducedMotion = reducedMotionQuery.matches;
    let animationFrame = null;
    let previousFrameTime = 0;
    let pointerListenerAttached = false;

    const getColor = () => {
      const { r, g, b } = colorRef.current;
      return `${r}, ${g}, ${b}`;
    };

    const resize = (width, height) => {
      const nextWidth = Math.max(1, width);
      const nextHeight = Math.max(1, height);
      const previousWidth = size.width;
      const previousHeight = size.height;
      const cssPixelCount = nextWidth * nextHeight;
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_PIXEL_RATIO,
        Math.sqrt(MAX_CANVAS_PIXELS / cssPixelCount),
      );

      size.width = nextWidth;
      size.height = nextHeight;
      size.pixelRatio = pixelRatio;
      size.maxDistance = clamp(Math.min(nextWidth, nextHeight) * 0.16, 90, 150);

      canvas.width = Math.max(1, Math.round(nextWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(nextHeight * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (previousWidth && previousHeight) {
        const scaleX = nextWidth / previousWidth;
        const scaleY = nextHeight / previousHeight;
        particles.forEach((particle) => {
          particle.x *= scaleX;
          particle.y *= scaleY;
        });
      }

      const targetCount = getParticleCount(nextWidth, nextHeight);
      if (!previousWidth || !previousHeight) {
        for (let index = 0; index < targetCount; index += 1) {
          particles.push(createParticle(nextWidth, nextHeight, reducedMotion));
        }
      } else {
        const activeParticles = particles.filter((particle) => !particle.retiring);
        if (activeParticles.length > targetCount) {
          activeParticles.slice(targetCount).forEach((particle) => {
            particle.retiring = true;
          });
        } else if (activeParticles.length < targetCount) {
          let remaining = targetCount - activeParticles.length;
          particles
            .filter((particle) => particle.retiring)
            .slice(0, remaining)
            .forEach((particle) => {
              particle.retiring = false;
              particle.opacity = reducedMotion ? particle.baseOpacity : 0;
              remaining -= 1;
            });
          while (remaining > 0) {
            particles.push(createParticle(nextWidth, nextHeight, reducedMotion));
            remaining -= 1;
          }
        }
      }

      drawRef.current?.(0, false);
    };

    const draw = (deltaSeconds = 0, advance = false, elapsedSeconds = 0) => {
      if (!size.width || !size.height) return;

      context.clearRect(0, 0, size.width, size.height);

      if (advance) {
        const pointerEase = 1 - Math.exp(-deltaSeconds * 10);
        pointer.x += (pointer.targetX - pointer.x) * pointerEase;
        pointer.y += (pointer.targetY - pointer.y) * pointerEase;
      } else if (reducedMotion) {
        pointer.active = false;
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        if (!advance) {
          if (particle.retiring) {
            particles.splice(index, 1);
            continue;
          }
          if (reducedMotion) particle.opacity = particle.baseOpacity;
        } else {
          const targetOpacity = particle.retiring ? 0 : particle.baseOpacity;
          const opacityEase = 1 - Math.exp(-deltaSeconds * 3.2);
          particle.opacity += (targetOpacity - particle.opacity) * opacityEase;

          if (particle.opacity < 0.005 && particle.retiring) {
            particles.splice(index, 1);
            continue;
          }

          particle.x += particle.vx * deltaSeconds;
          particle.y += particle.vy * deltaSeconds;

          if (pointer.active && !reducedMotion) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 135 && distance > 0) {
              const influence = 1 - distance / 135;
              particle.x += dx * influence * 0.012 * deltaSeconds;
              particle.y += dy * influence * 0.012 * deltaSeconds;
            }
          }

          const edgeX = Math.max(particle.radius, size.width - particle.radius);
          const edgeY = Math.max(particle.radius, size.height - particle.radius);
          if (particle.x < particle.radius || particle.x > edgeX) {
            particle.vx *= -1;
            particle.x = clamp(particle.x, particle.radius, edgeX);
          }
          if (particle.y < particle.radius || particle.y > edgeY) {
            particle.vy *= -1;
            particle.y = clamp(particle.y, particle.radius, edgeY);
          }
        }
      }

      const rgb = getColor();
      context.lineWidth = 0.7;
      context.lineCap = 'round';

      for (let first = 0; first < particles.length; first += 1) {
        const particleA = particles[first];
        if (particleA.opacity <= 0.005) continue;

        for (let second = first + 1; second < particles.length; second += 1) {
          const particleB = particles[second];
          if (particleB.opacity <= 0.005) continue;

          const dx = particleB.x - particleA.x;
          const dy = particleB.y - particleA.y;
          const distanceSquared = dx * dx + dy * dy;
          const maxDistanceSquared = size.maxDistance * size.maxDistance;
          if (distanceSquared >= maxDistanceSquared) continue;

          const distanceRatio = Math.sqrt(distanceSquared) / size.maxDistance;
          let opacity = (1 - distanceRatio) * 0.2;

          if (advance) {
            const pulse = 0.94 + Math.sin(elapsedSeconds * 0.45 + first * 1.7 + second) * 0.06;
            opacity *= pulse;
          }

          if (pointer.active && !reducedMotion) {
            const midpointX = (particleA.x + particleB.x) / 2;
            const midpointY = (particleA.y + particleB.y) / 2;
            const cursorDistance = Math.hypot(pointer.x - midpointX, pointer.y - midpointY);
            const cursorInfluence = clamp(1 - cursorDistance / 150, 0, 1);
            opacity *= 1 + cursorInfluence * 0.45;
          }

          context.beginPath();
          context.moveTo(particleA.x, particleA.y);
          context.lineTo(particleB.x, particleB.y);
          context.strokeStyle = `rgba(${rgb}, ${opacity})`;
          context.stroke();
        }
      }

      context.fillStyle = `rgb(${rgb})`;
      particles.forEach((particle) => {
        if (particle.opacity <= 0.005) return;

        let opacity = particle.opacity;
        if (pointer.active && !reducedMotion) {
          const cursorDistance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);
          opacity *= 1 + clamp(1 - cursorDistance / 140, 0, 1) * 0.25;
        }

        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    };

    drawRef.current = draw;

    const frame = (timestamp) => {
      animationFrame = null;
      if (document.hidden || reducedMotion) return;

      const deltaSeconds = previousFrameTime
        ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
        : 1 / 60;
      previousFrameTime = timestamp;
      draw(deltaSeconds, true, timestamp / 1000);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      previousFrameTime = 0;
    };

    const startAnimation = () => {
      if (animationFrame === null && !reducedMotion && !document.hidden) {
        animationFrame = window.requestAnimationFrame(frame);
      }
    };

    const handlePointerMove = (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const syncPointerListener = () => {
      const shouldListen = finePointerQuery.matches && !reducedMotion;
      if (shouldListen && !pointerListenerAttached) {
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', handlePointerLeave);
        pointerListenerAttached = true;
      } else if (!shouldListen && pointerListenerAttached) {
        window.removeEventListener('pointermove', handlePointerMove);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
        pointerListenerAttached = false;
        pointer.active = false;
      }
    };

    const handleReducedMotionChange = (event) => {
      reducedMotion = event.matches;
      syncPointerListener();
      if (reducedMotion) {
        stopAnimation();
        draw(0, false);
      } else {
        previousFrameTime = 0;
        startAnimation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        draw(0, false);
        startAnimation();
      }
    };

    const rect = canvas.getBoundingClientRect();
    resize(rect.width || window.innerWidth, rect.height || window.innerHeight);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) resize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(canvas);
    }

    const handleWindowResize = () => {
      const bounds = canvas.getBoundingClientRect();
      resize(bounds.width || window.innerWidth, bounds.height || window.innerHeight);
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });
    reducedMotionQuery.addEventListener?.('change', handleReducedMotionChange);
    finePointerQuery.addEventListener?.('change', syncPointerListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    syncPointerListener();
    if (!reducedMotion) startAnimation();

    return () => {
      stopAnimation();
      if (pointerListenerAttached) {
        window.removeEventListener('pointermove', handlePointerMove);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      window.removeEventListener('resize', handleWindowResize);
      reducedMotionQuery.removeEventListener?.('change', handleReducedMotionChange);
      finePointerQuery.removeEventListener?.('change', syncPointerListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver?.disconnect();
      drawRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />;
}

export default ParticleBackground;
