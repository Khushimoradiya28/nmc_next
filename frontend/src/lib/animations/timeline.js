import { gsap } from 'gsap';
import { EASINGS, DURATIONS, shouldReduceMotion } from './animationConfig';

/**
 * Creates a GSAP timeline with predefined elegant defaults.
 * Automatically respects reduced motion settings by speeding up the timeline to feel instant,
 * or overriding duration and easing settings.
 * 
 * @param {gsap.TimelineVars} vars - GSAP timeline config object
 * @returns {gsap.core.Timeline} GSAP Timeline instance
 */
export const createTimeline = (vars = {}) => {
  const isReduced = shouldReduceMotion();

  const mergedDefaults = {
    duration: isReduced ? 0.001 : DURATIONS.default,
    ease: isReduced ? 'none' : EASINGS.appleEase,
    ...vars.defaults
  };

  const timeline = gsap.timeline({
    ...vars,
    defaults: mergedDefaults
  });

  // If reduced motion is preferred, speed up timeline to run instantly (effectively no animation)
  if (isReduced) {
    timeline.timeScale(1000);
  }

  return timeline;
};

/**
 * Creates a scroll-bound timeline (ScrollTrigger timeline) with custom scroll controls.
 * @param {Object} scrollTriggerVars - GSAP ScrollTrigger configuration
 * @param {gsap.TimelineVars} vars - Timeline configuration
 * @returns {gsap.core.Timeline} GSAP Timeline bound to ScrollTrigger
 */
export const createScrollTimeline = (scrollTriggerVars = {}, vars = {}) => {
  const isReduced = shouldReduceMotion();

  // If reduced motion, we should disable scrub or match immediately
  const triggerDefaults = {
    scrub: isReduced ? false : true,
    invalidateOnRefresh: true,
    ...scrollTriggerVars
  };

  const mergedDefaults = {
    duration: isReduced ? 0.001 : DURATIONS.default,
    ease: isReduced ? 'none' : EASINGS.linear, // Scroll bound timelines usually want linear easing
    ...vars.defaults
  };

  const timeline = gsap.timeline({
    ...vars,
    scrollTrigger: triggerDefaults,
    defaults: mergedDefaults
  });

  if (isReduced) {
    timeline.timeScale(1000);
  }

  return timeline;
};
