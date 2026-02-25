import React, { useEffect, useRef, useState } from 'react';
import type {
  AnimationState,
  BaseAnimationProps,
} from '../../lib/types/common';
import { mergeRefs } from '../../lib/utils/refs';
import {
  prefersReducedMotion,
  scheduleAnimationComplete,
} from '../../lib/utils/animation';

/**
 * Props for the ScaleIn animation component
 * @interface ScaleInProps
 * @extends {BaseAnimationProps}
 *
 * @property {number} [from=0.9] - Initial scale value (0-1+, where 1 is original size)
 * @property {number} [to=1] - Final scale value (0-1+, where 1 is original size)
 * @property {string} [transformOrigin='center'] - CSS transform-origin value (e.g., 'center', 'top left', '50% 50%')
 * @property {boolean} [fade=false] - Whether to fade in while scaling
 */
export interface ScaleInProps extends BaseAnimationProps {
  scaleFrom?: number;
  scaleTo?: number;
  transformOrigin?: string;
  fade?: boolean;
}

/**
 * ScaleIn - A component that animates an element's scale from one value to another
 *
 * This component uses the Web Animations API to create smooth scale effects with support for:
 * - Customizable initial and final scale values
 * - Configurable transform origin (scale from any point)
 * - Optional fade effect during scaling
 * - Customizable duration, delay, and timing functions
 * - Accessibility (respects prefers-reduced-motion)
 * - Ref forwarding
 * - Completion callbacks
 *
 * @component
 * @param {ScaleInProps} props - Component props
 *
 * @example
 * ```tsx
 * // Basic usage - scales from 0.9 to 1
 * <ScaleIn>
 *   <div>Hello World</div>
 * </ScaleIn>
 *
 * // Scale from 0 (invisible) to full size
 * <ScaleIn scaleFrom={0} scaleTo={1}>
 *   <div>Pop in effect</div>
 * </ScaleIn>
 *
 * // Scale with fade effect
 * <ScaleIn scaleFrom={0.8} fade>
 *   <div>Fade and scale</div>
 * </ScaleIn>
 *
 * // Scale from top-left corner
 * <ScaleIn transformOrigin="top left">
 *   <div>Scales from corner</div>
 * </ScaleIn>
 *
 * // Bounce effect - scale beyond final size
 * <ScaleIn scaleFrom={0.5} scaleTo={1.1} timingFunction="ease-out">
 *   <div>Bouncy entrance</div>
 * </ScaleIn>
 *
 * // With custom timing and callback
 * <ScaleIn
 *   scaleFrom={0.5}
 *   scaleTo={1}
 *   duration={600}
 *   delay={200}
 *   timingFunction="ease-out"
 *   transformOrigin="center"
 *   onAnimationComplete={() => console.log('Animation complete!')}
 * >
 *   <div>Animated Content</div>
 * </ScaleIn>
 *
 * // Respect user's motion preferences
 * <ScaleIn respectMotionPreference>
 *   <div>Accessible animation</div>
 * </ScaleIn>
 *
 * // As a different element with fade
 * <ScaleIn as="button" className="cta-button" fade scaleFrom={0.8}>
 *   Click Me
 * </ScaleIn>
 * ```
 */

export default function ScaleIn({
  as: Component = 'div',
  className,
  children,
  duration = 500,
  delay = 0,
  timingFunction = 'ease',
  scaleFrom = 0.9,
  scaleTo = 1,
  transformOrigin = 'center',
  onAnimationComplete,
  respectMotionPreference = false,
  fade,
  style,
  ref,
  ...props
}: ScaleInProps) {
  const internalRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');

  useEffect(() => {
    if (prefersReducedMotion() && respectMotionPreference) {
      setAnimationState('complete');
      onAnimationComplete?.();
      return;
    }

    setAnimationState('animating');
    const animation = internalRef.current?.animate(
      [
        {
          transform: `scale(${scaleFrom})`,
          transformOrigin,
          opacity: fade ? 0 : 1,
        },
        { transform: `scale(${scaleTo})`, transformOrigin, opacity: 1 },
      ],
      {
        delay,
        duration,
        direction: 'normal',
        easing: timingFunction,
        fill: 'forwards',
      }
    );

    scheduleAnimationComplete(
      timerRef,
      duration,
      delay,
      onAnimationComplete,
      setAnimationState
    );

    return () => {
      animation?.cancel();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    duration,
    delay,
    scaleTo,
    scaleFrom,
    transformOrigin,
    fade,
    timingFunction,
    respectMotionPreference,
    onAnimationComplete,
  ]);

  const mergedRef = mergeRefs(ref, internalRef);

  // Apply initial styles before animation starts, or final styles when animation is skipped
  const initialStyles =
    animationState === 'idle'
      ? {
          transform: `scale(${scaleFrom})`,
          transformOrigin,
          opacity: fade ? 0 : 1,
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
