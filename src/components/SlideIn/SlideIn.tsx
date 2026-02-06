import React, { useEffect, useRef, useState } from 'react';
import {
  type AnimationState,
  type BaseAnimationProps,
} from '../../lib/types/common';
import {
  prefersReducedMotion,
  scheduleAnimationComplete,
  shouldSkipAnimation,
} from '../../lib/utils/animation';
import { mergeRefs } from '../../lib/utils/refs';

export type SlideDirection =
  | 'fromTop'
  | 'fromRight'
  | 'fromBottom'
  | 'fromLeft';

export interface SlideInProps extends BaseAnimationProps {
  slideDirection?: SlideDirection; // direction to slide in from
  fade?: boolean; // Whether to fade in while sliding in
  distance?: number; // distance to slide (px)
}

/**
 *
 * @param slideDirection Direction to slide the component from
 * @param distance Distance to slide the component (px)
 * @returns transform for the initial animation keyframe
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
 * getFinalTransform - generates the transform for the final state of the animation keyframe
 * @param slideDirection Direction to slide the component from
 * @returns final transform for the animation keyframe
 */
export const getFinalTransform = (slideDirection: SlideDirection) => {
  return slideDirection.endsWith('Top') || slideDirection.endsWith('Bottom')
    ? 'translateY(0)'
    : 'translateX(0)';
};

/**
 * SlideIn - slides an element or component into view
 *
 * @param as
 * @param className
 * @param children
 * @param slideDirection
 * @param distance
 * @param duration
 * @param delay
 * @param timingFunction
 * @param onAnimationComplete
 * @param respectMotionPreference
 * @param style
 * @param ref
 * @param fade
 *
 * @example
 * ```tsx
 * <SlideIn duration={500} delay={200}>
 *   <div>Hello World</div>
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
  const internalRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');

  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (shouldSkipAnimation(respectMotionPreference, prefersReducedMotion())) {
      setAnimationState('complete');
      onAnimationComplete?.();
      return;
    }

    setAnimationState('animating');
    const animation = internalRef.current?.animate(
      [
        {
          transform: getInitialTransform(slideDirection, distance),
          opacity: fade ? 0 : 1,
        },
        { transform: getFinalTransform(slideDirection), opacity: 1 },
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
    distance,
    slideDirection,
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
