import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, DELAYS, shouldReduceMotion, isBrowser } from './animationConfig';

// Register ScrollTrigger plugin if in browser environment
if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Common configuration wrapper to handle ScrollTrigger options.
 * @private
 */
const getScrollTriggerVars = (element, scrollOptions) => {
  if (!scrollOptions) return null;

  return {
    trigger: element,
    start: 'top 85%', // Triggers when the top of the element hits 85% of the viewport height
    toggleActions: 'play none none none',
    ...scrollOptions
  };
};

/**
 * Base animation wrapper that handles Reduced Motion automatically.
 * @private
 */
const runAnimation = (element, fromVars, toVars, options = {}) => {
  if (!isBrowser || !element) return null;

  const isReduced = shouldReduceMotion();
  const delay = options.delay ?? DELAYS.none;
  const duration = isReduced ? 0.001 : (options.duration ?? DURATIONS.default);
  const ease = isReduced ? 'none' : (options.ease ?? EASINGS.appleEase);

  // If reduced motion, remove movement properties from animation
  const cleanFromVars = { ...fromVars };
  const cleanToVars = { ...toVars };

  if (isReduced) {
    const movementProps = ['x', 'y', 'z', 'scale', 'rotation', 'skewX', 'skewY', 'clipPath'];
    movementProps.forEach(prop => {
      delete cleanFromVars[prop];
      delete cleanToVars[prop];
    });
    // Just fade in quickly or snap instantly
    cleanFromVars.opacity = cleanFromVars.opacity ?? 0;
    cleanToVars.opacity = 1;
  }

  // Handle ScrollTrigger options
  const scrollTrigger = getScrollTriggerVars(element, options.scrollOptions);

  const tweenVars = {
    ...cleanToVars,
    duration,
    delay,
    ease,
    scrollTrigger,
    clearProps: 'opacity,transform',
    onComplete: options.onComplete
  };

  if (Object.keys(cleanFromVars).length > 0) {
    return gsap.fromTo(element, cleanFromVars, tweenVars);
  } else {
    return gsap.to(element, tweenVars);
  }
};

/**
 * Fade helper
 * Fades an element in gently.
 */
export const animateFade = (element, options = {}) => {
  return runAnimation(
    element,
    { opacity: 0 },
    { opacity: 1 },
    options
  );
};

/**
 * Slide helper
 * Fades and slides an element from a direction.
 */
export const animateSlide = (element, options = {}) => {
  const direction = options.direction || 'up'; // 'up', 'down', 'left', 'right'
  const distance = options.distance || 40;

  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return runAnimation(
    element,
    { opacity: 0, ...offsets[direction] },
    { opacity: 1, x: 0, y: 0 },
    options
  );
};

/**
 * Scale helper
 * Fades and scales an element (usually scaling up slightly for an elegant entry).
 */
export const animateScale = (element, options = {}) => {
  const startScale = options.startScale ?? 0.95;
  return runAnimation(
    element,
    { opacity: 0, scale: startScale },
    { opacity: 1, scale: 1 },
    options
  );
};

/**
 * Reveal helper
 * Uses clip-path or masks to gracefully reveal elements.
 */
export const animateReveal = (element, options = {}) => {
  const direction = options.direction || 'tb'; // 'tb' (top-to-bottom), 'lr' (left-to-right)
  
  const clipPaths = {
    tb: {
      from: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    },
    lr: {
      from: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    }
  };

  const selectedPath = clipPaths[direction] || clipPaths.tb;

  return runAnimation(
    element,
    { clipPath: selectedPath.from },
    { clipPath: selectedPath.to },
    {
      ease: EASINGS.stripeEase,
      duration: DURATIONS.long,
      ...options
    }
  );
};

/**
 * Stagger helper
 * Animates a list of children elements.
 */
export const animateStagger = (elements, options = {}) => {
  if (!isBrowser || !elements || elements.length === 0) return null;

  const isReduced = shouldReduceMotion();
  const staggerValue = options.stagger ?? DELAYS.stagger;
  const duration = isReduced ? 0.001 : (options.duration ?? DURATIONS.default);
  const ease = isReduced ? 'none' : (options.ease ?? EASINGS.appleEase);
  const direction = options.direction || 'up';
  const distance = options.distance || 30;

  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  const scrollTrigger = getScrollTriggerVars(elements[0], options.scrollOptions);

  const cleanFromVars = isReduced 
    ? { opacity: 0 } 
    : { opacity: 0, ...offsets[direction] };

  const cleanToVars = isReduced
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 };

  return gsap.fromTo(elements, 
    cleanFromVars,
    {
      ...cleanToVars,
      duration,
      stagger: isReduced ? 0 : staggerValue,
      ease,
      scrollTrigger,
      clearProps: 'opacity,transform',
      delay: options.delay ?? DELAYS.none,
      onComplete: options.onComplete
    }
  );
};

/**
 * Parallax helper
 * Binds element movement to the scrollbar scrub.
 */
export const animateParallax = (element, options = {}) => {
  if (!isBrowser || !element) return null;
  if (shouldReduceMotion()) return null; // Disable parallax for reduced motion

  const yPercent = options.yPercent || 20; // Percentage of height to move

  return gsap.fromTo(element,
    { yPercent: -yPercent / 2 },
    {
      yPercent: yPercent / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        ...options.scrollOptions
      }
    }
  );
};

/**
 * Text Reveal helper
 * Reveals text line by line or word by word.
 */
export const animateTextReveal = (element, options = {}) => {
  if (!isBrowser || !element) return null;

  // Expects elements inside the container to be structured for character/word reveal (e.g. spans)
  // Or targets the container directly for a mask reveal
  const target = options.targetSelector 
    ? element.querySelectorAll(options.targetSelector) 
    : element;

  return runAnimation(
    target,
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1 },
    {
      ease: EASINGS.smoothReveal,
      duration: DURATIONS.default,
      stagger: options.stagger ?? 0.03,
      ...options
    }
  );
};

/**
 * Image Reveal helper
 * Premium reveal effect combining clip-path and slight zoom/scale.
 */
export const animateImageReveal = (containerElement, imageElement, options = {}) => {
  if (!isBrowser || !containerElement || !imageElement) return null;
  if (shouldReduceMotion()) {
    return animateFade(containerElement, options);
  }

  const scrollTrigger = getScrollTriggerVars(containerElement, {
    trigger: containerElement,
    start: 'top 80%',
    toggleActions: 'play none none none',
    ...options.scrollOptions
  });
  
  const tl = gsap.timeline({ scrollTrigger });

  // Slide/clip reveal on the parent container
  tl.fromTo(containerElement,
    { clipPath: 'inset(0% 0% 100% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: options.duration ?? 1.4,
      ease: 'power2.out',
      clearProps: 'clipPath'
    }
  );

  // Gentle scale zoom out on the image inside
  tl.fromTo(imageElement,
    { scale: 1.15 },
    {
      scale: 1,
      duration: options.duration ?? 1.4,
      ease: 'power2.out',
      clearProps: 'scale'
    },
    '<' // Run concurrently with the container clip reveal
  );

  return tl;
};
