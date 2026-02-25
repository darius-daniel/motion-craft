import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import type {
  AnimationState,
  BaseAnimationProps,
} from '../../lib/types/common';
import {
  generateTransition,
  prefersReducedMotion,
} from '../../lib/utils/animation';

/**
 * Props for the FadeIn animation component
 * @interface FadeInProps
 * @extends {BaseAnimationProps}
 *
 * @property {number} [from=0] - Initial opacity value (0-1)
 * @property {number} [to=1] - Final opacity value (0-1)
 */
export interface FadeInProps extends BaseAnimationProps {
  from?: number;
  to?: number;
}

/**
 * FadeIn - A component that animates opacity from one value to another
 *
 * This component provides a smooth fade-in animation with support for:
 * - Customizable duration and delay
 * - Accessibility (respects prefers-reduced-motion)
 * - Custom timing functions
 * - Completion callbacks
 * - Ref forwarding
 *
 * @component
 * @param {FadeInProps} props - Component props
 * @param {React.Ref<HTMLElement>} ref - Forwarded ref to the animated element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FadeIn>
 *   <div>Hello World</div>
 * </FadeIn>
 *
 * // With custom props
 * <FadeIn
 *   duration={500}
 *   delay={200}
 *   from={0}
 *   to={1}
 *   timingFunction="ease-out"
 *   onAnimationComplete={() => console.log('Done!')}
 * >
 *   <div>Animated Content</div>
 * </FadeIn>
 *
 * // As a different element
 * <FadeIn as="section" className="hero">
 *   <h1>Hero Title</h1>
 * </FadeIn>
 * ```
 */
export const FadeIn = React.forwardRef<HTMLElement, FadeInProps>(
  (
    {
      as: Component = 'div',
      duration = 500,
      delay = 0,
      timingFunction = 'ease-out',
      from = 0,
      to = 1,
      onAnimationComplete,
      respectMotionPreference = true,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [animationState, setAnimationState] =
      useState<AnimationState>('idle');
    const elementRef = useRef<HTMLElement>(null);
    const timerRef = useRef<number | null>(null);

    // Merge refs
    const mergedRef = (node: HTMLElement | null) => {
      elementRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<HTMLElement | null>).current = node;
      }
    };

    useEffect(() => {
      // Skip animation if user prefers reduced motion
      if (respectMotionPreference && prefersReducedMotion()) {
        setAnimationState('complete');
        onAnimationComplete?.();
        return;
      }

      // Start animation
      setAnimationState('animating');

      // Complete animation after duration + delay
      timerRef.current = setTimeout(() => {
        setAnimationState('complete');
        onAnimationComplete?.();
      }, duration + delay);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [duration, delay, respectMotionPreference, onAnimationComplete]);

    const shouldAnimate = respectMotionPreference
      ? !prefersReducedMotion()
      : true;

    const animationStyles: CSSProperties = shouldAnimate
      ? {
          opacity: animationState === 'idle' ? from : to,
          transition:
            animationState === 'idle'
              ? 'none'
              : generateTransition(
                  ['opacity'],
                  duration,
                  timingFunction,
                  delay
                ),
        }
      : {
          opacity: to,
        };

    const mergedStyles: CSSProperties = {
      ...animationStyles,
      ...style,
    };

    return React.createElement(
      Component,
      {
        ref: mergedRef,
        className,
        style: mergedStyles,
        ...props,
      },
      children
    );
  }
);

FadeIn.displayName = 'FadeIn';
