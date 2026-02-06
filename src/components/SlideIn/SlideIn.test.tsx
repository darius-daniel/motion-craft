// import react-testing methods
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import SlideIn, { type SlideDirection } from './SlideIn';

test('Renders children correctly', () => {
  // Render a React element into the DOM
  let { container } = render(<SlideIn>Test content</SlideIn>);
  expect(container.firstElementChild?.nodeName).toBe('DIV');
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders custom element type', () => {
  let { container } = render(<SlideIn as="section">Test content</SlideIn>);
  expect(container.firstChild?.nodeName).toBe('SECTION');
});

test('Apply custom className', () => {
  let { container } = render(
    <SlideIn className="custom-class">Test content</SlideIn>
  );
  expect(container.firstElementChild?.className).toContain('custom-class');
});

test('Calls onAnimationComplete callback', async () => {
  const onComplete = vi.fn();
  render(<SlideIn duration={100} onAnimationComplete={onComplete} />);

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Apply custom style', () => {
  const { container } = render(
    <SlideIn style={{ color: '#ffeeff' }}>Test content</SlideIn>
  );
  const element = container.firstElementChild;

  expect(element).toHaveStyle({ color: '#ffeeff' });
});

test('animation skip when prefers-reduced-motion is enabled', () => {
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

  let { container } = render(
    <SlideIn respectMotionPreference={true}>Test Content</SlideIn>
  );
  let element = container.firstElementChild;
  expect(element).toHaveTextContent('Test Content');

  // When animation is skipped, the element should be immediately visible
  // This test verifies that the component renders without waiting for animation
  expect(element).toHaveStyle({
    opacity: 1,
    transform: 'translateY(0)',
  });

  // Test with fade prop
  ({ container } = render(
    <SlideIn fade respectMotionPreference={true}>
      Test Content
    </SlideIn>
  ));
  element = container.firstElementChild;
  expect(element).toHaveTextContent('Test Content');

  expect(element).toHaveStyle({
    opacity: 1,
    transform: 'translateY(0)',
  });
});

const slideDirections: SlideDirection[] = [
  'fromTop',
  'fromBottom',
  'fromLeft',
  'fromRight',
];
slideDirections.forEach(direction => {
  test(`slideDirection: ${direction}`, () => {
    const { container } = render(
      <SlideIn slideDirection={direction} respectMotionPreference>
        Test Content
      </SlideIn>
    );
    const element = container.firstElementChild;

    expect(element).toHaveTextContent('Test Content');
    expect(element).toHaveStyle({
      opacity: 1,
      transform: ['fromTop', 'fromBottom'].includes(direction)
        ? 'translateY(0)'
        : 'translateX(0)',
    });
  });
});

test('with default duration', async () => {
  const defaultDuration = 500;
  const onComplete = vi.fn();
  render(<SlideIn onAnimationComplete={onComplete}></SlideIn>);

  // Should not be called immediately
  expect(onComplete).not.toHaveBeenCalled();

  // Should be called after default duration
  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: defaultDuration + 100 }
  );
});

test('with custom duration', async () => {
  const onComplete = vi.fn();
  const duration = 350;
  render(
    <SlideIn onAnimationComplete={onComplete} duration={duration}></SlideIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: duration + 100 }
  );
});

test('with default delay', async () => {
  const onComplete = vi.fn();
  render(
    <SlideIn onAnimationComplete={onComplete} respectMotionPreference></SlideIn>
  );

  // With reduced motion, callback should be called immediately
  await waitFor(() => {
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

test('with custom delay', async () => {
  const delay = 200;
  const onComplete = vi.fn();
  render(
    <SlideIn
      onAnimationComplete={onComplete}
      duration={0}
      delay={delay}
    ></SlideIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: delay + 100 }
  );
});

test('with custom delay and duration', async () => {
  const delay = 200;
  const duration = 450;
  const onComplete = vi.fn();
  render(
    <SlideIn
      duration={duration}
      delay={delay}
      onAnimationComplete={onComplete}
    ></SlideIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: delay + duration + 100 }
  );
});
