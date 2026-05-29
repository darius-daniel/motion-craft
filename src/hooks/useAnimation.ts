'use client';

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import {
  type AnimationState,
  type CSSTimingFunction,
} from '../lib/types/common';
import {
  prefersReducedMotion,
  scheduleAnimationComplete,
} from '../lib/utils/animation';

/**
 * The useAnimation hook return value properties
 *  @property
 *  animationState - the current state of the animation
 *  @property
 *  setAnimationState - function to set the animation state
 *  @property
 *  elementRef - ref to the element being animated
 *  @property
 *  shouldAnimate - boolean indicating if the animation should run
 *  @property
 *  pauseAnimation - function to pause the animation
 *  @property
 *  resumeAnimation - function to resume the animation
 *  @property
 *  cancelAnimation - function to cancel the animation
 */
export type AnimationController = {
  animationState: AnimationState;
  setAnimationState: Dispatch<SetStateAction<AnimationState>>;
  elementRef: RefObject<HTMLElement | null>;
  shouldAnimate: boolean;
  pauseAnimation: VoidFunction;
  resumeAnimation: VoidFunction;
  cancelAnimation: VoidFunction;
};

/**
 * The input parameters for the useAnimation hook
 * @property {Keyframe[]} keyframes - array of keyframes to animate
 * @property {number} duration - duration of the animation
 * @property {number} delay - delay before the animation starts
 * @property {CSSTimingFunction} timingFunction - timing function for the animation
 * @property {boolean} respectMotionPreference - whether to respect the user's motion preference
 * @property {VoidFunction} onAnimationComplete - callback function to be called when the animation is complete
 */
interface AnimationConfigParams {
  keyframes: Array<Keyframe>;
  duration: number;
  delay: number;
  timingFunction: CSSTimingFunction;
  respectMotionPreference: boolean;
  onAnimationComplete?: VoidFunction;
}

/**
 * Hook for handling animations
 * @returns object with animation state, element ref and whether to animate or not
 */
export default function useAnimation({
  keyframes,
  duration,
  delay,
  timingFunction,
  respectMotionPreference,
  onAnimationComplete,
}: AnimationConfigParams): AnimationController {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const elementRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number>(null);
  const animationRef = useRef<Animation | undefined>(undefined);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  const keyframesSignature = JSON.stringify(keyframes);

  useEffect(() => {
    if (prefersReducedMotion() && respectMotionPreference) {
      setAnimationState('complete');
      onAnimationCompleteRef.current?.();
      return;
    }
    setAnimationState('animating');
    const animation = elementRef.current?.animate(keyframes, {
      delay,
      duration,
      direction: 'normal',
      easing: timingFunction,
      fill: 'forwards',
    });
    animationRef.current = animation;

    const finish = () => {
      setAnimationState('complete');
      onAnimationCompleteRef.current?.();
    };

    if (animation) {
      let finished = false;
      const completeOnce = () => {
        if (finished) return;
        finished = true;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        finish();
      };

      timerRef.current = window.setTimeout(completeOnce, duration + delay);
      if (animation.finished) {
        void animation.finished.then(completeOnce).catch(() => {});
      }
    } else {
      scheduleAnimationComplete(
        timerRef,
        duration,
        delay,
        () => onAnimationCompleteRef.current?.(),
        setAnimationState
      );
    }

    return () => {
      animationRef.current?.cancel();
      animationRef.current = undefined;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    duration,
    delay,
    keyframesSignature,
    timingFunction,
    respectMotionPreference,
  ]);

  return {
    elementRef,
    animationState,
    setAnimationState,
    cancelAnimation: () => animationRef.current?.cancel(),
    pauseAnimation: () => animationRef.current?.pause(),
    resumeAnimation: () => animationRef.current?.play(),
    shouldAnimate: animationState !== 'complete',
  };
}
