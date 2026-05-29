import { type BaseAnimationProps } from '../../lib/types/common';
import { mergeRefs } from '../../lib/utils/refs';
import useAnimation from '../../hooks/useAnimation';
import React, { useMemo } from 'react';

/**
 * Direction from which the element slides into view
 * @typedef {'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft'} SlideDirection
 */
export type SlideDirection =
  | 'fromTop'
  | 'fromRight'
  | 'fromBottom'
  | 'fromLeft';

/**
 * Props for the SlideIn animation component
 * @interface SlideInProps
 * @extends {BaseAnimationProps}
 *
 * @property {SlideDirection} [slideDirection='fromTop'] - Direction from which to slide in
 * @property {boolean} [fade=false] - Whether to fade in while sliding
 * @property {number} [distance=30] - Distance to slide in pixels
 */
export interface SlideInProps extends BaseAnimationProps {
  slideDirection?: SlideDirection;
  fade?: boolean;
  distance?: number;
}

/**
 * Calculates the initial CSS transform for the slide animation
 *
 * @param {SlideDirection} slideDirection - Direction from which to slide
 * @param {number} distance - Distance to slide in pixels
 * @returns {string} CSS transform value for the initial state
 *
 * @example
 * ```tsx
 * getInitialTransform('fromTop', 30) // Returns: "translateY(-30px)"
 * getInitialTransform('fromLeft', 50) // Returns: "translateX(-50px)"
 * ```
 */
const getInitialTransform = (
  slideDirection: SlideDirection,
  distance: number
): string => {
  switch (slideDirection) {
    case 'fromTop':
      return `translateY(-${distance}px)`;
    case 'fromBottom':
      return `translateY(${distance}px)`;
    case 'fromRight':
      return `translateX(${distance}px)`;
    case 'fromLeft':
      return `translateX(-${distance}px)`;
  }
};

/**
 * Calculates the final CSS transform for the slide animation (resting position)
 *
 * @param {SlideDirection} slideDirection - Direction from which element slid
 * @returns {string} CSS transform value for the final state (always returns to origin)
 *
 * @example
 * ```tsx
 * getFinalTransform('fromTop') // Returns: "translateY(0)"
 * getFinalTransform('fromLeft') // Returns: "translateX(0)"
 * ```
 */
export const getFinalTransform = (slideDirection: SlideDirection): string => {
  return slideDirection.endsWith('Top') || slideDirection.endsWith('Bottom')
    ? 'translateY(0)'
    : 'translateX(0)';
};

/**
 * SlideIn - A component that slides an element into view from a specified direction
 *
 * This component uses the Web Animations API to create smooth slide-in effects with support for:
 * - Four slide directions (top, right, bottom, left)
 * - Optional fade effect during slide
 * - Customizable distance, duration, and timing
 * - Accessibility (respects prefers-reduced-motion)
 * - Ref forwarding
 * - Completion callbacks
 *
 * @component
 * @param {SlideInProps} props - Component props
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SlideIn>
 *   <div>Hello World</div>
 * </SlideIn>
 *
 * // Slide from right with fade
 * <SlideIn slideDirection="fromRight" fade distance={50}>
 *   <div>Animated Content</div>
 * </SlideIn>
 *
 * // With custom timing
 * <SlideIn
 *   slideDirection="fromBottom"
 *   duration={500}
 *   delay={200}
 *   timingFunction="ease-out"
 *   onAnimationComplete={() => console.log('Done!')}
 * >
 *   <div>Content</div>
 * </SlideIn>
 *
 * // As a different element
 * <SlideIn as="section" className="card">
 *   <h2>Card Title</h2>
 * </SlideIn>
 * ```
 */
export default function SlideIn({
  as: Component = 'div',
  className,
  children,
  slideDirection = 'fromTop',
  distance = 30,
  duration = 500,
  delay = 0,
  timingFunction = 'ease',
  onAnimationComplete,
  respectMotionPreference = false,
  style,
  ref,
  fade,
  ...props
}: SlideInProps) {
  const keyframes = useMemo(
    () => [
      {
        transform: getInitialTransform(slideDirection, distance),
        opacity: fade ? 0 : 1,
      },
      { transform: getFinalTransform(slideDirection), opacity: 1 },
    ],
    [slideDirection, distance, fade]
  );

  const { animationState, elementRef: internalRef } = useAnimation({
    keyframes,
    delay,
    duration,
    respectMotionPreference,
    timingFunction,
    onAnimationComplete,
  });

  const mergedRef = mergeRefs(ref, internalRef);

  // Apply initial styles before animation starts, or final styles when animation is skipped
  const initialStyles =
    animationState === 'idle'
      ? {
          transform: getInitialTransform(slideDirection, distance),
          opacity: fade ? 0 : 1,
        }
      : animationState === 'complete'
        ? {
            transform: getFinalTransform(slideDirection),
            opacity: 1,
          }
        : {};

  return React.createElement(
    Component,
    {
      ref: mergedRef,
      className,
      ...props,
      style: {
        ...initialStyles,
        ...style,
      },
    },
    children
  );
}
