import type { Dispatch, SetStateAction } from 'react';
import type { AnimationState } from '../types/common';

/**
 * Checks if the user has enabled reduced motion preference in their system settings
 *
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * if (prefersReducedMotion()) {
 *   // Skip or simplify animations
 * }
 * ```
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generates a CSS transition property string for multiple properties
 *
 * @param {string[]} properties - Array of CSS properties to animate (e.g., ['opacity', 'transform'])
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - CSS timing function (e.g., 'ease', 'ease-in-out')
 * @param {number} [delay=0] - Delay before animation starts in milliseconds
 * @returns {string} CSS transition property value
 *
 * @example
 * ```tsx
 * const transition = generateTransition(['opacity', 'transform'], 500, 'ease-out', 200);
 * // Returns: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms"
 * ```
 */
export const generateTransition = (
  properties: string[],
  duration: number,
  easing: string,
  delay: number = 0
): string => {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
};

/**
 * Schedules the animation completion callback and state update
 *
 * @param {React.RefObject<number | null>} timerRef - Ref to store the timeout ID for cleanup
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} delay - Delay before animation starts in milliseconds
 * @param {(() => void) | undefined} onComplete - Optional callback to execute when animation completes
 * @param {Dispatch<SetStateAction<AnimationState>>} setState - Function to update animation state
 *
 * @example
 * ```tsx
 * const timerRef = useRef<number | null>(null);
 * const [state, setState] = useState<AnimationState>('idle');
 *
 * scheduleAnimationComplete(timerRef, 500, 0, () => console.log('Done!'), setState);
 * ```
 */
export const scheduleAnimationComplete = (
  timerRef: React.RefObject<number | null>,
  duration: number,
  delay: number,
  onComplete: (() => void) | undefined,
  setState: Dispatch<SetStateAction<AnimationState>>
) => {
  timerRef.current = setTimeout(() => {
    setState('complete');
    onComplete?.();
  }, duration + delay);
};

/**
 * Determines if animation should be skipped based on user's motion preferences
 *
 * @param {boolean} respectMotionPreference - Whether to respect user's motion preferences
 * @param {boolean} prefersReducedMotion - Whether user prefers reduced motion
 * @returns {boolean} True if animation should be skipped, false otherwise
 *
 * @example
 * ```tsx
 * if (shouldSkipAnimation(respectMotionPreference, prefersReducedMotion())) {
 *   // Skip animation and show final state
 *   setAnimationState('complete');
 * }
 * ```
 */
export const shouldSkipAnimation = (
  respectMotionPreference: boolean,
  prefersReducedMotion: boolean
): boolean => {
  return respectMotionPreference && prefersReducedMotion;
};
