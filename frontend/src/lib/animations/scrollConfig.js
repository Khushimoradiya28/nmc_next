import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isBrowser, shouldReduceMotion } from './animationConfig';

/**
 * Configure and initialize smooth scrolling with Lenis and integrate with GSAP ScrollTrigger.
 */
let lenisInstance = null;

/**
 * Initializes Lenis smooth scroll and binds it to GSAP ScrollTrigger.
 * @param {Object} options - Custom Lenis configuration overrides.
 * @returns {Lenis|null} The Lenis instance or null if not in browser or reduced motion is preferred.
 */
export const initSmoothScroll = (options = {}) => {
  if (!isBrowser) return null;

  // Respect prefers-reduced-motion: disable smooth scrolling and fallback to native scroll
  if (shouldReduceMotion()) {
    console.log('Smooth scroll disabled due to prefers-reduced-motion preference.');
    return null;
  }

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Clean up existing instance if any
  if (lenisInstance) {
    destroySmoothScroll();
  }

  // Default smooth settings — quintic ease-out, low lerp for buttery wheel blending
  const defaultOptions = {
    lerp: 0.06,
    duration: 1.8,
    easing: (t) => 1 - Math.pow(1 - t, 5),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothWheel: true,
    wheelMultiplier: 0.7,
    smoothTouch: false,
    syncTouch: false,
    syncTouchLerp: 0.04,
    touchMultiplier: 1.5,
    autoResize: true,
    infinite: false,
    ...options
  };

  lenisInstance = new Lenis(defaultOptions);

  // Connect Lenis scroll events to GSAP ScrollTrigger updates
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Add Lenis to GSAP ticker to run in the same animation frame loop
  gsap.ticker.add(runLenisRaf);

  // Disable lag smoothing in GSAP to prevent desync between ScrollTrigger and Lenis
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
};

// RAF callback helper
const runLenisRaf = (time) => {
  if (lenisInstance) {
    lenisInstance.raf(time * 1000);
  }
};

/**
 * Retrieves the active Lenis instance.
 * @returns {Lenis|null} The current Lenis instance.
 */
export const getLenis = () => lenisInstance;

/**
 * Stops the smooth scroll. Useful during overlays, modals, or loading screens.
 */
export const stopSmoothScroll = () => {
  if (lenisInstance) lenisInstance.stop();
};

/**
 * Starts the smooth scroll after being stopped.
 */
export const startSmoothScroll = () => {
  if (lenisInstance) lenisInstance.start();
};

/**
 * Destroys the Lenis instance and cleans up GSAP ticker bindings.
 */
export const destroySmoothScroll = () => {
  if (lenisInstance) {
    gsap.ticker.remove(runLenisRaf);
    lenisInstance.destroy();
    lenisInstance = null;
  }
};
