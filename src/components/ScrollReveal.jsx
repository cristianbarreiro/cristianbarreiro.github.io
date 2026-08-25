/**
 * ScrollReveal
 * Componente wrapper reutilizable para scroll-triggered animations.
 *
 * Envuelve cualquier contenido con una animación de entrada que se activa
 * cuando el elemento entra al viewport. Respeta prefers-reduced-motion.
 *
 * Props:
 * @param {'up'|'down'|'left'|'right'|'none'} [direction='up'] - Dirección de entrada
 * @param {number} [delay=0] - Delay en segundos antes de iniciar la animación
 * @param {number} [duration] - Duración de la animación (default según direction)
 * @param {number} [distance] - Distancia de desplazamiento en px (default 20)
 * @param {number} [amount=0.2] - Porcentaje del elemento visible para trigger (0–1)
 * @param {boolean} [once=true] - Si la animación ocurre solo una vez
 * @param {string} [className] - Clase CSS adicional
 * @param {object} [style] - Estilos inline adicionales
 * @param {React.ReactNode} children - Contenido a animar
 */

import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE_OUT } from '../utils/motionVariants';

const MotionDiv = motion.div;

/**
 * Genera variantes según la dirección solicitada
 */
function getVariants(direction, distance, duration, delay) {
  const d = duration ?? DURATION.normal;

  const base = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: d, ease: EASE_OUT, delay },
    },
  };

  switch (direction) {
    case 'down':
      return { hidden: { opacity: 0, y: -distance }, ...base };
    case 'left':
      return { hidden: { opacity: 0, x: distance }, ...base };
    case 'right':
      return { hidden: { opacity: 0, x: -distance }, ...base };
    case 'none':
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: d, ease: EASE_OUT, delay },
        },
      };
    case 'up':
    default:
      return { hidden: { opacity: 0, y: distance }, ...base };
  }
}

function ScrollReveal({
  direction = 'up',
  delay = 0,
  duration,
  distance = 20,
  amount = 0.2,
  once = true,
  className,
  style,
  children,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Si prefers-reduced-motion está activo, renderizar sin animación
  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const variants = getVariants(direction, distance, duration, delay);

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
      style={style}
    >
      {children}
    </MotionDiv>
  );
}

export default ScrollReveal;
