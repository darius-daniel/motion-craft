import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import type {
  AnimationState,
  BaseAnimationProps,
} from '../../lib/types/common';
import {
  generateTransition,
  prefersReducedMotion,
} from '../../lib/utils/animation';

export interface FadeInProps extends BaseAnimationProps {
  /** Initial and final opacity respectively (0-1) */
  from?: number;
  to?: number;
}

/**
 * FadeIn - Animates opacity from 0 to 1
 *
 * @example
 * ```tsx
 * <FadeIn duration={500} delay={200}>
 *   <div>Hello World</div>
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
