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