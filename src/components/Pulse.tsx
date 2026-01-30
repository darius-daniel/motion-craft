import { useEffect, useRef } from 'react';

interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function Pulse({
  children,
  scale = 1.1,
  duration = 100000,
  className = '',
}: PulseProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const progress = (elapsed % duration) / duration;
      const scaleAmount =
        1 + (scale - 1) * Math.abs(Math.sin(progress * Math.PI * 2));

      element.style.transform = `scale(${scaleAmount})`;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scale, duration]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
