/**
 * Animation Configuration Constants & Utilities
 * Inspired by Aalto University, Apple, Stripe, and Linear design systems.
 * Provides subtle, elegant, and minimal animation standards.
 */

// SSR safe check
export const isBrowser = typeof window !== 'undefined';

/**
 * Standard animation durations (in seconds)
 */
export const DURATIONS = {
  short: 0.35,      // Snappy micro-interactions, hover states, icons
  default: 0.65,    // Standard reveals, fades, slides
  long: 1.1,        // Large transitions, parallax movements
  extraLong: 1.8    // Very slow atmospheric effects
};

/**
 * Standard elegant easing curves (GSAP friendly formats)
 */
export const EASINGS = {
  // Apple / Stripe style custom bezier curves (or GSAP presets)
  appleEase: 'power3.out',                      // Clean, premium decelerating feel
  stripeEase: 'power4.out',                      // Clean, premium decelerating feel
  linear: 'none',                               // Linear curves (perfect for scrubbed scroll-triggers)
  easeOutPower4: 'power4.out',                  // Sleek, heavy reveal entry
  easeInOutPower3: 'power3.inOut',              // Controlled internal state updates
  smoothReveal: 'power2.out'                    // Gentle, natural text reveals
};

/**
 * Standard stagger delay presets (in seconds)
 */
export const DELAYS = {
  none: 0,
  stagger: 0.05,    // Stagger for individual letters/words
  short: 0.1,       // Stagger for list items, cards
  medium: 0.2,
  long: 0.4
};

/**
 * Helper to check if the user prefers reduced motion.
 * @returns {boolean} True if reduced motion is preferred or requested.
 */
export const shouldReduceMotion = () => {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
