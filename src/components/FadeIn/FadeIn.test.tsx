import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import { FadeIn } from './FadeIn';

beforeEach(() => {
  // Reset matchMedia mock before each test
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as any);
});

test('Renders children correctly', () => {
  render(<FadeIn>Test Content</FadeIn>);
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});

test('Starts with initial opacity when animation disabled', () => {
  // Mock prefersReducedMotion to return true (animation disabled)
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: true, // This makes prefersReducedMotion return true
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as any);

  const { container } = render(
    <FadeIn from={0} to={1}>
      Test Content
    </FadeIn>
  );
  const element = container.firstChild as HTMLElement;
  expect(element).toHaveTextContent('Test Content');
  expect(element.style.opacity).toBe('1'); // Should be final opacity when animation is disabled
});

test('Animates to final opacity', async () => {
  const { container } = render(
    <FadeIn duration={100} to={1}>
      Test Content
    </FadeIn>
  );
  const element = container.firstChild as HTMLElement;

  await waitFor(
    () => {
      expect(element.style.opacity).toBe('1');
    },
    { timeout: 200 }
  );
});

test('Calls onAnimationComplete callback', async () => {
  const onComplete = vi.fn();
  render(
    <FadeIn duration={100} onAnimationComplete={onComplete}>
      Test Content
    </FadeIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    },
    { timeout: 200 }
  );
});

test('Renders custom element type', () => {
  const { container } = render(<FadeIn as="span">Test Content</FadeIn>);
  expect(container.firstChild?.nodeName).toBe('SPAN');
});

test('Applies custom className', () => {
  const { container } = render(
    <FadeIn className="custom-class">Test Content</FadeIn>
  );
  const element = container.firstElementChild;
  expect(element?.className).toContain('custom-class');
});

test('Respects delay prop', async () => {
  const onComplete = vi.fn();
  render(
    <FadeIn duration={50} delay={100} onAnimationComplete={onComplete}>
      Test Content
    </FadeIn>
  );

  // Should not complete before delay + duration (150ms total)
  await new Promise(resolve => setTimeout(resolve, 75));
  expect(onComplete).not.toHaveBeenCalled();

  // Should complete after delay + duration
  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    },
    { timeout: 300 }
  );
});
