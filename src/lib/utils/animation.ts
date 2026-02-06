import type { Dispatch, SetStateAction } from 'react';
import type { AnimationState } from '../types/common';

/* Check if user prefers reduced motion */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/* Generate transition CSS property */
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
 * Schedules animation completion after duration + delay
 * @param timerRef - Ref to store the timeout ID for cleanup
 * @param duration - Animation duration in milliseconds
 * @param delay - Delay before animation starts in milliseconds
 * @param onComplete - Callback to execute when animation completes
 * @param setState - Function to update animation state
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
 * Determines if animation should be skipped based on user preferences (reduced motion)
 * @param respectMotionPreference - Whether to respect user's motion preferences
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns boolean indicating if animation should be skipped
 */
export const shouldSkipAnimation = (
  respectMotionPreference: boolean,
  prefersReducedMotion: boolean
): boolean => {
  return respectMotionPreference && prefersReducedMotion;
};
