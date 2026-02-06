import type React from 'react';

export type AnimationState = 'idle' | 'animating' | 'complete';

export interface BaseAnimationProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  duration?: number; // How long it takes the animation from start to finish (ms)
  delay?: number; // How long it takes the animation to start from component load (ms)
  timingFunction?:
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'linear'
    | 'step-start'
    | 'step-end';
  onAnimationComplete?: () => void; // Callback when animation completes
  respectMotionPreference?: boolean;
  styles?: React.CSSProperties;
  ref?: React.RefObject<HTMLElement | null>;
}

export const EASING_PRESETS = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;
