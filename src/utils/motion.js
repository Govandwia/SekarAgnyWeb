import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Duration helper that respects prefers-reduced-motion. */
export const dur = (d) => (REDUCED ? 0 : d);

// Easings used all over the reference: long exponential in/out.
export const EASE_OUT = 'expo.out';
export const EASE_INOUT = 'expo.inOut';

export { gsap, ScrollTrigger, SplitText };
