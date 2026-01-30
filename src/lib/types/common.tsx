export type AnimationState = 'idle' | 'animating' | 'complete';

export interface BaseAnimationProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
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
