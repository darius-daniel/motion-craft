import type React from 'react';

/**
 * Animation state representing the current phase of an animation
 * @typedef {'idle' | 'animating' | 'complete'} AnimationState
 * @property {string} idle - Animation has not started yet
 * @property {string} animating - Animation is currently in progress
 * @property {string} complete - Animation has finished
 */
export type AnimationState = 'idle' | 'animating' | 'complete';
export type CSSTimingFunction =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'step-start'
  | 'step-end';

/**
 * Base props interface for all animation components
 * @interface BaseAnimationProps
 * @extends {React.HTMLAttributes<HTMLElement>}
 *
 * @property {React.ElementType} [as] - The HTML element or React component to render (default: 'div')
 * @property {React.ReactNode} [children] - Child elements to be animated
 * @property {number} [duration] - Animation duration in milliseconds (default: 500)
 * @property {number} [delay] - Delay before animation starts in milliseconds (default: 0)
 * @property {string} [timingFunction] - CSS timing function for the animation
 * @property {() => void} [onAnimationComplete] - Callback fired when animation completes
 * @property {boolean} [respectMotionPreference] - Whether to respect user's reduced motion preference (default: true)
 * @property {React.CSSProperties} [styles] - Additional CSS styles to apply
 * @property {React.RefObject<HTMLElement | null>} [ref] - React ref for the animated element
 *
 * @example
 * ```tsx
 * const props: BaseAnimationProps = {
 *   duration: 500,
 *   delay: 200,
 *   timingFunction: 'ease-out',
 *   onAnimationComplete: () => console.log('Done!')
 * };
 * ```
 */
export interface BaseAnimationProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  timingFunction?: CSSTimingFunction;
  onAnimationComplete?: () => void;
  respectMotionPreference?: boolean;
  styles?: React.CSSProperties;
  ref?: React.RefObject<HTMLElement | null>;
}

/**
 * Predefined easing functions for animations
 * @constant
 * @type {Object}
 *
 * @property {string} ease - Standard ease timing function
 * @property {string} easeIn - Ease-in timing function (slow start)
 * @property {string} easeOut - Ease-out timing function (slow end)
 * @property {string} easeInOut - Ease-in-out timing function (slow start and end)
 * @property {string} linear - Linear timing function (constant speed)
 * @property {string} spring - Spring-like bounce effect using cubic-bezier
 * @property {string} bounce - Bounce effect using cubic-bezier
 *
 * @example
 * ```tsx
 * import { EASING_PRESETS } from './types/common';
 *
 * <FadeIn timingFunction={EASING_PRESETS.spring}>
 *   Content
 * </FadeIn>
 * ```
 */
export const EASING_PRESETS = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;
