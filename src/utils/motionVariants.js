/**
 * motionVariants.js
 * Sistema centralizado de variantes y constantes de animación
 * para scroll-triggered animations en todo el portfolio.
 *
 * Uso:
 *   import { sectionHeader, staggerContainer, cardItem } from '../utils/motionVariants';
 *   <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" ...>
 *     <motion.div variants={cardItem}>...</motion.div>
 *   </motion.div>
 */

// ── Timing constants ────────────────────────────────────────────
export const EASE_OUT = [0.25, 0.1, 0.25, 1.0];
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1];

export const DURATION = {
  fast: 0.35,
  normal: 0.5,
  slow: 0.6,
};

export const STAGGER = {
  tight: 0.06,
  normal: 0.08,
  relaxed: 0.12,
};

// ── Viewport defaults ───────────────────────────────────────────
export const VIEWPORT_ONCE = { once: true, amount: 0.2 };
export const VIEWPORT_SMALL = { once: true, amount: 0.1 };

// ── Element variants ────────────────────────────────────────────

/**
 * Fade up — default reveal for most elements
 * @param {number} [delay=0] - delay before animation starts
 * @param {number} [y=20] - vertical offset in px
 * @param {number} [duration=DURATION.normal] - animation duration
 */
export const fadeUp = (delay = 0, y = 20, duration = DURATION.normal) => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE_OUT, delay },
  },
});

/**
 * Fade down — for elements entering from above
 */
export const fadeDown = (delay = 0, y = -20, duration = DURATION.normal) => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE_OUT, delay },
  },
});

/**
 * Fade in from the left
 */
export const fadeLeft = (delay = 0, x = -24, duration = DURATION.normal) => ({
  hidden: { opacity: 0, x },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease: EASE_OUT, delay },
  },
});

/**
 * Fade in from the right
 */
export const fadeRight = (delay = 0, x = 24, duration = DURATION.normal) => ({
  hidden: { opacity: 0, x },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, ease: EASE_OUT, delay },
  },
});

/**
 * Pure fade (no translation)
 */
export const fadeOnly = (delay = 0, duration = DURATION.normal) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, ease: EASE_OUT, delay },
  },
});

/**
 * Scale X for accent lines/dividers
 */
export const scaleX = (delay = 0.2, duration = DURATION.slow) => ({
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration, ease: EASE_OUT_QUART, delay },
  },
});

// ── Container variants (for stagger orchestration) ──────────────

/**
 * Stagger container — orchestrates staggered children
 * @param {number} [stagger=STAGGER.normal] - delay between children
 * @param {number} [delay=0] - delay before stagger starts
 */
export const staggerContainer = (stagger = STAGGER.normal, delay = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

// ── Preset child variants ───────────────────────────────────────

/** Standard card reveal — used inside stagger containers */
export const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT },
  },
};

/** List item reveal — slightly faster for dense content */
export const listItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  },
};

// ── Reduced motion utilities ────────────────────────────────────

/**
 * Check if user prefers reduced motion.
 * Safe for SSR (returns false if window is unavailable).
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns instant-show variants when reduced motion is preferred,
 * otherwise returns the provided variants.
 * @param {object} variants - the motion variants to use
 */
export const safeVariants = (variants) => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  return variants;
};
